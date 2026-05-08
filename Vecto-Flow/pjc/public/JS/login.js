/*
 * login.js — Lógica del formulario de inicio de sesión
 * Maneja: visibilidad de contraseña, mensajes de error
 * y autenticación contra la API con redirección por rol.
 */


// Alterna el campo de contraseña entre texto visible y oculto (••••••)
function togglePassword() {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
}


// Muestra un mensaje de error en el elemento #msg-error del DOM
function mostrarError(texto) {
    const el = document.getElementById('msg-error');
    el.innerText = texto;
    el.style.display = 'block';
}


// Función principal: valida el formulario, llama a la API y gestiona la respuesta
async function login() {
    const correo = document.getElementById('correo').value.trim(); // trim() elimina espacios accidentales
    const pass   = document.getElementById('password').value;

    // Limpia cualquier error visible de un intento anterior
    const msgEl = document.getElementById('msg-error');
    msgEl.style.display = 'none';

    // Validación mínima antes de llamar al servidor
    if (!correo || !pass) {
        mostrarError('Todos los campos son obligatorios.');
        return;
    }

    try {
        // Envía las credenciales al backend como JSON via POST
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ correo, contraseña: pass })
        });

        const data = await res.json();

        // Si el servidor responde con error (4xx/5xx), muestra el mensaje
        if (!res.ok) {
            mostrarError(data.error || 'Error al iniciar sesión.');
            return;
        }

        // Login exitoso: guarda el token JWT y los datos del usuario en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('sesion', JSON.stringify(data.usuario));

        // Redirige según el rol: 3 = Docente, cualquier otro = Estudiante
        if (data.usuario.rol === 3) {
            window.location.href = 'dashboard-docente.html';
        } else {
            window.location.href = 'dashboard-estudiante.html';
        }

    } catch (err) {
        // Error de red: servidor caído, sin conexión o problema de CORS
        mostrarError('No se pudo conectar con el servidor.');
    }
}