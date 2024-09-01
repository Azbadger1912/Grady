// Declaracion de la vairable de cedula para usos posteriores
let cedula;

// Consulta y Colocacion de los datos del usuario
document.addEventListener("DOMContentLoaded", function() {
    fetch('/user_data')
        .then(response => response.json())
        .then(data => {
          // Obtencion de datos del usuario
          const pass = data.contrasena;
          const userName = data.userNickName;
          const correo = data.correo;
          cedula = data.cedula;

          // Colocacion de datos en el formato adecuado
          const usuario = document.getElementById('user');
          const password = document.getElementById('pass');
          const email = document.getElementById('email');
          usuario.value = userName;
          password.value = pass;
          email.value = correo;
        })
        .catch(error => console.error('Error al obtener los datos del usuario:', error));
});

// Modificar datos principales del usuario
function modificarDatos(){

  // Obtencion de datos a modificar de los inputs
  const nombre = document.getElementById('user').value;
  const correo = document.getElementById('email').value;

  // Peticion PUT para actualizar los datos en la base de datos
  fetch('/update-user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
      },
    body: JSON.stringify({
      id: cedula,
      nombre: nombre,
      correo: correo,
      })
  })
  .then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Error al actualizar datos');
    }
  })
  .then(data => {
    alert(data);
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error al actualizar usuario');
  });
}

// Modificar contraseña del usuario
function modificarPass() {

  // Obtencion de datos a modificar de los inputs
  const passIn = document.getElementById('pass1').value;
  const passInConfirm = document.getElementById('pass2').value;

  if (passIn === passInConfirm && passIn !== '') {
    
    // Peticion PUT para actualizar la contraseña en la base de datos
    fetch('/update-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: cedula,
        contrasena: passIn
      })
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('Error al actualizar datos');
      }
    })
    .then(data => {
      alert(data);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al actualizar usuario');
    });

    document.getElementById('pass1').value = '';
    document.getElementById('pass2').value = '';
    document.getElementById('pass2').placeholder = '';
  } else {
      document.getElementById('pass2').value = '';
      document.getElementById('pass1').placeholder = 'Contraseña incorrecta';
      document.getElementById('pass2').placeholder = 'Contraseña incorrecta';
  }
}
