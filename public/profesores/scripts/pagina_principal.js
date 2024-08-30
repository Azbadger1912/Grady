const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.querySelector('.toggle-btn');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

function cerrarSesion() {
    // Redirigir al endpoint de logout
    window.location.href = '/logout';
}

document.addEventListener("DOMContentLoaded", function() {
    fetch('/user_data')
        .then(response => response.json())
        .then(data => {
            const grado = data.consejeria;
            const cedula = data.cedula;
            const userName = data.userNickName;

            // Aquí puedes usar las variables como desees
            const name = document.getElementById('nom_ape');
            const grad = document.getElementById('grado');
            const cedu = document.getElementById('ced');
            name.textContent = userName;
            grad.textContent = grado.toUpperCase();
            cedu.textContent = cedula.replace(/_/g, '-');
        })
        .catch(error => console.error('Error al obtener los datos del usuario:', error));
});

function nextElement() {
    currentIndex = (currentIndex + 1) % elements.length;
    document.getElementById('dia_boton').textContent = elements[currentIndex];
    updateAsignment();
}

function previousElement() {
    currentIndex = (currentIndex - 1 + elements.length) % elements.length;
    document.getElementById('dia_boton').textContent = elements[currentIndex];
    updateAsignment();
}

function nextElement1() {
    currentIndex1 = (currentIndex1 + 2) % elements.length;
    document.getElementById('mat_tem1').textContent = elements[currentIndex1];
    currentIndex2 = (currentIndex2 + 2) % elements.length;
    document.getElementById('mat_tem2').textContent = elements[currentIndex2];
    fetchDataMat(false);
}

function previousElement1() {
    currentIndex1 = (currentIndex1 - 2 + elements.length) % elements.length;
    document.getElementById('mat_tem1').textContent = elements[currentIndex1];
    currentIndex2 = (currentIndex2 - 2 + elements.length) % elements.length;
    document.getElementById('mat_tem2').textContent = elements[currentIndex2];
    fetchDataMat(false);
}

async function fetchDataMat(ini) {
    try {
        const response = await fetch('/materias_prof_data');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();

        const elementMat = document.querySelectorAll('.created-element-materia');
        elementMat.forEach(element => element.remove());

        if(ini){
            for (let dato of data) {
                elements.push(dato['Grupo'].toUpperCase());
            }
            document.getElementById('dia_boton').textContent = elements[currentIndex];
            document.getElementById('mat_tem1').textContent = elements[currentIndex1];
            document.getElementById('mat_tem2').textContent = elements[currentIndex2];
            updateAsignment();
        } 

        const text_mat_1 = document.getElementById('materias_1')
        for (let dato of data){
            if (dato['Grupo'].toUpperCase() == document.getElementById('mat_tem1').textContent){
                const materia = document.createElement('p');
                materia.classList.add('created-element-materia');
                materia.textContent = dato['Materia'].toUpperCase();
                text_mat_1.appendChild(materia);
            }
        }
        const text_mat_2 = document.getElementById('materias_2')
        for (let dato of data){
            if (dato['Grupo'].toUpperCase() == document.getElementById('mat_tem2').textContent){
                const materia = document.createElement('p');
                materia.classList.add('created-element-materia');
                materia.textContent = dato['Materia'].toUpperCase();
                text_mat_2.appendChild(materia);
            }
        }

    } catch (error) {
        console.error('Error obteniendo los datos:', error);
    }
}

// const days = ['lun', 'mar', 'mie', 'jue', 'vie'];
let currentDayIndex = 0;
let currentDate = new Date();

async function updateAsignment() {
    try {
        const response = await fetch('/agenda_prof_data');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();

        let slots = 0;
        const diasSemana = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
        for (let dato of data) {
            const fecha = new Date(dato['Fecha']);
            if (fecha >= currentDate && dato['Grupo'].toUpperCase() == document.getElementById('dia_boton').textContent){
                if (dato.Tipo == 1 && slots < 4) {
                    
    
                    const diaSemana = diasSemana[fecha.getDay()];
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    slots++;
                    const slot = document.getElementById(`slot_num${slots}`);
                    slot.style.color = 'black';
                    slot.innerHTML = `<span style="color: #15b3b3;">${diaSemana} ${dia}/${mes}</span> | ${dato['Materia'].toUpperCase()} | <span style="color: #3ccd00;">${dato['Asignacion'].toUpperCase()}</span>`;
                }
            }
        }
        for (let dato of data) {
            const fecha = new Date(dato['Fecha']);
            if (fecha >= currentDate && dato['Grupo'].toUpperCase() == document.getElementById('dia_boton').textContent){
                if (dato.Tipo == 0 && slots < 4) {
                    slots++;
                    const slot = document.getElementById(`slot_num${slots}`);
                    slot.style.color = 'black';
                    slot.innerHTML = `<span style="color: #15b3b3;">${dato['Materia'].toUpperCase()}</span> | ${dato['Materia'].toUpperCase()} | <span style="color: #0588c8;">${dato['Asignacion'].toUpperCase()}</span>`;
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



const elements = [];
const elements2 = [];
let currentIndex = 0;
let currentIndex1 = 0;
let currentIndex2 = 1;
fetchDataMat(true);

