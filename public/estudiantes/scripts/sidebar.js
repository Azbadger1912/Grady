// Declaraciones de las constantes iniciales
const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.querySelector('.toggle-btn');

// Añadir evento de click al boton para mostrar/ocultar el sidebar
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Funcion para cerrar la sesion del usuario
function cerrarSesion() {
    // Redirigir al endpoint de logout
    window.location.href = '/logout';
}

const div = document.getElementById("cuerpo");
const texto = document.getElementById("tit_colegio");
const fullText = texto.textContent.trim(); // Guarda el texto completo

// Función para generar las iniciales
function getInitials(text) {
  return text
    .split(/\s+/) // Divide el texto en palabras
    .map(word => word[0]) // Obtiene la primera letra de cada palabra
    .join(''); // Une las iniciales
}

const initials = getInitials(fullText); // Calcula las iniciales

function updateText() {
  if (div.offsetWidth < 700) {
    texto.textContent = initials; // Muestra las iniciales si el ancho es menor a 700px
  } else {
    texto.textContent = fullText; // Muestra el texto completo si el ancho es mayor o igual a 700px
  }
}

// Llama a la función cada vez que se redimensione la ventana
window.addEventListener("resize", updateText);

// Llama a la función cuando cargue la página para verificar el tamaño inicial
updateText();