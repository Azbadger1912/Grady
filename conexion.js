const path = require('path');
const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Configuración del pool de conexiones a la base de datos
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    database: "prueba1",
    user: "root",
    password: "",
});

// Configuración de la sesión
app.use(session({
    secret: 'tu_secreto', // Cambia esto por un valor seguro
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Usar secure: true si estás usando HTTPS
}));

// Configurar bodyParser para procesar solicitudes POST
app.use(bodyParser.json());

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next(); // El usuario está autenticado, continuar a la página solicitada
    } else {
        res.redirect('/inicio_sesion.html'); // El usuario no está autenticado, redirigir a la página de inicio de sesión
    }
}

// Aplicar el middleware de autenticación a todas las rutas
app.use((req, res, next) => {
    if (
        req.path === '/inicio_sesion.html' || 
        req.path === '/pagina_inicio.html' || 
        req.path.startsWith('/scripts/') || 
        req.path.startsWith('/styles/') || 
        req.path.startsWith('/assets/') || 
        req.path === '/login'
    ) {
        return next(); // Permitir el acceso a las páginas y archivos estáticos no protegidos
    } else {
        return isAuthenticated(req, res, next); // Verificar autenticación para otras páginas
    }
});

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para manejar el inicio de sesión
app.post('/login', (req, res) => {
    const { user_name, pass } = req.body;

    // Primero, busca al usuario en la tabla `usuarios`
    pool.query('SELECT * FROM usuarios WHERE Cedula = ?', [user_name], (error, results, fields) => {
        if (error) {
            console.error('Error en la consulta:', error.stack);
            res.status(500).send('Error en la consulta');
            return;
        }

        if (results.length > 0) {
            const user = results[0];

            // Verificar la contraseña
            if (user.Password === pass) {

                let perfil;
                if (user.Perfil === 'estudiante') {
                    perfil = 'estudiantes';
                } else if (user.Perfil === 'profesor') {
                    perfil = 'profesores';
                } else {
                    perfil = 'administradores';
                }

                // Busca detalles adicionales en la tabla correspondiente según el perfil
                pool.query(`SELECT * FROM ${perfil} WHERE Cedula = ?`, [user_name], (error, results, fields) => {
                    if (error) {
                        console.error('Error en la consulta:', error.stack);
                        res.status(500).send('Error en la consulta');
                        return;
                    }

                    if (results.length > 0) {
                        const detailedUser = results[0];

                        // Almacena los detalles del usuario en la sesión
                        req.session.user = {
                            grado: detailedUser.Salon || '', // Solo para estudiantes
                            cedula: detailedUser.Cedula,
                            userName: detailedUser.Nombres,
                            userLastName: detailedUser.Apellidos,
                            consejero: detailedUser.Consejero || '', // Solo para estudiantes
                            consejeria: detailedUser.Consejeria || '', // Solo para profesores
                            contrasena: detailedUser.Password,
                            correo: detailedUser.Correo,
                            userNickName: detailedUser.Usuario,
                        };

                        // Redirige a la página principal
                        res.json({ success: true , perfil: perfil});
                    } else {
                        res.status(404).send('Detalles adicionales no encontrados');
                    }
                });

            } else {
                res.json({ success: false }); // Contraseña incorrecta
            }
        } else {
            res.json({ success: false }); // Usuario no encontrado
        }
    });
});

// Ruta para obtener datos del usuario autenticado
app.get('/user_data', isAuthenticated, (req, res) => {
    res.json(req.session.user);
});

// Ruta para manejar el cierre de sesión
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/inicio_sesion.html');
    });
});

// Ejemplo de una ruta protegida
app.get('/agenda_data', isAuthenticated, (req, res) => {
    const grado = req.session.user.grado.toLowerCase();
    pool.query(`SELECT * FROM asignaciones_${grado}`, (error, results, fields) => {
        if (error) {
            console.error('Error en la consulta:', error.stack);
            res.status(500).send('Error en la consulta');
            return;
        }
        res.json(results);
    });
});

// Ejemplo de una ruta protegida
app.get('/agenda_prof_data', isAuthenticated, (req, res) => {
    const cedula = req.session.user.cedula.toLowerCase();
    pool.query(`SELECT * FROM asignaciones_${cedula}`, (error, results, fields) => {
        if (error) {
            console.error('Error en la consulta:', error.stack);
            res.status(500).send('Error en la consulta');
            return;
        }
        res.json(results);
    });
});

app.post('/add-asignacion-prof', isAuthenticated, (req, res) => {
    const { materia, tema, indPrin, IndDet, tipo, asignacion, adjunto, fecha, grupo, trimestre } = req.body;

    // Usa el grado del usuario autenticado para construir el nombre de la tabla
    const tablaAsignaciones = `asignaciones_${req.session.user.cedula.toLowerCase()}`;

    const insertQuery = `INSERT INTO ${tablaAsignaciones} (Materia, Tema, Ind_Prin, Ind_Det, Tipo, Asignacion, Adjunto, Fecha, Grupo, Trimestre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    pool.query(insertQuery, [ materia, tema, indPrin, IndDet, tipo, asignacion, adjunto, fecha, grupo, trimestre ], (error, results) => {
        if (error) {
            console.error('Error al insertar la asignación:', error.stack);
            res.status(500).send('Error al insertar la asignación');
            return;
        }
        res.status(201).send('Asignación añadida con éxito');
    });
});

app.post('/add-asignacion-grado', isAuthenticated, (req, res) => {
    const { materia, tema, indPrin, IndDet, tipo, asignacion, adjunto, fecha, grupo } = req.body;

    // Usa el grado del usuario autenticado para construir el nombre de la tabla
    const tablaAsignaciones = `asignaciones_${grupo.toLowerCase()}`;

    const insertQuery = `INSERT INTO ${tablaAsignaciones} (Materia, Tema, Ind_Prin, Ind_Det, Tipo, Asignacion, Adjunto, Fecha) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    pool.query(insertQuery, [ materia, tema, indPrin, IndDet, tipo, asignacion, adjunto, fecha, grupo ], (error, results) => {
        if (error) {
            console.error('Error al insertar la asignación:', error.stack);
            res.status(500).send('Error al insertar la asignación');
            return;
        }
        res.status(201).send('Asignación añadida con éxito');
    });
});

app.post('/add-evaluacion', isAuthenticated, (req, res) => {
    const { materia, titulo, tipo, nombre, grupo, trimestre, descripcion, ponderacion } = req.body;

    // Usa el grado del usuario autenticado para construir el nombre de la tabla
    const tablaAsignaciones = `evaluaciones_${req.session.user.cedula.toLowerCase()}`;

    const insertQuery = `INSERT INTO ${tablaAsignaciones} (Materia, Titulo, Tipo, Nombre, Grupo, Trimestre, Descripcion, Ponderacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    pool.query(insertQuery, [ materia, titulo, tipo, nombre, grupo, trimestre, descripcion, ponderacion ], (error, results) => {
        if (error) {
            console.error('Error al insertar la asignación:', error.stack);
            res.status(500).send('Error al insertar la asignación');
            return;
        }
        res.status(201).send('Asignación añadida con éxito');
    });
});

app.post('/add-nota', isAuthenticated, (req, res) => {
    const { materia, cedula, titulo, nota , trimestre} = req.body;

    // Usa el grado del usuario autenticado para construir el nombre de la tabla
    const tablaAsignaciones = `notas_prof_${req.session.user.cedula.toLowerCase()}`;

    const insertQuery = `INSERT INTO ${tablaAsignaciones} (Materia, Cedula, Titulo, Nota , Trimestre) VALUES (?, ?, ?, ?, ?)`;

    pool.query(insertQuery, [ materia, cedula, titulo, nota , trimestre ], (error, results) => {
        if (error) {
            console.error('Error al insertar la asignación:', error.stack);
            res.status(500).send('Error al insertar la asignación');
            return;
        }
        res.status(201).send('Asignación añadida con éxito');
    });
});

app.put('/delete-evaluacion', isAuthenticated, (req, res) => {
    const { materia, titulo, grupo, trimestre } = req.body;
    const tablaAsignaciones = `evaluaciones_${req.session.user.cedula.toLowerCase()}`;

    const deleteQuery = `DELETE FROM ${tablaAsignaciones} WHERE Titulo LIKE ? AND Materia = ? AND Grupo = ? AND Trimestre = ?`;

    pool.query(deleteQuery, [`${titulo}%`, materia, grupo, trimestre], (err, results) => {
        if (err) {
            console.error('Error al eliminar la asignación:', err.stack);
            res.status(500).send('Error al eliminar la asignación');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('Asignación no encontrada');
            return;
        }
        res.send('Asignación borrada con éxito');
    });
});

app.put('/delete-nota', isAuthenticated, (req, res) => {
    const { materia, titulo, cedula, trimestre } = req.body;
    const tablaAsignaciones = `notas_prof_${req.session.user.cedula.toLowerCase()}`;

    const deleteQuery = `DELETE FROM ${tablaAsignaciones} WHERE Titulo = ? AND Materia = ? AND Cedula = ? AND Trimestre = ?`;

    pool.query(deleteQuery, [ titulo, materia, cedula, trimestre ], (err, results) => {
        if (err) {
            console.error('Error al eliminar la asignación:', err.stack);
            res.status(500).send('Error al eliminar la asignación');
            return;
        }
        if (results.affectedRows === 0) {
            res.send('Asignación no encontrada');
            return;
        }
        res.send('Asignación borrada con éxito');
    });
});

app.get('/notas_prof_data', isAuthenticated, (req, res) => {
    const cedula = req.session.user.cedula.toLowerCase();
    pool.query(`SELECT * FROM notas_prof_${cedula}`, (error, results, fields) => {
        if (error) {
            console.error('Error en la consulta:', error.stack);
            res.status(500).send('Error en la consulta');
            return;
        }
        res.json(results);
    });
});

app.get('/materias_prof_data', isAuthenticated, (req, res) => {
    const cedula = req.session.user.cedula.toLowerCase();
    pool.query(`SELECT * FROM materias_${cedula}`, (error, results, fields) => {
        if (error) {
            console.error('Error en la consulta:', error.stack);
            res.status(500).send('Error en la consulta');
            return;
        }
        res.json(results);
    });
});

app.post('/estudiantes_prof', isAuthenticated, (req, res) => {
    const { grupo } = req.body;

    const readQuery = `SELECT * FROM estudiantes WHERE Salon= ?`;

    pool.query(readQuery, [ grupo ], (error, results) => {
        if (error) {
            console.error('Error en la consulta:', error.stack);
            res.status(500).send('Error en la consulta');
            return;
        }
        res.json(results);;
    });
});

app.get('/evaluacion_data', isAuthenticated, (req, res) => {
    const cedula = req.session.user.cedula.toLowerCase();
    pool.query(`SELECT * FROM evaluaciones_${cedula}`, (error, results, fields) => {
        if (error) {
            console.error('Error en la consulta:', error.stack);
            res.status(500).send('Error en la consulta');
            return;
        }
        res.json(results);
    });
});

// Ejemplo de una ruta protegida
app.get('/agenda_conse_data', isAuthenticated, (req, res) => {
    const consejeria = req.session.user.consejeria.toLowerCase();
    pool.query(`SELECT * FROM asignaciones_${consejeria}`, (error, results, fields) => {
        if (error) {
            console.error('Error en la consulta:', error.stack);
            res.status(500).send('Error en la consulta');
            return;
        }
        res.json(results);
    });
});

// Ejemplo de otra ruta protegida
app.get('/notas_data', isAuthenticated, (req, res) => {
    const cedula = req.session.user.cedula.toLowerCase();
    pool.query(`SELECT * FROM notas_${cedula}`, (error, results, fields) => {
        if (error) {
            console.error('Error en la consulta:', error.stack);
            res.status(500).send('Error en la consulta');
            return;
        }
        res.json(results);
    });
});

app.get('/materias_data', isAuthenticated, (req, res) => {
    const grado = req.session.user.grado.toLowerCase();
    pool.query(`SELECT * FROM materias_${grado}`, (error, results, fields) => {
        if (error) {
            console.error('Error en la consulta:', error.stack);
            res.status(500).send('Error en la consulta');
            return;
        }
        res.json(results);
    });
});

app.get('/conducta_data', isAuthenticated, (req, res) => {
    const cedula = req.session.user.cedula.toLowerCase();
    pool.query(`SELECT * FROM conducta_${cedula}`, (error, results, fields) => {
        if (error) {
            console.error('Error en la consulta:', error.stack);
            res.status(500).send('Error en la consulta');
            return;
        }
        res.json(results);
    });
});

app.get('/observacion_data', isAuthenticated, (req, res) => {
    const cedula = req.session.user.cedula.toLowerCase();
    pool.query(`SELECT * FROM observaciones_${cedula}`, (error, results, fields) => {
        if (error) {
            console.error('Error en la consulta:', error.stack);
            res.status(500).send('Error en la consulta');
            return;
        }
        res.json(results);
    });
});

app.get('/promedios_data', isAuthenticated, (req, res) => {
    const cedula = req.session.user.cedula.toLowerCase();
    pool.query(`SELECT * FROM promedios_${cedula}`, (error, results, fields) => {
        if (error) {
            console.error('Error en la consulta:', error.stack);
            res.status(500).send('Error en la consulta');
            return;
        }
        res.json(results);
    });
});

// Ruta para actualizar información del usuario
app.put('/update-user', isAuthenticated, (req, res) => {
    const { id, nombre, correo } = req.body;
    const updateQuery = `UPDATE estudiantes SET Usuario = ?, Correo = ? WHERE Cedula = ?`;

    pool.query(updateQuery, [nombre, correo, id], (err, results) => {
        if (err) {
            console.error('Error al actualizar datos:', err.stack);
            res.status(500).send('Error al actualizar datos');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('Usuario no encontrado');
            return;
        }
        res.send('Usuario actualizado con éxito');
    });
});

// Ruta para actualizar información del usuario

app.put('/update-password', isAuthenticated, (req, res) => {
    const { id, contrasena} = req.body;
    const updateQuery = `UPDATE estudiantes SET Password = ? WHERE Cedula = ?`;

    pool.query(updateQuery, [contrasena, id], (err, results) => {
        if (err) {
            console.error('Error al actualizar datos:', err.stack);
            res.status(500).send('Error al actualizar datos');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('Usuario no encontrado');
            return;
        }
        res.send('Usuario actualizado con éxito');
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
