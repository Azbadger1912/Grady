const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.querySelector('.toggle-btn');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

function cerrarSesion() {
    // Redirigir al endpoint de logout
    window.location.href = '/logout';
}

async function fetchData(select) {
    try {
        const response = await fetch('/agenda_prof_data');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        let trimestre;
        if(document.getElementById('trimestre').value == 1){trimestre = 'Primero';}
        else if (document.getElementById('trimestre').value == 2){trimestre = 'Segundo';}
        else {trimestre = 'Tercero';}
        asignUsadas = [];
        for (let dato of data) {
            if (`${dato['Grupo'].toUpperCase()} - ${dato['Materia'].toUpperCase()}` === select && dato['Trimestre'] == trimestre){
                let AsignTrim = {titulo: dato['Asignacion'].toUpperCase(), trimestre: dato['Trimestre']}

                asignUsadas.push(AsignTrim);
                console.log(asignUsadas);

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
                    asigModalContent.prepend(asignacion);
                }

                
            }
        }

    } catch (error) {
        console.error('Error obteniendo los datos:', error);
    }
}

async function fetchDataMat() {
    try {
        const response = await fetch('/materias_prof_data');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        let valor = 1;
        for (let dato of data) {
            const cbm = document.getElementById('grupo');
            const cbmOption = document.createElement('option');
            cbmOption.value = valor;
            cbmOption.textContent = `${dato['Grupo'].toUpperCase()} - ${dato['Materia'].toUpperCase()}`;
            cbm.appendChild(cbmOption);
            valor++;
        }

    } catch (error) {
        console.error('Error obteniendo los datos:', error);
    }
}

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

function eliminarElementos(){
    const elements = document.querySelectorAll('.generated-element');
    elements.forEach(element => element.remove());
}

function agregarEventosModal(botones, modalContainer, closeButton) {
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            modalContainer.classList.add('show');
        });
    });

    closeButton.addEventListener('click', () => {
        modalContainer.classList.remove('show');
        const element1 = document.querySelectorAll('.asign-created');
        element1.forEach(element => element.remove());
        crearAsig = true;
        bot_add = false;
    });
}

function crearPrevAsign(materia, tipo, asignacion) {
    const asignDiv = document.createElement('div');
    asignDiv.style.marginTop = '5px';
    
    const matP = document.createElement('p');
    matP.textContent = materia.toUpperCase();

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

function evalTam(content, divCreado){
    
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


}

function crearAsignacion(materia, tema, ind_prin, ind_det, tipo, asignacion, adjunto) {
    const asignacionDiv = document.createElement('div');
    asignacionDiv.classList.add('one_asig_modal_content');
    
    const matTemDiv = document.createElement('div');
    matTemDiv.classList.add('mat_tem');
    
    const matTemDiv1 = document.createElement('div');
    matTemDiv1.classList.add('mat_tem_1');

    const fontMatP = document.createElement('p');
    fontMatP.classList.add('font_mat');
    fontMatP.textContent = materia.toUpperCase();

    const temaP = document.createElement('p');
    temaP.style.fontSize = '12px';
    temaP.textContent = tema.toUpperCase();

    if (adjunto == 1){
        const adjunBotonDiv = document.createElement('div');
        adjunBotonDiv.classList.add('adjun_boton');
        
        const icon = document.createElement('i');
        icon.classList.add('bx', 'bx-paperclip');
        icon.style.fontSize = '20px';
        icon.style.paddingRight = '10px';
        
        const adjunTexto = document.createElement('p');
        adjunTexto.style.fontSize = '12px';
        adjunTexto.innerHTML = `Descargar<br>archivo adjunto`;
        

        matTemDiv1.appendChild(fontMatP);
        matTemDiv1.appendChild(temaP);
        matTemDiv.appendChild(matTemDiv1);
        adjunBotonDiv.appendChild(icon);
        adjunBotonDiv.appendChild(adjunTexto);
        matTemDiv.appendChild(adjunBotonDiv);
    } else {
        matTemDiv1.style.height = '160px';
        matTemDiv1.appendChild(fontMatP);
        matTemDiv1.appendChild(temaP);
        matTemDiv.appendChild(matTemDiv1);
    }

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
    
    const indicacionesDiv = document.createElement('div');
    indicacionesDiv.style.display = 'flex';
    indicacionesDiv.style.marginTop = '10px';
    
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
    
    indicacionesDiv.appendChild(indicacionesTitleDiv);
    indicacionesDiv.appendChild(indicacionesContentDiv);
    
    asignContentDiv.appendChild(asignTitSumDiv);
    asignContentDiv.appendChild(indicacionesDiv);
    
    asignacionDiv.appendChild(matTemDiv);
    asignacionDiv.appendChild(asignContentDiv);
    
    return asignacionDiv;
}

// Función para actualizar los días del calendario
function updateCalendar(month, year) {
    eliminarElementos();
    fetchData(textoSeleccionado);
    let mes;
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

    updateModals(mes)
}

function updateModals(month) {
    for(let i = 1; i <= 5; i++) {
        const dia_in = document.getElementById(`dia_${i}1`);
        const dia_fin = document.getElementById(`dia_${i}5`);
        const semana = document.getElementById(`semana_${i}`);
        semana.textContent = `SEMANA DEL LUNES ${dia_in.textContent} DE ${month.toUpperCase()} AL VIERNES ${dia_fin.textContent} DE ${month.toUpperCase()} (${currentYear})`;
        for(let j = 1; j <=5; j++) {
            const dia = document.getElementById(`dia_${i}${j}`);
            const modal_dia = document.getElementById(`fecha_modal_${i}${j}`);
            modal_dia.textContent = dia.textContent;
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

function addAsign(week, day){
    async function crearOp(select) {
        try {
            const response = await fetch('/evaluacion_data');
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            const data = await response.json();
            const textSelect = selectElementCon.options[selectElementCon.selectedIndex].text;
            let trimestre;
            if(document.getElementById('trimestre').value == 1){trimestre = 'Primero';}
            else if (document.getElementById('trimestre').value == 2){trimestre = 'Segundo';}
            else {trimestre = 'Tercero';}
            for (let dato of data) {
                const objetoBuscado = {titulo: dato['Titulo'], trimestre: dato['Trimestre']};
                let encontrado = asignUsadas.some(objeto => objeto.titulo === objetoBuscado.titulo && objeto.trimestre === objetoBuscado.trimestre);
                if (`${dato['Grupo'].toUpperCase()} - ${dato['Materia'].toUpperCase()}` === textSelect && !encontrado && trimestre == dato['Trimestre']){
                    const ops = document.createElement('option');
                    ops.textContent = dato['Titulo'].toUpperCase();
                    ops.value = dato['Titulo'].toUpperCase();
                    select.appendChild(ops);
                    const element = document.querySelectorAll('.opcion-vacia');
                    element.forEach(element => element.remove());
                }
            }
    
        } catch (error) {
            console.error('Error obteniendo los datos:', error);
        }
    }

    function extUltPal(cadena) {
        let partes = cadena.split(" - ");
        
        let ultimaParte = partes[partes.length - 1];
        
        let palabras = ultimaParte.split(" ");
        return palabras[palabras.length - 1];
    }

    if (crearAsig){
        crearAsig = false;
        const asignacionDiv = document.createElement('div');
        asignacionDiv.id = 'asigDiv_add';
        asignacionDiv.classList.add('one_asig_modal_content');
        asignacionDiv.classList.add('asign-created');
        
        const matTemDiv = document.createElement('div');
        matTemDiv.classList.add('mat_tem');
        
        const matTemDiv1 = document.createElement('div');
        matTemDiv1.classList.add('mat_tem_1');

        const fontMatP = document.createElement('p');
        fontMatP.classList.add('font_mat');
        fontMatP.style.color = '#444';
        fontMatP.textContent = (extUltPal(selectElementCon.options[selectElementCon.selectedIndex].text)).toUpperCase();
        fontMatP.id = 'Materia_Add';

        const temaP = document.createElement('textarea');
        temaP.style.fontSize = '12px';
        temaP.style.color = '#777'
        temaP.placeholder = 'Tema (60)';
        temaP.style.border = '0';
        temaP.style.resize = 'none';
        temaP.style.width = '98%';
        temaP.style.padding = '4px';
        temaP.style.marginLeft = '1%';
        temaP.style.height = '63px';
        temaP.setAttribute('maxlength', `60`);
        temaP.id = 'Tema_Add';

        const adjunBotonDiv = document.createElement('div');
        adjunBotonDiv.classList.add('adjun_boton_upload');
        adjunBotonDiv.setAttribute('onclick', `addArchivo()`);
        
        const icon = document.createElement('i');
        icon.classList.add('bx', 'bx-paperclip');
        icon.style.fontSize = '20px';
        icon.style.paddingRight = '10px';
        
        const adjunTexto = document.createElement('p');
        adjunTexto.style.fontSize = '12px';
        adjunTexto.innerHTML = `Añadir archivo<br>(opcional)`;
        

        matTemDiv1.appendChild(fontMatP);
        matTemDiv1.appendChild(temaP);
        matTemDiv.appendChild(matTemDiv1);
        adjunBotonDiv.appendChild(icon);
        adjunBotonDiv.appendChild(adjunTexto);
        matTemDiv.appendChild(adjunBotonDiv);

        const asignContentDiv = document.createElement('div');
        asignContentDiv.classList.add('asign_content');
        
        const asignTitSumDiv = document.createElement('div');

        asignTitSumDiv.classList.add('asign_tit_nue');
        const asignTitSelectDiv = document.createElement('div');
        asignTitSelectDiv.classList.add('cbm_mate');
        asignTitSelectDiv.style.width = '25%';
        asignTitSelectDiv.style.minWidth = '200px';
        asignTitSelectDiv.style.marginRight = '3%';
        const asignTitSelect = document.createElement('select');
        const optEmT = document.createElement('option');
        optEmT.textContent = 'VACÍO';
        optEmT.value = 'VACÍO';
        optEmT.classList.add('opcion-vacia')
        asignTitSelect.appendChild(optEmT);
        crearOp(asignTitSelect);
        asignTitSelect.id = 'AsigTit_Add';
        const asignTitSelectArrow = document.createElement('i');
        asignTitSelectArrow.classList.add('bx', 'bx-chevron-down');
        asignTitSelectDiv.appendChild(asignTitSelect);
        asignTitSelectDiv.appendChild(asignTitSelectArrow);

        const tipTitSelectDiv = document.createElement('div');
        tipTitSelectDiv.classList.add('cbm_mate');
        tipTitSelectDiv.style.width = '25%';
        tipTitSelectDiv.style.minWidth = '180px';
        const tipTitSelect = document.createElement('select');
        const tipTitOpt1 = document.createElement('option');
        tipTitOpt1.style.color = '#3ccd00'
        tipTitOpt1.value = '1';
        tipTitOpt1.textContent = 'SUMATIVA';
        const tipTitOpt2 = document.createElement('option');
        tipTitOpt2.style.color = '#0588c8'
        tipTitOpt2.value = '0';
        tipTitOpt2.textContent = 'FORMATIVA';
        tipTitSelect.appendChild(tipTitOpt1);
        tipTitSelect.appendChild(tipTitOpt2);
        tipTitSelect.id = 'TipTit_Add';
        const tipTitSelectArrow = document.createElement('i');
        tipTitSelectArrow.classList.add('bx', 'bx-chevron-down');
        tipTitSelectDiv.appendChild(tipTitSelect);
        tipTitSelectDiv.appendChild(tipTitSelectArrow);

        asignTitSumDiv.appendChild(asignTitSelectDiv);
        asignTitSumDiv.appendChild(tipTitSelectDiv);
        
        const indicacionesDiv = document.createElement('div');
        indicacionesDiv.style.display = 'flex';
        indicacionesDiv.style.marginTop = '10px';
        
        const indicacionesTitleDiv = document.createElement('div');
        indicacionesTitleDiv.classList.add('ind_prin');

        const indicacionesTitleH4 = document.createElement('textarea');
        indicacionesTitleH4.placeholder = 'Indicaciones principales (200)';
        indicacionesTitleH4.style.border = '0';
        indicacionesTitleH4.style.resize = 'none';
        indicacionesTitleH4.style.width = '98%';
        indicacionesTitleH4.style.padding = '4px';
        indicacionesTitleH4.style.marginLeft = '1%';
        indicacionesTitleH4.style.height = '90%';
        indicacionesTitleH4.style.marginTop = '5px';
        indicacionesTitleH4.style.fontSize = '12px';
        indicacionesTitleH4.style.color = '#777'
        indicacionesTitleH4.setAttribute('maxlength', `200`);
        indicacionesTitleH4.id = 'IndPrin_Add'

        indicacionesTitleDiv.appendChild(indicacionesTitleH4);
        
        const indicacionesContentDiv = document.createElement('div');
        indicacionesContentDiv.classList.add('ind_des');

        const indicacionesContentP = document.createElement('textarea');
        indicacionesContentP.placeholder = 'Indicaciones detalladas (400)';
        indicacionesContentP.style.border = '0';
        indicacionesContentP.style.resize = 'none';
        indicacionesContentP.style.width = '98%';
        indicacionesContentP.style.padding = '4px';
        indicacionesContentP.style.marginLeft = '1%';
        indicacionesContentP.style.height = '90%';
        indicacionesContentP.style.marginTop = '5px';
        indicacionesContentP.style.fontSize = '12px';
        indicacionesContentP.style.color = '#777'
        indicacionesContentP.setAttribute('maxlength', `400`);
        indicacionesContentP.id = 'IndDet_Add'

        const btn_ok = document.createElement('button');
        btn_ok.className = 'btn_ok';
        btn_ok.setAttribute('onclick', `publicAsign()`)
        const ok_sign = document.createElement('i');
        ok_sign.classList.add('bx', 'bx-check');
        btn_ok.appendChild(ok_sign);

        const btn_cancel = document.createElement('button');
        btn_cancel.className = 'btn_cancel';
        btn_cancel.setAttribute('onclick', `cancelar()`)
        const cancel_sign = document.createElement('i');
        cancel_sign.classList.add('bx', 'bx-trash-alt');
        btn_cancel.appendChild(cancel_sign);
        
        indicacionesContentDiv.appendChild(indicacionesContentP);
        
        indicacionesDiv.appendChild(indicacionesTitleDiv);
        indicacionesDiv.appendChild(indicacionesContentDiv);
        
        asignContentDiv.appendChild(asignTitSumDiv);
        asignContentDiv.appendChild(indicacionesDiv);
        
        asignacionDiv.appendChild(btn_ok);
        asignacionDiv.appendChild(btn_cancel);
        asignacionDiv.appendChild(matTemDiv);
        asignacionDiv.appendChild(asignContentDiv);
        
        
        const asig = document.getElementById(`asig_modal_content_${week}_${day}`);
        const lastDiv = asig.lastElementChild;
        asig.insertBefore(asignacionDiv, lastDiv);

        semana_asig = week;
        dia_asig = day;

        return asignacionDiv;
    }
}

function publicAsign(){
    function extPrimPal(cadena) {
        let partes = cadena.split(" - ");
        
        let primeraParte = partes[0];
        
        let palabras = primeraParte.split(" ");
        return palabras[0];
    }

    if (document.getElementById('AsigTit_Add').value !== 'VACÍO'){
        let materia_add, tema_add, asignacion_add, tipo_add, ind_prin_add, ind_det_add, grupo_add;
        materia_add = document.getElementById('Materia_Add').textContent;
        if (document.getElementById('Tema_Add').value !== ''){
            tema_add = document.getElementById('Tema_Add').value;
        } else {
            tema_add = '-';
        }
        if (document.getElementById('AsigTit_Add').value!== ''){
            asignacion_add = document.getElementById('AsigTit_Add').value;
        } else {
            asignacion_add = '-';
        }
    
        tipo_add = document.getElementById('TipTit_Add').value;
    
        if (document.getElementById('IndPrin_Add').value !== ''){
            ind_prin_add = document.getElementById('IndPrin_Add').value;
        } else {
            ind_prin_add = '-';
        }
    
        if (document.getElementById('IndDet_Add').value !== ''){
            ind_det_add = document.getElementById('IndDet_Add').value;
        } else {
            ind_det_add = '-';
        }
        grupo_add = (extPrimPal(selectElementCon.options[selectElementCon.selectedIndex].text)).toLowerCase();
        if (bot_add){
            adjun_add = 1;
        } else {
            adjun_add = 0;
        }
        dia = document.getElementById(`fecha_modal_${semana_asig}${dia_asig}`).textContent;

        if (semana_asig == '1' && dia > 15){
            fecha_add = `${currentYear}-${currentMonth - 1}-${dia}T05:00:00.000Z`;
        } else if (semana_asig == '5' && dia < 15){
            fecha_add = `${currentYear}-${currentMonth + 1}-${dia}T05:00:00.000Z`;
        } else {
            fecha_add = `${currentYear}-${currentMonth}-${dia}T05:00:00.000Z`;
        }

        let trimestre;
        if(document.getElementById('trimestre').value == 1){trimestre = 'Primero';}
        else if (document.getElementById('trimestre').value == 2){trimestre = 'Segundo';}
        else {trimestre = 'Tercero';}
        asignUsadas = [];
    
        fetch('/add-asignacion-prof', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                materia: materia_add, 
                tema: tema_add, 
                indPrin: ind_prin_add, 
                IndDet: ind_det_add, 
                tipo: tipo_add, 
                asignacion: asignacion_add, 
                adjunto: adjun_add, 
                fecha: fecha_add, 
                grupo: grupo_add,
                trimestre: trimestre
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

        fetch('/add-asignacion-grado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                materia: materia_add, 
                tema: tema_add, 
                indPrin: ind_prin_add, 
                IndDet: ind_det_add, 
                tipo: tipo_add, 
                asignacion: asignacion_add, 
                adjunto: adjun_add, 
                fecha: fecha_add, 
                grupo: grupo_add
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
            const element = document.querySelectorAll('.asign-created');
            element.forEach(element => element.remove());
            crearAsig = true;
            bot_add = false;
            eliminarElementos();
            fetchData(selectElementCon.options[selectElementCon.selectedIndex].text);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al añadir la asignación');
        });
    } else {
        document.getElementById('AsigTit_Add').style.color = 'red';
        document.getElementById('asigDiv_add').style.backgroundColor = '#FFDDDD';
        document.getElementById('Tema_Add').style.backgroundColor = '#FFDDDD';
        document.getElementById('IndPrin_Add').style.backgroundColor = '#FFDDDD';
        document.getElementById('IndDet_Add').style.backgroundColor = '#FFDDDD';
    }

    
}

function cancelar(){
    const element = document.querySelectorAll('.asign-created');
    element.forEach(element => element.remove());
    crearAsig = true;
    bot_add = false;
}

function addArchivo(){
    bot_add = true;
}

async function esperar(){
    await new Promise(resolve => setTimeout(resolve, 30));
    fetchData(selectElementCon.options[selectElementCon.selectedIndex].text);
}

fetchDataMat();
const selectElementCon = document.getElementById('grupo');
let textoSeleccionado;
let asignUsadas = [];
selectElementCon.addEventListener('change', function() {
    textoSeleccionado = selectElementCon.options[selectElementCon.selectedIndex].text;
    eliminarElementos();
    fetchData(textoSeleccionado);
});

document.getElementById('trimestre').addEventListener('change', function() {
    eliminarElementos();
    fetchData(selectElementCon.options[selectElementCon.selectedIndex].text);
});

let crearAsig = true;
let bot_add = false;
let semana_asig = 0;
let dia_asig = 0;

// Variable global para el mes y año actuales
let currentMonth = new Date().getUTCMonth() + 1; // 1 a 12
let currentYear = new Date().getUTCFullYear();

// Actualizar el calendario al cargar la página
updateCalendar(currentMonth, currentYear);
esperar();


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
