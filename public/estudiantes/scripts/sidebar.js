// Declaraciones de las constantes iniciales
const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.querySelector('.toggle-btn');

// Añadir evento de click al botón para mostrar/ocultar el sidebar
toggleBtn.addEventListener('click', () => {
  if ((window.matchMedia("(min-width: 1140px)").matches) ||  (window.matchMedia("(min-width: 760px)").matches)) {
    sidebar.classList.toggle('active');
  } else{
    if (sidebar.classList.contains('active')) {
        // Primero quitar el ancho con transición
        sidebar.classList.remove('active');
        
        // Luego quitar el z-index después de la transición de ancho
        setTimeout(() => {
            sidebar.classList.remove('transition'); 
            sidebar.classList.remove('z-index-active');
        }, 500); // Ajusta el tiempo según la duración de la transición de ancho
    } else {
        // Primero aplicar el z-index inmediatamente
        sidebar.classList.add('z-index-active');
        
        // Luego aplicar el ancho con transición
        setTimeout(() => {
            sidebar.classList.add('transition');
            sidebar.classList.add('active');
        }, 200); // Retardo mínimo
    }
  }
});

// Funcion para cerrar la sesion del usuario
function cerrarSesion() {
    // Redirigir al endpoint de logout
    window.location.href = '/logout';
}

const div = document.getElementById("cuerpo");
const texto = document.getElementById("tit_colegio");
const fullText = texto.textContent.trim(); // Guarda el texto completo

const header = document.getElementById('cabecera');

window.addEventListener('scroll', function() {
  if (window.scrollY > 0) {
    header.classList.add('scrolled'); // Añade la sombra cuando hay scroll
  } else {
    header.classList.remove('scrolled'); // Quita la sombra cuando está en la parte superior
  }
});

// Función para generar las iniciales
function getInitials(text) {
  return text
    .split(/\s+/) // Divide el texto en palabras
    .map(word => word[0]) // Obtiene la primera letra de cada palabra
    .join('.'); // Une las iniciales
}

const initials = getInitials(fullText); // Calcula las iniciales

function updateText() {
  if (div.offsetWidth < 700) {
    texto.textContent = initials + "."; // Muestra las iniciales si el ancho es menor a 700px
  } else {
    texto.textContent = fullText; // Muestra el texto completo si el ancho es mayor o igual a 700px
  }
}

// Llama a la función cada vez que se redimensione la ventana
window.addEventListener("resize", updateText);

// Llama a la función cuando cargue la página para verificar el tamaño inicial
updateText();