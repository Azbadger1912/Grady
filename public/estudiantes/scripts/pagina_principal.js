// Consulta y colocacion de datos personales del estudiante
document.addEventListener("DOMContentLoaded", function() {
    // Consulta a la base de datos
    fetch('/user_data')
        .then(response => response.json())
        .then(data => {
            const grado = data.grado;
            const cedula = data.cedula;
            const userName = data.userNickName;
            const consejero = data.consejero;

            // Colocacion de datos personales del estudiante
            const name = document.getElementById('nom_ape');
            const grad = document.getElementById('grado');
            const guide = document.getElementById('conse');
            const cedu = document.getElementById('ced');
            name.textContent = userName;
            grad.textContent = grado.toUpperCase();
            guide.textContent = consejero;
            cedu.textContent = cedula.replace(/_/g, '-');
        })
        .catch(error => console.error('Error al obtener los datos del usuario:', error));
});

// Declaracion de variables de fecha actual y constante de las abreviaciones de los dias
const days = ['lun', 'mar', 'mie', 'jue', 'vie'];
let currentDayIndex = 0;
let currentDate = new Date();

// Si es sábado o domingo, ajustamos la fecha al lunes siguiente
if (currentDate.getDay() === 6) { // Sábado
    currentDate.setDate(currentDate.getDate() + 2);
} else if (currentDate.getDay() === 0) { // Domingo
    currentDate.setDate(currentDate.getDate() + 1);
} else {
    // Ajustar currentDayIndex al día de la semana actual
    currentDayIndex = currentDate.getDay() - 1; // Lunes = 0, Martes = 1, ..., Viernes = 4
}

// Funcion para actualizar el panel de actividades
async function updateAsignment() {
    try {
        // Consulta a la base de datos de la agenda del estudiante
        const response = await fetch('/agenda_data');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();

        // Evaluaciones para colocar las actividades proximas en el panel
        let slots = 0;
        for (let dato of data) {
            const fecha = new Date(dato['Fecha']);
            if (fecha.toDateString() == currentDate.toDateString()){
                
                if (dato.Tipo == 1 && slots < 4) {
                    slots++;
                    const slot = document.getElementById(`slot_num${slots}`);
                    slot.style.color = 'black';
                    slot.innerHTML = `<span class="materia_asign">${dato['Materia'].toUpperCase()}</span><span class="linea"> | </span><span class="puntos">: </span><span style="color: #3ccd00;">${dato['Asignacion'].toUpperCase()}</span>`;
                }
            }
        }
        for (let dato of data) {
            const fecha = new Date(dato['Fecha']);
            if (fecha.toDateString() == currentDate.toDateString()){
                if (dato.Tipo == 0 && slots < 4) {
                    slots++;
                    const slot = document.getElementById(`slot_num${slots}`);
                    slot.style.color = 'black';
                    slot.innerHTML = `<span class="materia_asign">${dato['Materia'].toUpperCase()}</span><span class="linea"> | </span><span class="puntos">: </span><span style="color: #0588c8;">${dato['Asignacion'].toUpperCase()}</span>`;
                }
            }
        }
        if (slots == 0) {
            for (let i = 1; i <= 4; i++) {
                const slot = document.getElementById(`slot_num${i}`);
                slot.style.color = 'white';
                slot.innerHTML = `-`;
            }
        } else if (slots == 1) {
            for (let i = 2; i <= 4; i++) {
                const slot = document.getElementById(`slot_num${i}`);
                slot.style.color = 'white';
                slot.innerHTML = `-`;
            }
        } else if (slots == 2){
            for (let i = 3; i <= 4; i++) {
                const slot = document.getElementById(`slot_num${i}`);
                slot.style.color = 'white';
                slot.innerHTML = `-`;
            }
        } else if (slots == 3){
            for (let i = 4; i <= 4; i++) {
                const slot = document.getElementById(`slot_num${i}`);
                slot.style.color = 'white';
                slot.innerHTML = `-`;
            }
        }

    } catch (error) {
        console.error('Error obteniendo los datos:', error);
    }
}

// Actualizar la fecha segun el dia de la semana en el panel de actividades
function updateDisplay() {
    const dayText = document.getElementById('dia_boton');
    const dateText = document.querySelector('.fechas_agen p:nth-child(2)');

    // Actualizar texto del día
    dayText.textContent = days[currentDayIndex];
    
    // Actualizar la fecha mostrada
    const displayedDate = new Date(currentDate);
    displayedDate.setDate(currentDate.getDate() - currentDayIndex + currentDayIndex);
    
    // Actualizar texto de la fecha
    const day = String(displayedDate.getDate()).padStart(2, '0');
    const month = String(displayedDate.getMonth() + 1).padStart(2, '0');
    dateText.textContent = `${day}/${month}`;
    updateAsignment()
}

// Retroceder un dia en la semana en el panel de actividades
document.querySelector('.up-arrow').addEventListener('click', function (e) {
    e.preventDefault();
    if (currentDayIndex > 0) {
        currentDayIndex--;
        currentDate.setDate(currentDate.getDate() - 1);
        updateDisplay();
    }
});


// Avanzar un dia en la semana en el panel de actividades
document.querySelector('.down-arrow').addEventListener('click', function (e) {
    e.preventDefault();
    if (currentDayIndex < 4) {
        currentDayIndex++;
        currentDate.setDate(currentDate.getDate() + 1);
        updateDisplay();
    }
});

// Determinar que trimestre se esta cursando y colocar el promedio
async function showProms() {
    try {
        const response = await fetch('/promedios_data');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();

        // Evaluaciones para determinar que trimestre esta cursando
        for (let dato of data){
            if (dato['Trimestre'] == 'Primero'){
                if (dato['Cursando'] == '1'){
                    document.getElementById('promedio_pri').innerHTML = `1er Trimestre: [${dato['Promedio']}]`;
                } else if (dato['Cursando'] == '0'){
                    document.getElementById('promedio_pri').innerHTML = `1er Trimestre: [<a href="notas.html" class="ver_bol">ver boletín</a>]`;
                } else {
                    document.getElementById('promedio_pri').innerHTML = `1er Trimestre: [...]`;
                }
            } else if (dato['Trimestre'] == 'Segundo'){
                if (dato['Cursando'] == '1'){
                    document.getElementById('promedio_seg').innerHTML = `2do Trimestre: [${dato['Promedio']}]`;
                } else if (dato['Cursando'] == '0'){
                    document.getElementById('promedio_seg').innerHTML = `2do Trimestre: [<a href="notas.html" class="ver_bol">ver boletín</a>]`;
                } else {
                    document.getElementById('promedio_seg').innerHTML = `2do Trimestre: [...]`;
                }
            } else {
                if (dato['Cursando'] == '1'){
                    document.getElementById('promedio_ter').innerHTML = `3er Trimestre: [${dato['Promedio']}]`;
                } else if (dato['Cursando'] == '0'){
                    document.getElementById('promedio_ter').innerHTML = `3er Trimestre: [<a href="notas.html" class="ver_bol">ver boletín</a>]`;
                } else {
                    document.getElementById('promedio_ter').innerHTML = `3er Trimestre: [...]`;
                }
            }
        }

    } catch (error) {
        console.error('Error obteniendo los datos:', error);
    }
}

// Inicializar la vista
updateDisplay();
showProms();