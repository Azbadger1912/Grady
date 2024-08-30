document.addEventListener('DOMContentLoaded', function() {
    selec_vent('div_plan_eval', 'btn_plan_eval');
});

function mostrarModal(){
    modal.showModal();
}

function ocultarModal(){
    modal.close();
}

function selec_vent(cont, bot){
    var conteiner = document.getElementById(cont);
    var cont_1 = document.getElementById('div_plan_eval');
    var cont_2 = document.getElementById('div_lib_eval');
    var cont_3 = document.getElementById('div_at');
    var cont_4 = document.getElementById('div_prom_per');
    var cont_5 = document.getElementById('div_tran_lib');
    var boton = document.getElementById(bot);
    var bot_1 = document.getElementById('btn_plan_eval');
    var bot_2 = document.getElementById('btn_lib_eval');
    var bot_3 = document.getElementById('btn_at');
    var bot_4 = document.getElementById('btn_prom_per');
    var bot_5 = document.getElementById('btn_tran_lib');
    bot_1.classList.remove('s_bot');
    bot_2.classList.remove('s_bot');
    bot_3.classList.remove('s_bot');
    bot_4.classList.remove('s_bot');
    bot_5.classList.remove('s_bot');
    cont_1.classList.remove('s');
    cont_2.classList.remove('s');
    cont_3.classList.remove('s');
    cont_4.classList.remove('s');
    cont_5.classList.remove('s');
    conteiner.classList.add('s');
    boton.classList.add('s_bot');
}

async function fetchDataEst() {

    await new Promise(resolve => setTimeout(resolve, 80));

    const grado = selectElementCon.options[selectElementCon.selectedIndex].text;

    fetch('/estudiantes_prof', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            grupo: grado.toLowerCase(),
        })
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Error al añadir la asignación');
        }
    })
    .then(data => {
        const jsonString = data;
        const dataArray = JSON.parse(jsonString);
        for(let dato of dataArray) {
            creFilTabNotas(dato['Cedula'], dato['Nombres'], dato['Apellidos']);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al añadir la asignación');
    });

}

async function fetchDataMat(tip) {
    try {
        const response = await fetch('/materias_prof_data');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        if (tip == 'Grado'){
            let valor = 1;
            for (let dato of data) {
                const cbm = document.getElementById('grado');
                const cbmOption = document.createElement('option');
                cbmOption.value = valor;
                cbmOption.textContent = dato['Grupo'].toUpperCase();
                cbm.appendChild(cbmOption);
                valor++;
            }
        } else {
            let valor = 1;
            for (let dato of data) {
                if (selectElementCon.options[selectElementCon.selectedIndex].text == dato['Grupo'].toUpperCase()) {
                    const cbm = document.getElementById('materia');
                    const cbmOption = document.createElement('option');
                    cbmOption.value = valor;
                    cbmOption.className = 'option-created';
                    cbmOption.textContent = dato['Materia'].toUpperCase();
                    cbm.appendChild(cbmOption);
                    valor++;
                }
            }
        }

    } catch (error) {
        console.error('Error obteniendo los datos:', error);
    }
}

async function evaData() {
    try {
        const response = await fetch('/evaluacion_data');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 30));
        const grado = selectElementCon.options[selectElementCon.selectedIndex].text;
        const materia = selectElementCon2.options[selectElementCon2.selectedIndex].text;
        let trimestre;
        if(selectElementCon3.value == 1){trimestre = 'Primero';}
        else if (selectElementCon3.value == 2){trimestre = 'Segundo';}
        else {trimestre = 'Tercero';}
        const selectText = `${grado}-${materia}-${trimestre}`;
        for (let dato of data) {
            const dataText = `${dato['Grupo']}-${dato['Materia']}-${dato['Trimestre']}`;
            if (dataText.toUpperCase() == selectText.toUpperCase()){
                createFilPlanEva(dato['Tipo'], dato['Titulo'], dato['Descripcion'], dato['Ponderacion']);
                creColumNotas(dato['Tipo'], dato['Nombre']);
            }
        }

    } catch (error) {
        console.error('Error obteniendo los datos:', error);
    }
}

async function fetchNotasData() {
    try {
        const response = await fetch('/notas_prof_data');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 120));
        const materia = selectElementCon2.options[selectElementCon2.selectedIndex].text;
        let trimestre;
        if(selectElementCon3.value == 1){trimestre = 'Primero';}
        else if (selectElementCon3.value == 2){trimestre = 'Segundo';}
        else {trimestre = 'Tercero';}

        for (let dato of data) {
            if (trimestre == dato['Trimestre'] && materia == dato['Materia']){
                actNotCed(dato['Cedula'], dato['Nota'], dato['Titulo']);
            }
        }

    } catch (error) {
        console.error('Error obteniendo los datos:', error);
    }
}

function createFilPlanEva(titulo, asignacion, descp, ponde) {
    const tabla = document.getElementById('plan_table');
    const rows = tabla.rows;

    // Extraer la palabra de la asignación sin el número
    const palabraAsignacion = asignacion.replace(/\d+$/, '');

    // Verificar si ya existe una fila con el mismo título y palabra en la asignación
    for (let i = 1; i < rows.length; i++) {
        if (rows[i].cells[0].textContent === titulo && rows[i].cells[1].textContent === palabraAsignacion) {
            // Si se encuentra, actualizar la celda de cantidad sumando 1
            const cantidadActual = parseInt(rows[i].cells[2].textContent, 10);
            rows[i].cells[2].textContent = cantidadActual + 1;
            return;
        }
    }

    // Si no se encuentra una fila existente, crear una nueva fila y celdas
    const fila = document.createElement('tr');
    fila.classList.add('created-element-eva-tab');
    const celdaClas = document.createElement('td');
    celdaClas.className = 'clasif_cont';
    celdaClas.textContent = titulo;
    const celdaAsign = document.createElement('td');
    celdaAsign.style.fontSize = '14px';
    celdaAsign.textContent = palabraAsignacion;
    const celdaCant = document.createElement('td');
    celdaCant.textContent = '1';
    const celdaDes = document.createElement('td');
    celdaDes.textContent = descp;
    const celdaPond = document.createElement('td');
    celdaPond.textContent = (parseFloat(ponde)).toFixed(1);
    const celdaEdit = document.createElement('td');
    celdaEdit.className = 'desnone';
    const botonEdit = document.createElement('button');
    const iconBoton = document.createElement('i');
    iconBoton.classList.add('bx', 'bx-pencil');
    botonEdit.appendChild(iconBoton);
    botonEdit.addEventListener('click', function() {
        const celdas = fila.cells;
        let datosFila = [];
        for (let i = 0; i < celdas.length; i++) {
            datosFila.push(celdas[i].textContent);
        }
        mostrarModal();
        if (datosFila['0'] == 'Nota Diaria'){document.getElementById('clasif-select').value = 1;}
        else if (datosFila['0'] == 'Apreciación'){document.getElementById('clasif-select').value = 2;}
        else {document.getElementById('clasif-select').value = 3;}

        document.getElementById("asig-input").value = datosFila['1'];
        document.getElementById("asig-input").disabled = true;
        document.getElementById('cant-asig').textContent = datosFila['2'];
        document.getElementById("descr-input").value = datosFila['3'];
        document.getElementById("pond-input").value = parseFloat(datosFila['4']).toFixed(1);
        document.getElementById('btn_ok_modal').setAttribute('onclick', `deleteEvaData('true')`);
        document.getElementById('btn_delete_modal').setAttribute('onclick', `deleteEvaData('false')`);
    });
    celdaEdit.appendChild(botonEdit);

    fila.appendChild(celdaClas);
    fila.appendChild(celdaAsign);
    fila.appendChild(celdaCant);
    fila.appendChild(celdaDes);
    fila.appendChild(celdaPond);
    fila.appendChild(celdaEdit);

    // Lógica de inserción según las reglas
    if (rows.length === 2) {
        tabla.tBodies[0].insertBefore(fila, rows[1]);
        return;
    }

    if (titulo === "Nota Diaria") {
        let lastNotaDiariaRow = null;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i].cells[0].textContent === "Nota Diaria") {
                lastNotaDiariaRow = rows[i];
            }
        }
        if (lastNotaDiariaRow) {
            tabla.tBodies[0].insertBefore(fila, lastNotaDiariaRow.nextSibling);
        } else {
            tabla.tBodies[0].insertBefore(fila, rows[1]);
        }
        return;
    }

    if (titulo === "Apreciación") {
        let lastApreciacionRow = null;
        let lastNotaDiariaRow = null;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i].cells[0].textContent === "Apreciación") {
                lastApreciacionRow = rows[i];
            }
            if (rows[i].cells[0].textContent === "Nota Diaria") {
                lastNotaDiariaRow = rows[i];
            }
        }
        if (lastApreciacionRow) {
            tabla.tBodies[0].insertBefore(fila, lastApreciacionRow.nextSibling);
        } else if (lastNotaDiariaRow) {
            tabla.tBodies[0].insertBefore(fila, lastNotaDiariaRow.nextSibling);
        } else {
            tabla.tBodies[0].insertBefore(fila, rows[1]);
        }
        return;
    }

    if (titulo === "Prueba Final") {
        tabla.tBodies[0].insertBefore(fila, rows[rows.length - 1]);
    }
}

async function publicEvaData(){
    function cantiAsigna(tipo) {
        const tabla = document.getElementById('plan_table');
        const rows = tabla.rows;

        let suma = 0;
    
        for (let i = 1; i < rows.length; i++) { // Comenzar en 1 para omitir la cabecera
            if (rows[i].cells[0].textContent === tipo) {
                suma += parseInt(rows[i].cells[2].textContent, 10); // Sumar el valor numérico de la tercera celda
            }
        }
    
        return suma;
    }
    const titulo = document.getElementById("asig-input").value;
    if (titulo !== ''){

        let tipo;
        if (document.getElementById('clasif-select').value == 1){tipo = 'Nota Diaria';}
        else if (document.getElementById('clasif-select').value == 2){tipo = 'Apreciación';}
        else {tipo = 'Prueba Final';}

        const pond = document.getElementById('pond-input').value;
        const cant = document.getElementById('cant-asig').textContent;
        let descrip; if (document.getElementById('descr-input').value == ''){descrip = '-';}
        else{descrip = document.getElementById('descr-input').value;}
        const grado = selectElementCon.options[selectElementCon.selectedIndex].text;
        const materia = selectElementCon2.options[selectElementCon2.selectedIndex].text;

        let trimestre;
        if(selectElementCon3.value == 1){trimestre = 'Primero';}
        else if (selectElementCon3.value == 2){trimestre = 'Segundo';}
        else {trimestre = 'Tercero';}

        for(let i = 1; i <= parseInt(cant); i++){
            let nombre;
            if(tipo == 'Nota Diaria'){
                nombre = `N${cantiAsigna(tipo) + i}`;
            } else if (tipo == 'Apreciación'){
                nombre = `AP${cantiAsigna(tipo) + i}`;
            } else {
                nombre = `TRIM${cantiAsigna(tipo) + i}`;
            }

            fetch('/add-evaluacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    materia: materia,
                    titulo: `${titulo.toUpperCase()}${i}`,
                    tipo: tipo,
                    nombre: nombre,
                    grupo: grado.toLowerCase(),
                    trimestre: trimestre,
                    descripcion: descrip,
                    ponderacion: pond,
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('Error al añadir la asignación');
                }
            })
            .then(data => {
                console.log(data);
                ocultarModal();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al añadir la asignación');
            });

            await new Promise(resolve => setTimeout(resolve, 100));
        }
    } else {
        document.getElementById("asig-input").style.backgroundColor = "#FFDDDD";
        document.getElementById("asig-input").setAttribute('placeholder', 'Debe ingresar un título');
    }

    const elementEvaTab = document.querySelectorAll('.created-element-eva-tab');
    elementEvaTab.forEach(element => element.remove());
    const elementNotTab = document.querySelectorAll('.created-element-not-tab');
    elementNotTab.forEach(element => element.remove());
    evaData();
    fetchDataEst();
    fetchNotasData();
}

async function deleteEvaData(act){
    const titulo = document.getElementById("asig-input").value;
    const grado = selectElementCon.options[selectElementCon.selectedIndex].text;
    const materia = selectElementCon2.options[selectElementCon2.selectedIndex].text;
    let trimestre;
    if(selectElementCon3.value == 1){trimestre = 'Primero';}
    else if (selectElementCon3.value == 2){trimestre = 'Segundo';}
    else {trimestre = 'Tercero';}
    fetch('/delete-evaluacion', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            materia: materia,
            titulo: titulo,
            grupo: grado.toLowerCase(),
            trimestre: trimestre
        })
    })
    .then(response => {
        if (response.ok) {
            return response.text(); // O .json() si esperas una respuesta en JSON
        } else {
            throw new Error('Error al eliminar la evaluación');
        }
    })
    .then(data => {
        console.log(data); // Mensaje de éxito desde el servidor
        const elementEvaTab = document.querySelectorAll('.created-element-eva-tab');
        elementEvaTab.forEach(element => element.remove());
        const elementNotTab = document.querySelectorAll('.created-element-not-tab');
        elementNotTab.forEach(element => element.remove());
        if (act == 'true'){
            publicEvaData();
        } else {
            ocultarModal()
            evaData();
            fetchDataEst();
            fetchNotasData();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar la evaluación');
    });
}

function vaciar(){
    document.getElementById("asig-input").style.backgroundColor = "#FFFFFF";
    document.getElementById("asig-input").setAttribute('placeholder', 'Título');
    document.getElementById("asig-input").disabled = false;
    document.getElementById("pond-input").value = '';
    document.getElementById("asig-input").value = '';
    document.getElementById('descr-input').value = '';
    document.getElementById('cant-asig').textContent = 1;
    document.getElementById('clasif-select').value = 1;
    document.getElementById('btn_ok_modal').setAttribute('onclick', 'publicEvaData()');
    document.getElementById('btn_delete_modal').setAttribute('onclick', 'vaciar()');
}

async function creFilTabNotas(cedula, nombres, apellidos){
    const tabla = document.getElementById('notas_tbl');
    const fila = document.createElement('tr');
    fila.classList.add('created-element-not-tab');

    // Crear las primeras tres celdas fijas
    const celdaCed = document.createElement('td');
    celdaCed.className = 'clasif_cont';
    celdaCed.textContent = cedula.replace(/_/g, '-').toUpperCase();
    
    const celdaNom = document.createElement('td');
    celdaNom.textContent = nombres;
    
    const celdaApe = document.createElement('td');
    celdaApe.textContent = apellidos;
    
    // Añadir las celdas fijas a la fila
    fila.appendChild(celdaCed);
    fila.appendChild(celdaNom);
    fila.appendChild(celdaApe);

    // Determinar el número total de columnas en la tabla
    const columnasTotal = tabla.rows[0].cells.length;

    // Crear celdas con input para cada columna extra
    for (let i = 3; i < columnasTotal; i++) {
        const celdaNot = document.createElement('td');
        const inputNot = document.createElement('input');
        inputNot.type = 'number';
        inputNot.min = 0;
        inputNot.max = '5';
        inputNot.placeholder = '0.0';
        inputNot.style.borderRadius = '8px';
        inputNot.style.height = '80%';
        inputNot.style.width = '90%';
        inputNot.style.border = '0';
        inputNot.style.textAlign = 'center';
        inputNot.disabled = true;
        celdaNot.appendChild(inputNot);
        fila.appendChild(celdaNot);
    }

    // Añadir la fila completa a la tabla

    const celdaEdit = document.createElement('td');
    celdaEdit.className = 'desnone';
    celdaEdit.id = `celd_btn_tbl_not_${cedula.replace(/_/g, '-').toUpperCase()}`;
    const botonEdit = document.createElement('button');
    botonEdit.id = `btn_tbl_eva_${cedula.replace(/_/g, '-').toUpperCase()}`;
    botonEdit.style.marginLeft = '10px';
    const iconBoton = document.createElement('i');
    iconBoton.classList.add('bx', 'bx-pencil');
    botonEdit.appendChild(iconBoton);
    botonEdit.setAttribute('onclick', `editarNotasEva('${cedula.replace(/_/g, '-').toUpperCase()}')`);
    celdaEdit.appendChild(botonEdit);

    fila.appendChild(celdaEdit);
    tabla.appendChild(fila);
}


function creColumNotas(tipo, nombre) {
    const filaTitulos = document.getElementById('tit_notas_tbl');
    const nuevaCelda = document.createElement('td');
    nuevaCelda.textContent = nombre;
    
    if (tipo === 'Nota Diaria') {
        nuevaCelda.classList.add('ntd');
    } else if (tipo === 'Apreciación') {
        nuevaCelda.classList.add('apr');
    } else {
        nuevaCelda.classList.add('pbf');
    }

    nuevaCelda.classList.add('created-element-not-tab');

    const celdas = filaTitulos.cells;

    if (tipo === 'Nota Diaria') {
        let found = false;
        for (let i = celdas.length - 1; i >= 0; i--) {
            if (celdas[i].textContent.startsWith('N') && !celdas[i].textContent.startsWith('NOM')) {
                filaTitulos.insertBefore(nuevaCelda, celdas[i].nextSibling);
                found = true;
                break;
            }
        }
        if (!found) {
            filaTitulos.insertBefore(nuevaCelda, celdas[3] ? celdas[3] : null);
        }
    } else if (tipo === 'Apreciación') {
        let found = false;
        for (let i = celdas.length - 1; i >= 0; i--) {
            if (celdas[i].textContent.startsWith('AP')) {
                filaTitulos.insertBefore(nuevaCelda, celdas[i].nextSibling);
                found = true;
                break;
            }
        }
        if (!found) {
            for (let i = celdas.length - 1; i >= 0; i--) {
                if (celdas[i].textContent.startsWith('N')) {
                    filaTitulos.insertBefore(nuevaCelda, celdas[i].nextSibling);
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            filaTitulos.insertBefore(nuevaCelda, celdas[3] ? celdas[3] : null);
        }
    } else if (tipo === 'Prueba Final') {
        filaTitulos.appendChild(nuevaCelda);
    }
}

function editarNotasEva(cedula) {
    const tabla = document.getElementById('notas_tbl');
    const filas = tabla.getElementsByTagName('tr');

    for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName('td');
        if (celdas.length > 0 && celdas[0].textContent === cedula.replace(/_/g, '-')) {
            const inputs = filas[i].getElementsByTagName('input');
            for (let j = 0; j < inputs.length; j++) {
                inputs[j].disabled = false;
            }
            break; // Rompe el bucle una vez que la fila ha sido encontrada y procesada
        }
    }
    document.getElementById(`celd_btn_tbl_not_${cedula}`).classList.remove('desnone');
    document.getElementById(`celd_btn_tbl_not_${cedula}`).classList.add('btn_fin_edit');
    document.getElementById(`btn_tbl_eva_${cedula}`).innerHTML = '<i class="bx bx-check"></i>';
    document.getElementById(`btn_tbl_eva_${cedula}`).setAttribute('onclick', `guardarNotasEva('${cedula.replace(/_/g, '-').toUpperCase()}')`);
}

async function guardarNotasEva(cedula) {
    const tabla = document.getElementById('notas_tbl');
    const filas = tabla.getElementsByTagName('tr');

    for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName('td');
        
        // Verifica si la fila tiene celdas y si la primera celda coincide con la cédula
        if (celdas.length > 0 && celdas[0].textContent === cedula.replace(/_/g, '-')) {
            const inputs = filas[i].getElementsByTagName('input');
            const encabezados = filas[0].getElementsByTagName('td'); // Obtener encabezados de la primera fila
            
            for (let j = 0; j < inputs.length; j++) {
                const valor = inputs[j].value;
                // Solo imprimir si el valor no es 0 o ''
                const encabezado = encabezados[j + 3] ? encabezados[j + 3].textContent : ''; // Ignorar las tres primeras celdas fijas
                const materia = selectElementCon2.options[selectElementCon2.selectedIndex].text;
                let trimestre;
                if(selectElementCon3.value == 1){trimestre = 'Primero';}
                else if (selectElementCon3.value == 2){trimestre = 'Segundo';}
                else {trimestre = 'Tercero';}
                
                fetch('/delete-nota', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        materia: materia,
                        cedula: cedula,
                        titulo: encabezado,
                        trimestre: trimestre,
                    })
                })
                .then(response => {
                    if (response.ok) {
                        return response.text(); // O .json() si esperas una respuesta en JSON
                    } else {
                        console.log('Error al eliminar la evaluación');
                    }
                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.log('Error:', error);
                });
                
                await new Promise(resolve => setTimeout(resolve, 80));
                
                if (valor !== '0' && valor !== '') {
                    fetch('/add-nota', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            materia: materia,
                            cedula: cedula,
                            titulo: encabezado,
                            nota: valor,
                            trimestre: trimestre,
                        })
                    })
                    .then(response => {
                        if (response.ok) {
                            return response.text();
                        } else {
                            throw new Error('Error al añadir la asignación');
                        }
                    })
                    .then(data => {
                        console.log(data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Error al añadir la asignación');
                    });

                    console.log(`${cedula} nota: ${encabezado}= ${valor}`);
                }
            }
            break; // Rompe el bucle una vez que la fila ha sido encontrada y procesada
        }
    }
    

    for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName('td');
        if (celdas.length > 0 && celdas[0].textContent === cedula.replace(/_/g, '-')) {
            const inputs = filas[i].getElementsByTagName('input');
            for (let j = 0; j < inputs.length; j++) {
                inputs[j].disabled = true;
            }
            break; // Rompe el bucle una vez que la fila ha sido encontrada y procesada
        }
    }

    document.getElementById(`celd_btn_tbl_not_${cedula}`).classList.remove('btn_fin_edit');
    document.getElementById(`celd_btn_tbl_not_${cedula}`).classList.add('desnone');
    document.getElementById(`btn_tbl_eva_${cedula}`).innerHTML = '<i class="bx bx-pencil"></i>';
    document.getElementById(`btn_tbl_eva_${cedula}`).setAttribute('onclick', `editarNotasEva('${cedula.replace(/_/g, '-').toUpperCase()}')`);
}

function actNotCed(cedula, nota, titulo) {
    
    const tabla = document.getElementById('notas_tbl');
    const filas = tabla.getElementsByTagName('tr');
    const encabezados = tabla.rows[0].getElementsByTagName('td');
    
    // Buscar la columna correspondiente al título
    let columnaIndex = -1;
    for (let i = 0; i < encabezados.length; i++) {
        if (encabezados[i].textContent === titulo) {
            columnaIndex = i;
            break;
        }
    }

    if (columnaIndex === -1) {
        return;
        
    }

    // Buscar la fila correspondiente a la cédula
    for (let i = 1; i < filas.length; i++) { // Empezamos en 1 para omitir la fila de encabezado
        
        const celdas = filas[i].getElementsByTagName('td');
        if (celdas.length > 0 && celdas[0].textContent === cedula.replace(/_/g, '-')) {
            const inputs = celdas[columnaIndex].getElementsByTagName('input');
            if (inputs.length > 0) {
                inputs[0].value = parseFloat(nota).toFixed(1);
            }
            return; // Salir de la función después de actualizar la nota
        }
    }
}

const modal = document.getElementById("modal");
modal.addEventListener('close', () => {
    vaciar();
});

const plus = document.querySelector(".max");
const minus = document.querySelector(".min");

plus.addEventListener("click", () =>{
    let num = parseInt(document.getElementById("cant-asig").textContent);
    num++;
    document.getElementById("cant-asig").textContent = num;
});
minus.addEventListener("click", () =>{
    let num = parseInt(document.getElementById("cant-asig").textContent);
    if(num > 1){
        num--;
        document.getElementById("cant-asig").textContent = num;
    }
});

fetchDataMat('Grado');
const selectElementCon = document.getElementById('grado');
const selectElementCon2 = document.getElementById('materia');
const selectElementCon3 = document.getElementById('periodo_eva_plan');
selectElementCon.addEventListener('change', function() {
    const element = document.querySelectorAll('.option-created');
    element.forEach(element => element.remove());
    const elementEvaTab = document.querySelectorAll('.created-element-eva-tab');
    elementEvaTab.forEach(element => element.remove());
    const elementNotTab = document.querySelectorAll('.created-element-not-tab');
    elementNotTab.forEach(element => element.remove());
    fetchDataMat('Materia')
    evaData();
    fetchDataEst();
    fetchNotasData();
});

selectElementCon2.addEventListener('change', function() {
    const elementEvaTab = document.querySelectorAll('.created-element-eva-tab');
    elementEvaTab.forEach(element => element.remove());
    const elementNotTab = document.querySelectorAll('.created-element-not-tab');
    elementNotTab.forEach(element => element.remove());
    evaData();
    fetchDataEst();
    fetchNotasData();
});

selectElementCon3.addEventListener('change', function() {
    const elementEvaTab = document.querySelectorAll('.created-element-eva-tab');
    elementEvaTab.forEach(element => element.remove());
    const elementNotTab = document.querySelectorAll('.created-element-not-tab');
    elementNotTab.forEach(element => element.remove());
    evaData();
    fetchDataEst();
    fetchNotasData();
});
fetchDataMat('Materia')
evaData();
fetchDataEst();
fetchNotasData();


// creFilTabNotas('C02425871', 'Fabricio José', 'Moreno Aráuz');
