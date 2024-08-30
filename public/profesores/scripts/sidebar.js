const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.querySelector('.toggle-btn');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});


function cerrarSesion() {
    // Redirigir al endpoint de logout
    window.location.href = '/logout';
}
