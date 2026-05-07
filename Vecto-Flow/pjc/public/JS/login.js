function togglePassword() {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
}

function mostrarError(texto) {
    const el = document.getElementById('msg-error');
    el.innerText = texto;
    el.style.display = 'block';
}

async function login() {
    const correo = document.getElementById('correo').value.trim();
    const pass = document.getElementById('password').value;
    const msgEl = document.getElementById('msg-error');
    msgEl.style.display = 'none';

    if (!correo || !pass) {
        mostrarError('Todos los campos son obligatorios.');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contraseña: pass })
        });

        const data = await res.json();

        if (!res.ok) {
            mostrarError(data.error || 'Error al iniciar sesión.');
            return;
        }

        // Guardar token y sesión
        localStorage.setItem('token', data.token);
        localStorage.setItem('sesion', JSON.stringify(data.usuario));

        // Redirigir según rol
        if (data.usuario.rol === 3) {
            window.location.href = 'dashboard-docente.html';
        } else {
            window.location.href = 'dashboard-estudiante.html';
        }

    } catch (err) {
        mostrarError('No se pudo conectar con el servidor.');
    }
}