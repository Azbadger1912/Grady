// Llamado a la funcion inicial 
document.addEventListener('DOMContentLoaded', function() {
    selec_vent('not_dia_cont', 'boton_not_dia');
});

// Seleccionar la pestaña mostrada en la pagina
function selec_vent(cont, bot) {
    const contenedores = ['not_dia_cont', 'cond_cont', 'bol_pro_cont'];
    const botones = ['boton_not_dia', 'boton_conducta', 'boton_bol_pro'];

    // Remover clases de todos los contenedores y botones
    contenedores.forEach(id => document.getElementById(id).classList.remove('select'));
    botones.forEach(id => document.getElementById(id).classList.remove('select_bot'));

    // Agregar clases al contenedor y botón seleccionados
    document.getElementById(cont).classList.add('select');
    document.getElementById(bot).classList.add('select_bot');
}

// Mostrar ventana modal de las materias
function ver_not_dia(container){
    var cont = document.getElementById(container.id);
    cont.classList.add('show');
}

// Cerrar ventana modal de las materias
function cer_not_dia(container){
    var cont = document.getElementById(container.id);
    cont.classList.remove('show');
}

// Añadir una nueva nota a la tabla de notas diarias con el formato adecuado
function addNoteAndTitle(subject, newNote, promFin) {
    const table = document.querySelector('.table_notas_dia');
    let maxTitleNumber = 0;
    let hasEmptyCell = false;
    
    let subjectRow;
    for (let row of table.rows) {
        if (row.cells[0].innerText.includes(subject.toUpperCase())) {
            subjectRow = row;
            break;
        }
    }

    if (!subjectRow) return;

    // Encuentra si hay una celda vacía en la fila de la materia específica
    for (let i = 1; i < subjectRow.cells.length - 1; i++) { // Saltamos la celda de materia y la última celda
        if (subjectRow.cells[i].innerText.trim() === '') {
            hasEmptyCell = true;
            break;
        }
    }

    // Encuentra el mayor número de título en la tabla
    for (let row of table.rows) {
        for (let cell of row.cells) {
            if (cell.className.includes('tit_not_dia') && cell.innerText.startsWith('N')) {
                const titleNumber = parseInt(cell.innerText.slice(1));
                if (titleNumber > maxTitleNumber) {
                    maxTitleNumber = titleNumber;
                }
            }
        }
    }

    const numOfNotesInSubject = subjectRow.cells.length - 2; // Menos la celda de materia y la celda de PROM

    if (!hasEmptyCell) {
        // Añadimos el nuevo título si es necesario en la primera fila
        const headerRow = table.rows[0];
        const headerBeforeLastCell = headerRow.cells[headerRow.cells.length - 2];
        if (numOfNotesInSubject === maxTitleNumber) {
            const newHeaderCell = headerRow.insertCell(headerRow.cells.length - 1);
            newHeaderCell.className = 'tit_not_dia';
            newHeaderCell.innerHTML = `N${numOfNotesInSubject + 1}`;
            headerRow.insertBefore(newHeaderCell, headerBeforeLastCell.nextSibling);
        }

        // Recorremos todas las filas de la tabla
        for (let row of table.rows) {
            if (row.rowIndex === 0) continue; // Saltamos la primera fila, ya se procesó

            const beforeLastCell = row.cells[row.cells.length - 2];
            const newCell = row.insertCell(row.cells.length - 1);

            if (row === subjectRow) {
                // Añade una nueva celda de nota a la fila de la materia específica
                if (newNote < 3){
                    newCell.className = 'notas_dia promedio_mat_5';
                    newCell.innerHTML = `<p>${parseFloat(newNote).toFixed(1)}</p>`;
                } else if (newNote < 3.5){
                    newCell.className = 'notas_dia promedio_mat_4';
                    newCell.innerHTML = `<p>${parseFloat(newNote).toFixed(1)}</p>`; 
                } else if (newNote < 4){
                    newCell.className = 'notas_dia promedio_mat_3';
                    newCell.innerHTML = `<p>${parseFloat(newNote).toFixed(1)}</p>`; 
                } else if (newNote < 4.5){
                    newCell.className = 'notas_dia promedio_mat_2';
                    newCell.innerHTML = `<p>${parseFloat(newNote).toFixed(1)}</p>`;  
                } else if (newNote <= 5){
                    newCell.className = 'notas_dia promedio_mat_1';
                    newCell.innerHTML = `<p>${parseFloat(newNote).toFixed(1)}</p>`; 
                }
            } else {
                // Añade celdas vacías para mantener el formato
                newCell.className = 'notas_dia promedio_mat_0';
                newCell.innerHTML = `<p></p>`;
            }

            // Insertamos la nueva celda antes de la última celda
            row.insertBefore(newCell, beforeLastCell.nextSibling);
        }
    } else {
        // Reemplaza la primera celda vacía en la fila de la materia específica
        for (let i = 1; i < subjectRow.cells.length - 1; i++) { // Saltamos la celda de materia y la última celda
            if (subjectRow.cells[i].innerText.trim() === '') {
                if (newNote < 3){subjectRow.cells[i].className = 'notas_dia promedio_mat_5';} 
                else if (newNote < 3.5){subjectRow.cells[i].className = 'notas_dia promedio_mat_4';} 
                else if (newNote < 4){subjectRow.cells[i].className = 'notas_dia promedio_mat_3';}
                else if (newNote < 4.5){subjectRow.cells[i].className = 'notas_dia promedio_mat_2';} 
                else if (newNote <= 5){subjectRow.cells[i].className = 'notas_dia promedio_mat_1';}
                subjectRow.cells[i].innerHTML = `<p>${newNote.toFixed(1)}</p>`;
                break;
            }
        }
    }

    let sum = 0;
    let count = 0;
    for (let i = 1; i < subjectRow.cells.length - 1; i++) { // Saltamos la celda de materia y la última celda
        const cellValue = parseFloat(subjectRow.cells[i].innerText);
        if (!isNaN(cellValue)) {
            sum += cellValue;
            count++;
        }
    }

    //colocar el promedio en la celda final de la fila con su formato adecuado
    const average = (parseFloat(promFin)).toFixed(2);
    if (average < 3){subjectRow.cells[subjectRow.cells.length - 1].className = 'notas_dia promedio_mat_5';} 
    else if (average < 3.5){subjectRow.cells[subjectRow.cells.length - 1].className = 'notas_dia promedio_mat_4';} 
    else if (average < 4){subjectRow.cells[subjectRow.cells.length - 1].className = 'notas_dia promedio_mat_3';}
    else if (average < 4.5){subjectRow.cells[subjectRow.cells.length - 1].className = 'notas_dia promedio_mat_2';} 
    else if (average <= 5){subjectRow.cells[subjectRow.cells.length - 1].className = 'notas_dia promedio_mat_1';}
    subjectRow.cells[subjectRow.cells.length - 1].innerText = average;
}

// Creacion de la una fila de una materia donde estaran contenidas las notas al igual que la creacion de su modal
function materia(nombre, nomb_prof, ahno, si){
    const id_modal = `${nombre.toUpperCase()}_modal`;
    const newMat = document.createElement('tr');

    const nomMat = document.createElement('td');
    nomMat.classList.add('materias');
    const buttonText = document.createElement('button');
    buttonText.classList.add('mat_bot');
    buttonText.textContent = nombre.toUpperCase();
    createModal(nombre, id_modal, nomb_prof, ahno);
    
    buttonText.setAttribute('onclick', `ver_not_dia(${id_modal})`);
    nomMat.appendChild(buttonText);

    const notMat = document.createElement('td');
    notMat.classList.add('promedio_mat_0');
    notMat.classList.add('notas_dia');
    const notMatText = document.createElement('p');
    notMat.appendChild(notMatText);

    const notMatProm = document.createElement('td');
    notMatProm.classList.add('promedio_mat_0');
    notMatProm.classList.add('notas_dia');
    const notMatPromText = document.createElement('p');
    notMatPromText.textContent = '-';
    notMatProm.appendChild(notMatPromText);

    newMat.appendChild(nomMat);
    newMat.appendChild(notMat);
    newMat.appendChild(notMatProm);
    if (si === 'si'){crearFilaBolPro(nombre);}
    return newMat;
}

// Creacion de la ventana modal de cada materia que se añada
function createModal(mate, id, nombre, ahno) {
    // Crear contenedor del modal
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.id = id;
    modalContainer.classList.add('created-element-not')

    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Crear botón de cierre
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.width = '100%';
    buttonContainer.style.justifyContent = 'right';

    const closeButton = document.createElement('button');
    closeButton.style.fontSize = '24px';
    closeButton.style.backgroundColor = 'white';
    closeButton.style.border = '0';
    closeButton.style.cursor = 'pointer';
    closeButton.id = 'boton_1';
    closeButton.setAttribute('onclick', `cer_not_dia(${id})`);

    const icon = document.createElement('i');
    icon.className = 'bx bx-x-circle';

    closeButton.appendChild(icon);
    buttonContainer.appendChild(closeButton);
    modal.appendChild(buttonContainer);

    // Crear contenido de cabecera
    const headerContainer = document.createElement('div');
    headerContainer.style.display = 'flex';
    headerContainer.style.width = '100%';
    headerContainer.style.textAlign = 'center';
    headerContainer.style.justifyContent = 'center';
    headerContainer.style.flexDirection = 'column';
    headerContainer.style.marginBottom = '2%';

    const headerTitle = document.createElement('div');
    headerTitle.style.width = '80%';
    headerTitle.style.backgroundColor = '#0e8282';
    headerTitle.style.padding = '10px';
    headerTitle.style.borderRadius = '30px';
    headerTitle.style.marginLeft = '10%';

    const headerText = document.createElement('p');
    headerText.style.fontSize = '20px';
    headerText.style.color = 'white';
    headerText.textContent = mate.toUpperCase();

    headerTitle.appendChild(headerText);

    const subTitle = document.createElement('h5');
    subTitle.style.marginBottom = '30px';
    subTitle.style.color = '#0e8282';
    subTitle.style.marginTop = '5px';
    subTitle.textContent = `${nombre}(${ahno})`;

    headerContainer.appendChild(headerTitle);
    headerContainer.appendChild(subTitle);
    modal.appendChild(headerContainer);

    // Crear contenido del modal
    const modalContent = document.createElement('div');
    modalContent.className = 'modal_content';

    const table = document.createElement('table');
    table.className = 'not_mat';
    table.id = `${mate.toUpperCase()}_table`;

    // Crear filas de la tabla
    const titNotTr = document.createElement('tr');
    titNotTr.className = 'tit_not';
    const asigTd = document.createElement('td');
    asigTd.style.width = '40%';
    asigTd.textContent = 'ASIGNACIÓN';
    const notTd = document.createElement('td');
    notTd.style.width = '20%';
    notTd.textContent = 'NOTA';
    const fecTd = document.createElement('td');
    fecTd.style.width = '40%';
    fecTd.textContent = 'FECHA';
    titNotTr.appendChild(asigTd);
    titNotTr.appendChild(notTd);
    titNotTr.appendChild(fecTd);

    const notDiaPromTr = document.createElement('tr');
    const notDiaTipPromTd = document.createElement('td');
    notDiaTipPromTd.className = 'tip_prom';
    notDiaTipPromTd.textContent = 'DIARIAS';
    const notDiaPromTd = document.createElement('td');
    notDiaPromTd.classList.add('nota');
    notDiaPromTd.classList.add('promedio_mat_0');
    const notDiaFecProm = document.createElement('td');
    notDiaFecProm.className = 'fecha';
    notDiaPromTr.appendChild(notDiaTipPromTd);
    notDiaPromTr.appendChild(notDiaPromTd);
    notDiaPromTr.appendChild(notDiaFecProm);
    
    const notApPromTr = document.createElement('tr');
    const notApTipPromTd = document.createElement('td');
    notApTipPromTd.className = 'tip_prom';
    notApTipPromTd.textContent = 'APRECIACIÓN';
    const notApPromTd = document.createElement('td');
    notApPromTd.classList.add('nota');
    notApPromTd.classList.add('promedio_mat_0');
    const notApFecProm = document.createElement('td');
    notApFecProm.className = 'fecha';
    notApPromTr.appendChild(notApTipPromTd);
    notApPromTr.appendChild(notApPromTd);
    notApPromTr.appendChild(notApFecProm);
    
    const notTrimPromTr = document.createElement('tr');
    const notTrimTipPromTd = document.createElement('td');
    notTrimTipPromTd.className = 'tip_prom';
    notTrimTipPromTd.textContent = 'EXAMEN';
    const notTrimPromTd = document.createElement('td');
    notTrimPromTd.classList.add('nota');
    notTrimPromTd.classList.add('promedio_mat_0');
    const notTrimFecProm = document.createElement('td');
    notTrimFecProm.className = 'fecha';
    notTrimPromTr.appendChild(notTrimTipPromTd);
    notTrimPromTr.appendChild(notTrimPromTd);
    notTrimPromTr.appendChild(notTrimFecProm);

    const notPromTr = document.createElement('tr');
    const notTipPromTd = document.createElement('td');
    notTipPromTd.className = 'prom';
    notTipPromTd.textContent = 'PROMEDIO';
    const notPromTd = document.createElement('td');
    notPromTd.classList.add('nota');
    notPromTd.classList.add('promedio_mat_0');
    const notFecProm = document.createElement('td');
    notFecProm.className = 'fecha';
    notPromTr.appendChild(notTipPromTd);
    notPromTr.appendChild(notPromTd);
    notPromTr.appendChild(notFecProm);

    table.appendChild(titNotTr);
    table.appendChild(notDiaPromTr);
    table.appendChild(notApPromTr);
    table.appendChild(notTrimPromTr);
    table.appendChild(notPromTr);

    modalContent.appendChild(table);
    modal.appendChild(modalContent);
    modalContainer.appendChild(modal);

    // Agregar modal al cuerpo del documento
    document.body.appendChild(modalContainer);
}

// Crear una fila para colocar una nota en la tabla de los modals de las materias en el lugar adecuado
function agregarNota(tipoNota, nota, fecha, nombreAsignacion, mat, trim) {
    // Crear una nueva fila
    const nuevaFila = document.createElement('tr');
    nuevaFila.classList.add('created-element-not');

    // Crear las celdas de la nueva fila
    const celdaAsignacion = document.createElement('td');
    celdaAsignacion.className = 'asig_tit';
    celdaAsignacion.textContent = nombreAsignacion.toUpperCase();

    const celdaNota = document.createElement('td');
    celdaNota.textContent = parseFloat(nota).toFixed(1);
    if (nota < 1){celdaNota.className = 'promedio_mat_0 nota';} 
    else if (nota < 3){celdaNota.className = 'promedio_mat_5 nota';} 
    else if (nota < 3.5){celdaNota.className = 'promedio_mat_4 nota';} 
    else if (nota < 4){celdaNota.className = 'promedio_mat_3 nota';}
    else if (nota < 4.5){celdaNota.className = 'promedio_mat_2 nota';} 
    else if (nota <= 5){celdaNota.className = 'promedio_mat_1 nota';}

    const celdaFecha = document.createElement('td');
    celdaFecha.className = 'fecha';
    celdaFecha.textContent = fecha;

    // Agregar las celdas a la fila
    nuevaFila.appendChild(celdaAsignacion);
    nuevaFila.appendChild(celdaNota);
    nuevaFila.appendChild(celdaFecha);

    // Buscar la tabla y la fila de referencia según el tipo de nota
    const tabla = document.getElementById(`${mat.toUpperCase()}_table`);
    let filaReferencia;

    for (let row of tabla.rows) {
        if (row.cells.length > 0 && row.cells[0].classList.contains('tip_prom') && row.cells[0].innerText.includes(tipoNota.toUpperCase())) {
            filaReferencia = row;
            break;
        }
    }

    // Insertar la nueva fila antes de la fila de referencia
    if (filaReferencia) {
        tabla.insertBefore(nuevaFila, filaReferencia);
    } else {
        console.error('No se encontró la fila de referencia para el tipo de nota:', tipoNota);
    }

    // Calcular y actualizar el promedio de cada tipo de nota
    function calcularPromedio(tipo) {
        let sum = 0;
        let count = 0;
        let startRow, endRow;

        for (let i = 0; i < tabla.rows.length; i++) {
            if (tabla.rows[i].cells.length > 0 && tabla.rows[i].cells[0].classList.contains('tip_prom') && tabla.rows[i].cells[0].innerText.includes(tipo)) {
                endRow = i;
                break;
            }
        }

        if (tipo === 'DIARIAS') {
            startRow = 1;
        } else if (tipo === 'APRECIACIÓN') {
            for (let i = 0; i < tabla.rows.length; i++) {
                if (tabla.rows[i].cells.length > 0 && tabla.rows[i].cells[0].classList.contains('tip_prom') && tabla.rows[i].cells[0].innerText.includes('DIARIAS')) {
                    startRow = i + 1;
                    break;
                }
            }
        } else if (tipo === 'EXAMEN') {
            for (let i = 0; i < tabla.rows.length; i++) {
                if (tabla.rows[i].cells.length > 0 && tabla.rows[i].cells[0].classList.contains('tip_prom') && tabla.rows[i].cells[0].innerText.includes('APRECIACIÓN')) {
                    startRow = i + 1;
                    break;
                }
            }
        }

        for (let i = startRow; i < endRow; i++) {
            const notaCelda = tabla.rows[i].cells[1];
            if (notaCelda && !isNaN(parseFloat(notaCelda.innerText))) {
                sum += parseFloat(notaCelda.innerText);
                count++;
            }
        }

        return count === 0 ? 0 : (sum / count).toFixed(2);
    }

    const promedioDiarias = calcularPromedio('DIARIAS');
    const promedioApreciacion = calcularPromedio('APRECIACIÓN');
    const promedioExamen = calcularPromedio('EXAMEN');

    for (let row of tabla.rows) {
        if (row.cells.length > 0 && row.cells[0].classList.contains('tip_prom')) {
            if (row.cells[0].innerText.includes('DIARIAS')) {
                row.cells[1].innerText = promedioDiarias;
            } else if (row.cells[0].innerText.includes('APRECIACIÓN')) {
                row.cells[1].innerText = promedioApreciacion;
            } else if (row.cells[0].innerText.includes('EXAMEN')) {
                row.cells[1].innerText = promedioExamen;
            }
            if (row.cells[1].innerText < 1){row.cells[1].className = 'promedio_mat_0 nota';} 
            else if (row.cells[1].innerText < 3){row.cells[1].className = 'promedio_mat_5 nota';} 
            else if (row.cells[1].innerText < 3.5){row.cells[1].className = 'promedio_mat_4 nota';} 
            else if (row.cells[1].innerText < 4){row.cells[1].className = 'promedio_mat_3 nota';}
            else if (row.cells[1].innerText < 4.5){row.cells[1].className = 'promedio_mat_2 nota';} 
            else if (row.cells[1].innerText <= 5){row.cells[1].className = 'promedio_mat_1 nota';}

        }
    }
    let promedioFinal;
    if (promedioDiarias == 0){
        if (promedioApreciacion == 0){
            if (promedioExamen == 0){
                promedioFinal = 0;
            } else {
                promedioFinal = (parseFloat(promedioExamen)/1).toFixed(2);
            }
        } else if (promedioExamen == 0){
            promedioFinal = (parseFloat(promedioApreciacion)/1).toFixed(2);
        } else {
            promedioFinal = ((parseFloat(promedioExamen) + parseFloat(promedioApreciacion))/2).toFixed(2);
        }
    } else if (promedioApreciacion == 0){
        if (promedioDiarias == 0){
            if (promedioExamen == 0){
                promedioFinal = 0;
            } else {
                promedioFinal = (parseFloat(promedioExamen)/1).toFixed(2);
            }
        } else if (promedioExamen == 0){
            promedioFinal = (parseFloat(promedioDiarias)/1).toFixed(2);
        } else {
            promedioFinal = ((parseFloat(promedioExamen) + parseFloat(promedioDiarias))/2).toFixed(2);
        }
    } else if (promedioExamen == 0){
        if (promedioDiarias == 0){
            if (promedioApreciacion == 0){
                promedioFinal = 0;
            } else {
                promedioFinal = (parseFloat(promedioApreciacion)/1).toFixed(2);
            }
        } else if (promedioApreciacion == 0){
            promedioFinal = (parseFloat(promedioDiarias)/1).toFixed(2);
        } else {
            promedioFinal = ((parseFloat(promedioApreciacion) + parseFloat(promedioDiarias))/2).toFixed(2);
        }
    } else {
        promedioFinal = (parseFloat(promedioDiarias) * 0.33 + parseFloat(promedioApreciacion) * 0.33 + parseFloat(promedioExamen) * 0.34).toFixed(2);
    }

    // Actualizar el promedio final en la última fila de la tabla
    const ultimaFila = tabla.rows[tabla.rows.length - 1];
    if (ultimaFila.cells.length > 0 && ultimaFila.cells[0].classList.contains('prom')) {
        ultimaFila.cells[1].innerText = promedioFinal;
        if (promedioFinal < 1){ultimaFila.cells[1].className = 'promedio_mat_0 nota';} 
        else if (promedioFinal < 3){ultimaFila.cells[1].className = 'promedio_mat_5 nota';} 
        else if (promedioFinal < 3.5){ultimaFila.cells[1].className = 'promedio_mat_4 nota';} 
        else if (promedioFinal < 4){ultimaFila.cells[1].className = 'promedio_mat_3 nota';}
        else if (promedioFinal < 4.5){ultimaFila.cells[1].className = 'promedio_mat_2 nota';} 
        else if (promedioFinal <= 5){ultimaFila.cells[1].className = 'promedio_mat_1 nota';}
    }

    // Llamado a las funciones consecuentes
    bolProProms(promedioFinal, mat, trim);
    addNoteAndTitle(mat, nota, promedioFinal, trim);
}

// Agregar los promedios actualizados en el boletin proyectado en su lugar correspondiente al igual que realizar los calculos necesarios
function bolProProms(promedioFinal, mat, trim){
    const bolProProm1 = document.getElementById(`bolProProm1_${mat.toUpperCase()}`);
    const bolProProm2 = document.getElementById(`bolProProm2_${mat.toUpperCase()}`);
    const bolProProm3 = document.getElementById(`bolProProm3_${mat.toUpperCase()}`);
    if (trim == 1){
        bolProProm1.textContent = promedioFinal;
        if (promedioFinal < 1){bolProProm1.className = 'promedio_mat_0';} 
        else if (promedioFinal < 3){bolProProm1.className = 'promedio_mat_5';} 
        else if (promedioFinal < 3.5){bolProProm1.className = 'promedio_mat_4';} 
        else if (promedioFinal < 4){bolProProm1.className = 'promedio_mat_3';}
        else if (promedioFinal < 4.5){bolProProm1.className = 'promedio_mat_2';} 
        else if (promedioFinal <= 5){bolProProm1.className = 'promedio_mat_1';}
    } else if (trim == 2){
        bolProProm2.textContent = promedioFinal;
        if (promedioFinal < 1){bolProProm2.className = 'promedio_mat_0';} 
        else if (promedioFinal < 3){bolProProm2.className = 'promedio_mat_5';} 
        else if (promedioFinal < 3.5){bolProProm2.className = 'promedio_mat_4';} 
        else if (promedioFinal < 4){bolProProm2.className = 'promedio_mat_3';}
        else if (promedioFinal < 4.5){bolProProm2.className = 'promedio_mat_2';} 
        else if (promedioFinal <= 5){bolProProm2.className = 'promedio_mat_1';}
    } else if ( trim == 3){
        bolProProm3.textContent = promedioFinal;
        if (promedioFinal < 1){bolProProm3.className = 'promedio_mat_0';} 
        else if (promedioFinal < 3){bolProProm3.className = 'promedio_mat_5';} 
        else if (promedioFinal < 3.5){bolProProm3.className = 'promedio_mat_4';} 
        else if (promedioFinal < 4){bolProProm3.className = 'promedio_mat_3';}
        else if (promedioFinal < 4.5){bolProProm3.className = 'promedio_mat_2';} 
        else if (promedioFinal <= 5){bolProProm3.className = 'promedio_mat_1';}
    }

    const promTot = document.getElementById(`bolPromTot_${mat.toUpperCase()}`);

    // Calculo de los promedios de los tres trimestres
    if (bolProProm1.textContent == '-'){
        if (bolProProm2.textContent == '-'){
            if (bolProProm3.textContent == '-'){
                promTot.textContent = '-';
            } else {
                promTot.textContent = (parseFloat(bolProProm3.textContent)/1).toFixed(2);
            }
        } else if (bolProProm3.textContent == '-'){
            promTot.textContent = (parseFloat(bolProProm2.textContent)/1).toFixed(2);
        } else {
            promTot.textContent = ((parseFloat(bolProProm3.textContent) + parseFloat(bolProProm2.textContent))/2).toFixed(2);
        }
    } else if (bolProProm2.textContent == '-'){
        if (bolProProm1.textContent == '-'){
            if (bolProProm3.textContent == '-'){
                promTot.textContent = '-';
            } else {
                promTot.textContent = (parseFloat(bolProProm3.textContent)/1).toFixed(2);
            }
        } else if (bolProProm3.textContent == '-'){
            promTot.textContent = (parseFloat(bolProProm1.textContent)/1).toFixed(2);
        } else {
            promTot.textContent = ((parseFloat(bolProProm3.textContent) + parseFloat(bolProProm1.textContent))/2).toFixed(2);
        }
    } else if (bolProProm3.textContent == '-'){
        if (bolProProm1.textContent == '-'){
            if (bolProProm2.textContent == '-'){
                promTot.textContent = '-';
            } else {
                promTot.textContent = (parseFloat(bolProProm2.textContent)/1).toFixed(2);
            }
        } else if (bolProProm2.textContent == '-'){
            promTot.textContent = (parseFloat(bolProProm1.textContent)/1).toFixed(2);
        } else {
            promTot.textContent = ((parseFloat(bolProProm2.textContent) + parseFloat(bolProProm1.textContent))/2).toFixed(2);
        }
    } else {
        bolProProm1.textContent = (parseFloat(bolProProm1.textContent) * 0.33 + parseFloat(bolProProm1.textContent) * 0.33 + parseFloat(bolProProm1.textContent) * 0.34).toFixed(2);
    }

    if (promTot.textContent == '-'){promTot.className = 'promedio_mat_0';} 
        else if (parseFloat(promTot.textContent) < 3){promTot.className = 'promedio_mat_5';} 
        else if (parseFloat(promTot.textContent) < 3.5){promTot.className = 'promedio_mat_4';} 
        else if (parseFloat(promTot.textContent) < 4){promTot.className = 'promedio_mat_3';}
        else if (parseFloat(promTot.textContent) < 4.5){promTot.className = 'promedio_mat_2';} 
        else if (parseFloat(promTot.textContent) <= 5){promTot.className = 'promedio_mat_1';}

    const aprobReprob = document.getElementById(`Aprob_${mat.toUpperCase()}`);
    if (parseFloat(promTot.textContent) >= 3){
        aprobReprob.textContent = 'OK';
    } else {
        aprobReprob.textContent = 'REPROBADO';
    }

    // Realizar el calculo total del promedio del trimestre
    calPromCel(trim);

    // Realizar el calculo total de los tres trimestres
    calPromCel(4)
}

// Evaluar los promedios de las materias y realizar el promedio total del trimestre
function calPromCel(trim) {
    const table = document.getElementById('tabla_bol_pro');
    const tbody = table.querySelector('tbody');
    const rows = tbody ? tbody.rows : table.rows;

    if (rows.length <= 2) {
        // No hay suficientes filas para calcular el promedio
        return 0;
    }

    let suma = 0;
    let contador = 0;

    // Iterar desde la segunda fila hasta la penúltima
    for (let i = 1; i < rows.length - 1; i++) {
        const celda = rows[i].cells[parseInt(trim)]; // Segunda celda de la fila
        const valor = parseFloat(celda.textContent);

        if (!isNaN(valor) && valor !== '-') {
            suma += valor;
            contador++;
        }
    }

    // Calcular el promedio
    const promedio = contador > 0 ? suma / contador : 0;
    const promcel = document.getElementById(`bolPromTot${trim}`);
    promcel.textContent = promedio.toFixed(2);

    // Colocar el formato adecuado
    if (promedio < 1){promcel.className = 'promedio_mat_0';} 
    else if (promedio < 3){promcel.className = 'promedio_mat_5';} 
    else if (promedio < 3.5){promcel.className = 'promedio_mat_4';} 
    else if (promedio < 4){promcel.className = 'promedio_mat_3';}
    else if (promedio < 4.5){promcel.className = 'promedio_mat_2';} 
    else if (promedio <= 5){promcel.className = 'promedio_mat_1';}
}

// Crear una fila por cada materia que este especificada en la base de datos en el boletin proyectado
function crearFilaBolPro(mat) {
    const table = document.getElementById('tabla_bol_pro');
    const matTr = document.createElement('tr');

    const matTd = document.createElement('td');
    matTd.style.fontSize = '13px';
    matTd.textContent = mat.toUpperCase();

    const prom1Td = document.createElement('td');
    prom1Td.id = `bolProProm1_${mat.toUpperCase()}`;
    prom1Td.textContent = '-';

    const prom2Td = document.createElement('td');
    prom2Td.id = `bolProProm2_${mat.toUpperCase()}`;
    prom2Td.textContent = '-';
    const prom3Td = document.createElement('td');
    prom3Td.id = `bolProProm3_${mat.toUpperCase()}`;
    prom3Td.textContent = '-';

    const promTotTd = document.createElement('td');
    promTotTd.id = `bolPromTot_${mat.toUpperCase()}`;
    promTotTd.textContent = '-';

    const defaultValue = '0';

    const AuTd1 = document.createElement('td');
    AuTd1.textContent = defaultValue;
    AuTd1.id = `Au1_${mat.toUpperCase()}`;
    const AuTd2 = document.createElement('td');
    AuTd2.textContent = defaultValue;
    AuTd2.id = `Au2_${mat.toUpperCase()}`;
    const AuTd3 = document.createElement('td');
    AuTd3.textContent = defaultValue;
    AuTd3.id = `Au3_${mat.toUpperCase()}`;

    const TarTd1 = document.createElement('td');
    TarTd1.textContent = defaultValue;
    TarTd1.id = `Tar1_${mat.toUpperCase()}`;
    const TarTd2 = document.createElement('td');
    TarTd2.textContent = defaultValue;
    TarTd2.id = `Tar2_${mat.toUpperCase()}`;
    const TarTd3 = document.createElement('td');
    TarTd3.textContent = defaultValue;
    TarTd3.id = `Tar3_${mat.toUpperCase()}`;

    const AprobTd = document.createElement('td');
    AprobTd.id = `Aprob_${mat.toUpperCase()}`;
    AprobTd.style.fontSize = '14px';
    AprobTd.textContent = '-';

    matTr.append(
        matTd, prom1Td, prom2Td, prom3Td, promTotTd, 
        AuTd1, TarTd1, AuTd2, TarTd2, AuTd3, TarTd3, AprobTd
    );

    // Verifica si la tabla tiene un tbody
    const tbody = table.querySelector('tbody');
    const rows = tbody ? tbody.rows : table.rows;

    if (rows.length > 0) {
        const lastRow = rows[rows.length - 1];
        if (tbody) {
            tbody.insertBefore(matTr, lastRow);
        } else {
            table.insertBefore(matTr, lastRow);
        }
    } else {
        // Si la tabla está vacía, simplemente agrega la fila
        if (tbody) {
            tbody.appendChild(matTr);
        } else {
            table.appendChild(matTr);
        }
    }
}

// Crear una fila para cada materia que este especificada en la base de datos en la tabla de conducta
function crearFilCond(mat, prof, aus, tar){
    const table = document.getElementById('con_table')
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.textContent = mat.toUpperCase();
    td1.className = 'cont_1'
    const td2 = document.createElement('td');
    td2.textContent = prof;
    td2.className = 'cont_1'
    const td3 = document.createElement('td');
    td3.textContent = aus;
    td3.className = 'cont_2'
    const td4 = document.createElement('td');
    td4.textContent = tar;
    td4.className = 'cont_2'
    tr.classList.add('created-element-con');
    tr.append(td1, td2, td3, td4);
    table.appendChild(tr);
}

// Crear una materia en la tabla de notas diarias y en caso que 'si' sea 'si' entonces se cree tambien en el boletin proyectado
async function fetchData_mat(si) {
    try {

        // Consultar las materias a la base de datos
        const response = await fetch('/materias_data');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();

        // Crear la materia con el formato adecuado
        for (let dato of data) {
            const tabla = document.getElementById('tabla_notas')
            tabla.appendChild(materia(dato['Materia'], dato['Profesor'], currentYear, si));
        }

    } catch (error) {
        console.error('Error obteniendo los datos:', error);
    }
}

// Consultar las notas del estudiante y realizar las evualuciones necesarias
async function fetchData_not(si, trim) {
    
    try {

        // Consultar las notas del estudiante a la base de datos
        const response = await fetch('/notas_data');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        
        // Determinar el trimestre seleccionado
        let trimestre; if (trim == 1){trimestre = 'Primero';} else if (trim == 2){trimestre = 'Segundo';} else {trimestre = 'Tercero';}
        
        for (let dato of data) {
            if (dato['Trimestre'] === trimestre) {

                // Colocar las notas en el formato adecuado
                const fechaCompleta = new Date(dato['Fecha']);
                const fecha = `${fechaCompleta.getDate()}-${fechaCompleta.getMonth() + 1}-${fechaCompleta.getFullYear()}`;
                agregarNota(dato['Tipo'], dato['Nota'], fecha, dato['Nombre'], dato['Materia'], trim);
            }
        }

        // Realizar evaluaciones para que se creen las notas de los tres trimestres para los calculos adecuados
        if(si && trim === 1){
            cambiarTrimNot(2, true);
        } else if (si && trim === 2){
            cambiarTrimNot(3, true);
        } else if (si){
            await new Promise(resolve => setTimeout(resolve, 10))
            const elements = document.querySelectorAll('.created-element-not');
            elements.forEach(element => element.remove());
            const table = document.getElementById('tabla_notas');
            table.style.opacity = '1';
            table.innerHTML = `<tr>
                                    <td  class="tit_not_dia" style="min-width: 180px; max-width: 300px;">MATERIA</td>
                                    <td  class="tit_not_dia">N1</td>
                                    <td  class="tit_not_dia" style="min-width: 100px;">PROM</td>
                                </tr>`;
            fetchData_mat('no')
            fetchData_not(false, 1);
        }
    } catch (error) {
        console.error('Error obteniendo los datos:', error);
    }
}

// Consultar los datos de conducta del estudiante en la base de datos y colocarlos en el formato adecuado
async function fetchData_cond(trim) {
    try {
        // Consultar los datos de conducta del estudiante a la base de datos
        const response = await fetch('/conducta_data');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();

        // Determinar el trimestre seleccionado
        let trimestre; if (trim == 1){trimestre = 'Primero';} else if (trim == 2){trimestre = 'Segundo';} else {trimestre = 'Tercero';}

        // Colocar los datos en el formato adecuado
        for (let dato of data) {
            if (dato['Trimestre'] === trimestre) {
                crearFilCond(dato['Materia'], dato['Profesor'], dato['Ausencias'], dato['Tardanzas']);
            }
            if (dato['Trimestre'] === 'Primero') {
                const Ausen = document.getElementById(`Au1_${dato['Materia'].toUpperCase()}`);
                Ausen.textContent = dato['Ausencias']
                const Tarda = document.getElementById(`Tar1_${dato['Materia'].toUpperCase()}`);
                Tarda.textContent = dato['Tardanzas'];
            } else if(dato['Trimestre'] === 'Segundo'){
                const Ausen = document.getElementById(`Au2_${dato['Materia'].toUpperCase()}`);
                Ausen.textContent = dato['Ausencias']
                const Tarda = document.getElementById(`Tar2_${dato['Materia'].toUpperCase()}`);
                Tarda.textContent = dato['Tardanzas'];
            } else {
                const Ausen = document.getElementById(`Au3_${dato['Materia'].toUpperCase()}`);
                Ausen.textContent = dato['Ausencias']
                const Tarda = document.getElementById(`Tar3_${dato['Materia'].toUpperCase()}`);
                Tarda.textContent = dato['Tardanzas'];
            }
        }

    } catch (error) {
        console.error('Error obteniendo los datos:', error);
    }
}

// Consultar y Colocar las observaciones del consejero
async function fetchData_observ() {
    try {
        // Consultar las observaciones del consejero a la base de datos
        const response = await fetch('/observacion_data');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();

        // Colocar las observaciones en el formato adecuado
        for (let dato of data) {
            const obs_list = document.getElementById('observaciones');
            const obser = document.createElement('li');
            obser.textContent = dato['Observacion'];
            obs_list.appendChild(obser);
        }

    } catch (error) {
        console.error('Error obteniendo los datos:', error);
    }
}

// Cambiar de trimestre en la tabla de notas diarias
function cambiarTrimNot(trim, si){
    const elements = document.querySelectorAll('.created-element-not');
    elements.forEach(element => element.remove());
    const table = document.getElementById('tabla_notas');
    table.innerHTML = `<tr>
                            <td  class="tit_not_dia" style="min-width: 180px; max-width: 300px;">MATERIA</td>
                            <td  class="tit_not_dia">N1</td>
                            <td  class="tit_not_dia" style="min-width: 100px;">PROM</td>
                        </tr>`;
    fetchData_mat('no');

    fetchData_not(si, trim);
}

// Cambiar de trimestre en la tabla de conducta
function cambiarTrimCond(trim){
    const elements = document.querySelectorAll('.created-element-con');
    elements.forEach(element => element.remove());

    fetchData_cond(trim);
}

// Consultar y colocar las informacion personal del estudiante en el boletin proyectado
document.addEventListener("DOMContentLoaded", function() {
    
    fetch('/user_data')
        .then(response => response.json())
        .then(data => {

            // Obtener la informacion a la base de datos
            const grado = data.grado;
            const cedula = data.cedula;
            const userName = data.userName;
            const userLastName = data.userLastName;

            // Colocar la informacion en el formato adecuado
            const cedu = document.getElementById('cedul_bol_pro');
            const name = document.getElementById('nomb_bol_pro');
            const lastName = document.getElementById('apell_bol_pro');
            const ahno = document.getElementById('ahno_bol_pro');
            const grad = document.getElementById('grado_bol_pro');

            cedu.innerHTML = `<b>Cédula:</b> ${(cedula.toUpperCase()).replace(/_/g, '-')}`;
            name.innerHTML = `<b>Nombre:</b> ${userName}`;
            lastName.innerHTML = `<b>Apellido Paterno:</b> ${userLastName}`;
            ahno.innerHTML = `<b>Año:</b> ${currentYear}`;
            grad.innerHTML = `<b>Grupo:</b> ${grado.toUpperCase()}`;

        })
        .catch(error => console.error('Error al obtener los datos del usuario:', error));
});

// Evento para cambiar de trimestre en la tabla de notas diarias
const selectElementNot = document.getElementById('trimestre_not');
selectElementNot.addEventListener('change', function() {
    // Llama a la función cuando cambie la opción seleccionada
    cambiarTrimNot(this.value, false);
});

// Evento para cambiar de trimestre en la tabla de conducta
const selectElementCon = document.getElementById('trimestre_cond');
selectElementCon.addEventListener('change', function() {
    // Llama a la función cuando cambie la opción seleccionada
    cambiarTrimCond(this.value);
});

// Declaracion del año actual y ejecucion de las funciones iniciales
const currentYear = new Date().getUTCFullYear();
fetchData_mat('si');
fetchData_not(true, 1);
fetchData_cond(1);
fetchData_observ();
