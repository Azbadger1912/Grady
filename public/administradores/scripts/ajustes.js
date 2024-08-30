const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.querySelector('.toggle-btn');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

function cerrarSesion() {
  // Redirigir al endpoint de logout
  window.location.href = '/logout';
}


let cedula;

document.addEventListener("DOMContentLoaded", function() {
    fetch('/user_data')
        .then(response => response.json())
        .then(data => {
            const pass = data.contrasena;
            const userName = data.userNickName;
            const correo = data.correo;
            cedula = data.cedula;

            const usuario = document.getElementById('user');
            const password = document.getElementById('pass');
            const email = document.getElementById('email');
            usuario.value = userName;
            password.value = pass;
            email.value = correo;
        })
        .catch(error => console.error('Error al obtener los datos del usuario:', error));
});

function modificarDatos(){
    const nombre = document.getElementById('user').value;
    const correo = document.getElementById('email').value;

    fetch('/update-user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: cedula,
      nombre: nombre,
      correo: correo,
    })
  })
  .then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Error al actualizar datos');
    }
  })
  .then(data => {
    alert(data);
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error al actualizar usuario');
  });
}

function modificarPass() {
  const passIn = document.getElementById('pass1').value;
  const passInConfirm = document.getElementById('pass2').value;

  if (passIn === passInConfirm && passIn !== '') {
      fetch('/update-password', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              id: cedula, // Asegúrate de que la variable `cedula` esté definida y tenga el valor correcto
              contrasena: passIn // Enviamos el valor de la contraseña, no el elemento HTML
          })
      })
      .then(response => {
          if (response.ok) {
              return response.text();
          } else {
              throw new Error('Error al actualizar datos');
          }
      })
      .then(data => {
          alert(data);
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Error al actualizar usuario');
      });

      document.getElementById('pass1').value = '';
      document.getElementById('pass2').value = '';
      document.getElementById('pass2').placeholder = '';
  } else {
      document.getElementById('pass2').value = '';
      document.getElementById('pass1').placeholder = 'Contraseña incorrecta';
      document.getElementById('pass2').placeholder = 'Contraseña incorrecta';
  }
}
