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