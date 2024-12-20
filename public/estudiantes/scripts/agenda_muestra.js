//si

// Hacer consulta de las actividades en la base de datos y colocarlas en el formato adecuado
async function fetchData() {
    try {

        // Hacer la consulta a la base de datos
        const response = await fetch('/agenda_data');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();

        // Hacer las evaluaciones correspondientes y colocar el formato
        for (let dato of data) {

            const result = getWeekAndDay(dato['Fecha'], currentMonth, currentYear);
            const day = result['day'];
            const week = result['week'];

            if (day === 0 && week === 0) {continue;}
            else{
                const asigModalContent = document.getElementById(`asig_modal_content_${week}_${day}`);
                const asigPrev = document.getElementById(`asign_${week}${day}`);
                // console.log('semana:' + week + ', dia:' + day + ',' + dato['Fecha']);
                const materia = dato['Materia'];
                const arch_adj = dato['Adjunto'];
                let tema; if (dato['Tema'] === '-'){tema = '';}else{tema = dato['Tema'];}
                let ind_prin; if (dato['Ind_Prin'] === '-'){ind_prin = '';}else{ind_prin = dato['Ind_Prin'];}
                let ind_det; if (dato['Ind_Det'] === '-'){ind_det = '';}else{ind_det = dato['Ind_Det'];}
                const tipo = dato['Tipo'];
                const asign = dato['Asignacion'];
                const asignacion = crearAsignacion(materia, tema, ind_prin, ind_det, tipo, asign, arch_adj);
                const asignPrev = crearPrevAsign(materia, tipo, asign)

                asignacion.classList.add('generated-element');
                asignPrev.classList.add('generated-element');

                evalTam(asigPrev, asignPrev);
                asigModalContent.appendChild(asignacion);
            }
        }

    } catch (error) {
        console.error('Error obteniendo los datos:', error);
    }
}

// Determinar mediante la fecha en que dia y de la semana y semana del mes se encuentra
function getWeekAndDay(dateString, currentMonth, currentYear) {
    const date = new Date(dateString);
    const dayOfWeek = date.getUTCDay(); // 0 (Sunday) to 6 (Saturday)
    const dayOfMonth = date.getUTCDate(); // 1 to 31
    const month = date.getUTCMonth() + 1; // 1 (January) to 12 (December)
    const year = date.getUTCFullYear();

    // Obtener el primer día del mes actual
    const firstDayOfMonth = new Date(Date.UTC(year, currentMonth - 1, 1));
    let startWeekDay = firstDayOfMonth.getUTCDay();
    if (startWeekDay === 6) {
        startWeekDay = 0; // Si el primer día del mes es sábado, la semana comienza el próximo domingo
    }

    // Obtener el último día del mes actual
    const lastDayOfMonth = new Date(Date.UTC(year, currentMonth, 0));
    const lastDateOfMonth = lastDayOfMonth.getUTCDate();

    // Ajustar si la fecha pertenece al mes siguiente
    if ((month === currentMonth + 1 && year === currentYear)|| (currentMonth === 12 && month === 1 && year === currentYear + 1)) {
        const daysIntoNextMonth = dayOfMonth;
        if (daysIntoNextMonth <= 7) { // Si es una fecha dentro de la primera semana del próximo mes
            const weekOfMonth = Math.ceil((lastDateOfMonth + daysIntoNextMonth + startWeekDay) / 7);
            const dayValue = (dayOfWeek >= 1 && dayOfWeek <= 5) ? dayOfWeek : 0;
            return { week: weekOfMonth, day: dayValue };
        }
    }

    // Ajustar si la fecha pertenece al mes anterior
    if ((month === currentMonth - 1 && year === currentYear)|| (currentMonth === 1 && month === 12 && year === currentYear - 1)) {
        const daysIntoPreviousMonth = dayOfMonth;
        if (daysIntoPreviousMonth > (lastDateOfMonth - 6)) { // Si es una fecha dentro de la última semana del mes anterior
            const weekOfMonth = 1;
            const dayValue = (dayOfWeek >= 1 && dayOfWeek <= 5) ? dayOfWeek : 0;
            return { week: weekOfMonth, day: dayValue };
        }
    }

    // Calcular la semana del mes si la fecha pertenece al mes actual
    if (month === currentMonth && year === currentYear) {
        const weekOfMonth = Math.ceil((dayOfMonth + startWeekDay) / 7);
        const dayValue = (dayOfWeek >= 1 && dayOfWeek <= 5) ? dayOfWeek : 0;
        return {
            week: weekOfMonth,
            day: dayValue
        };
    }

    // Si la fecha no pertenece ni al mes actual ni cae en las primeras/últimas semanas de los meses adyacentes
    return { week: 0, day: 0 };
}

// Eliminar elemento para actualizar la tabla
function eliminarElementos(){
    const elements = document.querySelectorAll('.generated-element');
    elements.forEach(element => element.remove());
}

// Agregar funcionalidad a los botones tanto para mostrar como ocultar la ventana modal
function agregarEventosModal(botones, modalContainer, closeButton) {

    // Agregar funcionalidad a los botones para mostrar la ventana modal
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            modalContainer.classList.add('show');
        });
    });

    // Agregar funcionalidad al botón para ocultar la ventana modal
    closeButton.addEventListener('click', () => {
        modalContainer.classList.remove('show');
    });
}

// Crear formato de la vista previa de las asignaciones
function crearPrevAsign(materia, tipo, asignacion) {
    const asignDiv = document.createElement('div');
    asignDiv.style.marginTop = '5px';
    
    const matP = document.createElement('p');
    matP.textContent = materia.toUpperCase();
    matP.classList.add('tit_mat_prev');

    if (tipo == 1){
        matP.classList.add('sum_mat');
    } else {
        matP.classList.add('form_mat');
    }

    asignDiv.appendChild(matP);

    const asignTitDiv = document.createElement('div');

    if (tipo == 1){
        asignTitDiv.classList.add('sum');
    } else {
        asignTitDiv.classList.add('form');
    }

    const asignP = document.createElement('p');
    asignP.textContent = asignacion.toUpperCase();

    asignTitDiv.appendChild(asignP);
    asignDiv.appendChild(asignTitDiv);

    return asignDiv
}

// Evaluar si el dia sobrepasa las 3 asignacion mediante el tamaño esperado
function evalTam(content, divCreado){
    
    if ((window.matchMedia("(min-width: 1140px)").matches) ||  (window.matchMedia("(min-width: 760px)").matches)) {
        if (content.scrollHeight > 100 && content.scrollHeight < 170) {
            const tresPuntos = document.createElement('p');
            tresPuntos.textContent = '...';
            tresPuntos.style.fontSize = '14px';
            tresPuntos.style.marginBottom = '8px';
            tresPuntos.classList.add('generated-element');
            content.appendChild(tresPuntos);
        } else if (content.scrollHeight < 120){
            content.appendChild(divCreado);
        }
    } else {
        if (content.scrollHeight > 56 && content.scrollHeight < 80) {
            const tresPuntos = document.createElement('p');
            tresPuntos.textContent = '...';
            tresPuntos.style.fontSize = '14px';
            tresPuntos.style.marginBottom = '8px';
            tresPuntos.classList.add('generated-element');
            content.appendChild(tresPuntos);
        } else if (content.scrollHeight < 58){
            content.appendChild(divCreado);
        };
    }
    


}

// Crear el formato de las asignaciones dentro de las ventanas modales
function crearAsignacion(materia, tema, ind_prin, ind_det, tipo, asignacion, adjunto) {
    
    const asignacionDiv = document.createElement('div');
    asignacionDiv.classList.add('one_asig_modal_content');
    
    // Crear la estructura de la materia, tema y boton de archivo adjunto
    const fontMatP = document.createElement('p');
    fontMatP.classList.add('font_mat');
    fontMatP.textContent = materia.toUpperCase();

    const temaDiv = document.createElement('div');
    temaDiv.classList.add('font_tem');
    const temaP = document.createElement('p');
    temaP.textContent = tema.toUpperCase();
    temaDiv.appendChild(temaP);

    const temaLinea = document.createElement('hr');
    temaLinea.classList.add('linea_tema');

    if (adjunto == 1){
        const adjunBotonDiv = document.createElement('div');
        adjunBotonDiv.classList.add('adjun_boton');
        
        const icon = document.createElement('i');
        icon.classList.add('bx', 'bx-paperclip');
        icon.classList.add('adjun_icon');
        
        const adjunTexto = document.createElement('p');
        adjunTexto.classList.add('adjun_font');
        adjunTexto.innerHTML = `Descargar<br>archivo adjunto`;

        adjunBotonDiv.appendChild(icon);
        adjunBotonDiv.appendChild(adjunTexto);
        asignacionDiv.appendChild(adjunBotonDiv);
    } else {
        asignacionDiv.classList.add('grid_with_buttom');
    }

    // Crear la estructura del nombre de la asignacion, indicaciones principales y detalladas, y el tipo de asignacion
    const asignContentDiv = document.createElement('div');
    asignContentDiv.classList.add('asign_content');
    
    const asignTitSumDiv = document.createElement('div');
    
    if (tipo == 1){
        asignTitSumDiv.classList.add('asign_tit_sum');
        const asignTitSumP = document.createElement('p');
        asignTitSumP.textContent = `${asignacion.toUpperCase()} - SUMATIVA`;
        asignTitSumDiv.appendChild(asignTitSumP);
    } else {
        asignTitSumDiv.classList.add('asign_tit_form');
        const asignTitSumP = document.createElement('p');
        asignTitSumP.textContent = `${asignacion.toUpperCase()} - FORMATIVA`;
        asignTitSumDiv.appendChild(asignTitSumP);
    }
    
    const indicacionesTitleDiv = document.createElement('div');
    indicacionesTitleDiv.classList.add('ind_prin');
    const indicacionesTitleH4 = document.createElement('p');
    indicacionesTitleH4.textContent = ind_prin;
    indicacionesTitleDiv.appendChild(indicacionesTitleH4);
    
    const indicacionesContentDiv = document.createElement('div');
    indicacionesContentDiv.classList.add('ind_des');
    const indicacionesContentP = document.createElement('p');
    indicacionesContentP.textContent = ind_det;
    indicacionesContentDiv.appendChild(indicacionesContentP);
    
    asignacionDiv.appendChild(fontMatP);
    asignacionDiv.appendChild(temaDiv);
    asignacionDiv.appendChild(temaLinea);
    asignacionDiv.appendChild(asignTitSumDiv);
    asignacionDiv.appendChild(indicacionesTitleDiv);
    asignacionDiv.appendChild(indicacionesContentDiv);
    
    return asignacionDiv;
}

// Función para actualizar los días del calendario
function updateCalendar(month, year) {
    // eliminarElementos();
    // fetchData();
    let mes;
    let mesAnt;
    let mesPro;
    switch (month) {
        case 1: mes = 'Enero'; break;
        case 2: mes = 'Febrero'; break;
        case 3: mes = 'Marzo'; break;
        case 4: mes = 'Abril'; break;
        case 5: mes = 'Mayo'; break;
        case 6: mes = 'Junio'; break;
        case 7: mes = 'Julio'; break;
        case 8: mes = 'Agosto'; break;
        case 9: mes = 'Septiembre'; break;
        case 10: mes = 'Octubre'; break;
        case 11: mes = 'Noviembre'; break;
        case 12: mes = 'Diciembre'; break;
    }

    switch (month - 1) {
        case 0: mesAnt = 'Diciembre'; break;
        case 1: mesAnt = 'Enero'; break;
        case 2: mesAnt = 'Febrero'; break;
        case 3: mesAnt = 'Marzo'; break;
        case 4: mesAnt = 'Abril'; break;
        case 5: mesAnt = 'Mayo'; break;
        case 6: mesAnt = 'Junio'; break;
        case 7: mesAnt = 'Julio'; break;
        case 8: mesAnt = 'Agosto'; break;
        case 9: mesAnt = 'Septiembre'; break;
        case 10: mesAnt = 'Octubre'; break;
        case 11: mesAnt = 'Noviembre'; break;
    }

    switch (month + 1) {
        case 2: mesPro = 'Febrero'; break;
        case 3: mesPro = 'Marzo'; break;
        case 4: mesPro = 'Abril'; break;
        case 5: mesPro = 'Mayo'; break;
        case 6: mesPro = 'Junio'; break;
        case 7: mesPro = 'Julio'; break;
        case 8: mesPro = 'Agosto'; break;
        case 9: mesPro = 'Septiembre'; break;
        case 10: mesPro = 'Octubre'; break;
        case 11: mesPro = 'Noviembre'; break;
        case 12: mesPro = 'Diciembre'; break;
        case 13: mesPro = 'Enero'; break;
    }

    const titulo = document.getElementById('tit_mes_ahno');
    titulo.textContent = `${mes.toUpperCase()} ${year}`;
    const firstDayOfMonth = new Date(Date.UTC(year, month - 1, 1));
    let startDay = firstDayOfMonth.getUTCDay(); // 0 (Domingo) a 6 (Sábado)
    const lastDayOfMonth = new Date(Date.UTC(year, month, 0)).getUTCDate(); // Último día del mes

    // Ajuste si el primer día del mes es sábado
    let dayCounter = 1;
    if (startDay === 6) {
        dayCounter = 2; // Comenzar el mes desde el día 2 si el primer día es sábado
        startDay = 0;   // Empezar la semana desde el domingo
    }

    const days = document.querySelectorAll('.fecha button .fecha_dia');
    days.forEach(day => {
        day.textContent = '';
    });

    let i = startDay;
    for (; i < days.length; i++) {
        if (dayCounter <= lastDayOfMonth) {
            days[i].textContent = dayCounter++;
        } else {
            break;
        }
    }

    // Añadir los días del mes siguiente en la última semana
    let nextMonthDay = 1;
    for (; i < days.length; i++) {
        days[i].textContent = nextMonthDay++;
    }

    // Añadir los días del mes anterior en la primera semana
    let prevMonthDay = new Date(Date.UTC(year, month - 1, 0)).getUTCDate() - startDay + 1;
    for (let j = 0; j < startDay; j++) {
        days[j].textContent = prevMonthDay++;
    }
    verificarPantalla()
    updateModals(mes, mesAnt, mesPro)
}

// Actualizar los dias de los modals al igual que el texto referente a la semana que pertenecen
function updateModals(month, monthBef, monthNext) {
    for(let i = 1; i <= 5; i++) {
        const dia_in = document.getElementById(`dia_${i}1`);
        const dia_fin = document.getElementById(`dia_${i}5`);
        const semana = document.getElementById(`semana_${i}`);

        if (parseInt(dia_in.textContent, 10) > 20 && parseInt(dia_fin.textContent, 10) < 20 && i == 1) {
            semana.textContent = `SEMANA DEL LUNES ${dia_in.textContent} DE ${monthBef.toUpperCase()} AL VIERNES ${dia_fin.textContent} DE ${month.toUpperCase()} (${currentYear})`;
        } else if (parseInt(dia_in.textContent, 10) > 20 && parseInt(dia_fin.textContent, 10) < 20 && i == 5) {
            semana.textContent = `SEMANA DEL LUNES ${dia_in.textContent} DE ${month.toUpperCase()} AL VIERNES ${dia_fin.textContent} DE ${monthNext.toUpperCase()} (${currentYear})`;
        } else if (parseInt(dia_in.textContent, 10) < 15 && parseInt(dia_fin.textContent, 10) < 15 && i == 5){
            semana.textContent = `SEMANA DEL LUNES ${dia_in.textContent} DE ${monthNext.toUpperCase()} AL VIERNES ${dia_fin.textContent} DE ${monthNext.toUpperCase()} (${currentYear})`;
        } else {
            semana.textContent = `SEMANA DEL LUNES ${dia_in.textContent} DE ${month.toUpperCase()} AL VIERNES ${dia_fin.textContent} DE ${month.toUpperCase()} (${currentYear})`;
            for (let j = 1; j <=5; j++) {
                const dia = document.getElementById(`dia_${i}${j}`);
                const modal_dia = document.getElementById(`fecha_modal_${i}${j}`);
                modal_dia.textContent = dia.textContent;
            }
        }
    }
}


// Función para avanzar al próximo mes
function nextMonth() {
    if (currentMonth === 12) {
        currentMonth = 1;
        currentYear++;
    } else {
        currentMonth++;
    }
    updateCalendar(currentMonth, currentYear);
}

// Función para retroceder al mes anterior
function prevMonth() {
    if (currentMonth === 1) {
        currentMonth = 12;
        currentYear--;
    } else {
        currentMonth--;
    }
    updateCalendar(currentMonth, currentYear);
}

// Función para dejar solo la primera letra en mayúscula de cada elemento con clase ".dia"
function capitalizarInicial() {
    const elementosDia = document.querySelectorAll('.calendar .content .dias');
    elementosDia.forEach(elemento => {
        if (!elemento.dataset.originalText) {
            elemento.dataset.originalText = elemento.textContent.trim();
        }
        let texto = elemento.dataset.originalText.toLowerCase();
        elemento.textContent = texto.charAt(0).toUpperCase();
    });
}

// Función para dejar solo las primeras tres letras en mayúscula de cada elemento con clase ".materia"
function abreviarMateria() {
    const elementosMateria = document.querySelectorAll('.tit_mat_prev');
    elementosMateria.forEach(elemento => {
        if (!elemento.dataset.originalText) {
            elemento.dataset.originalText = elemento.textContent.trim();
        }
        let texto = elemento.dataset.originalText.toLowerCase();
        elemento.textContent = texto.slice(0, 3).toUpperCase();
    });
}

// Función para restaurar el texto original
function restaurarTextoOriginal() {
    const elementosDia = document.querySelectorAll('.calendar .content .dias');
    const elementosMateria = document.querySelectorAll('.tit_mat_prev');

    elementosDia.forEach(elemento => {
        if (elemento.dataset.originalText) {
            elemento.textContent = elemento.dataset.originalText;
        }
    });

    elementosMateria.forEach(elemento => {
        if (elemento.dataset.originalText) {
            elemento.textContent = elemento.dataset.originalText;
        }
    });
}

// Verificar si la pantalla es menor a 760px y ejecutar las funciones
function verificarPantalla() {
    if (window.matchMedia("(max-width: 760px)").matches) {
        capitalizarInicial();
        setTimeout(() => { abreviarMateria(); }, 80);
    } else {
        restaurarTextoOriginal();
    }
}

// Variable global para el mes y año actuales
let currentMonth = new Date().getUTCMonth() + 1; // 1 a 12
let currentYear = new Date().getUTCFullYear();

// Actualizar el calendario al cargar la página
updateCalendar(currentMonth, currentYear);

// Obtener botones y modales específicos
const botones_1 = document.querySelectorAll('.btn_tbl_1');
const botones_2 = document.querySelectorAll('.btn_tbl_2');
const botones_3 = document.querySelectorAll('.btn_tbl_3');
const botones_4 = document.querySelectorAll('.btn_tbl_4');
const botones_5 = document.querySelectorAll('.btn_tbl_5');

const modal_container_1 = document.getElementById('modal_container_1');
const close_1 = document.getElementById('close_1');
const modal_container_2 = document.getElementById('modal_container_2');
const close_2 = document.getElementById('close_2');
const modal_container_3 = document.getElementById('modal_container_3');
const close_3 = document.getElementById('close_3');
const modal_container_4 = document.getElementById('modal_container_4');
const close_4 = document.getElementById('close_4');
const modal_container_5 = document.getElementById('modal_container_5');
const close_5 = document.getElementById('close_5');

// Agregar eventos a cada conjunto de botones y sus respectivos modales
agregarEventosModal(botones_1, modal_container_1, close_1);
agregarEventosModal(botones_2, modal_container_2, close_2);
agregarEventosModal(botones_3, modal_container_3, close_3);
agregarEventosModal(botones_4, modal_container_4, close_4);
agregarEventosModal(botones_5, modal_container_5, close_5);

// Ejecutar la verificación al cargar la página y cuando se redimensiona la pantalla
window.addEventListener('load', verificarPantalla);
window.addEventListener('resize', verificarPantalla);