function togglePassword() {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
}

function mostrarError(texto) {
    const el = document.getElementById('msg-error');
    el.innerText = texto;
    el.style.display = 'block';
}

function login() {
    const correo = document.getElementById('correo').value.trim();
    const pass = document.getElementById('password').value;
    const msgEl = document.getElementById('msg-error');
    msgEl.style.display = 'none';

    const data = localStorage.getItem('usuario');
    if (!data) {
        mostrarError('No hay usuarios registrados. Crea una cuenta primero.');
        return;
    }

    const usuario = JSON.parse(data);

    if (correo === usuario.correo && pass === usuario.password) {
        // Guardar sesión activa
        localStorage.setItem('sesion', JSON.stringify({ usuario: usuario.usuario, rol: usuario.rol }));

        // Redirigir según rol
        if (usuario.rol === 'docente') {
            window.location.href = 'dashboard-docente.html';
        } else {
            // estudiante (o cualquier otro rol)
            window.location.href = 'dashboard-estudiante.html';
        }
    } else {
        mostrarError('Correo o contraseña incorrectos. Intenta de nuevo.');
    }
}