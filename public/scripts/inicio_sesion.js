function login(user_name, pass) {
    const user = document.getElementById(user_name);
    const password = document.getElementById(pass);
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_name: user.value, pass: password.value })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = `/${data.perfil}/pagina_principal.html`;
        } else {
            // Usuario o contraseña incorrectos
            const wrongMessage = document.getElementById('wrong')
            wrongMessage.textContent = 'Cédula o contraseña incorrectas';
            console.log('Login fallido');
            // Aquí podrías mostrar un mensaje de error
        }
    })
    .catch(error => console.error('Error:', error));
}