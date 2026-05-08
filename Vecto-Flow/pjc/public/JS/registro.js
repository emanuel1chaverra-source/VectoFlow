/*
 * registro.js — Lógica del formulario de registro de usuarios
 * -------------------------------------------------------------
 * Maneja la selección de rol, visibilidad de contraseña,
 * mensajes de feedback y el envío del formulario a la API.
 */


/* ── seleccionarRol(rol, chip) ─────────────────────────────────
 * Gestiona la selección visual del rol (Estudiante / Docente).
 * Quita la clase 'activo' de todos los chips y se la aplica
 * al seleccionado. Luego guarda el valor del rol en el input
 * oculto #rol para que esté disponible al enviar el formulario. */
function seleccionarRol(rol, chip) {
    document.querySelectorAll('.rol-chip').forEach(c => c.classList.remove('activo'));
    chip.classList.add('activo');
    document.getElementById('rol').value = rol;
}


// Alterna el campo de contraseña entre texto visible y oculto (••••••)
function togglePassword() {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
}


/* ── mostrarMsg(tipo, texto) ───────────────────────────────────
 * Oculta ambos mensajes (error y éxito) y luego muestra
 * solo el que corresponde al tipo indicado ('error' o 'exito').
 * Centraliza el manejo de feedback visual del formulario. */
function mostrarMsg(tipo, texto) {
    const err = document.getElementById('msg-error');
    const ok  = document.getElementById('msg-exito');
    err.style.display = 'none';
    ok.style.display  = 'none';
    if (tipo === 'error') { err.innerText = texto; err.style.display = 'block'; }
    if (tipo === 'exito') { ok.innerText  = texto; ok.style.display  = 'block'; }
}


/* ── registrar() ───────────────────────────────────────────────
 * Función principal: valida los campos del formulario y envía
 * los datos al endpoint de registro de la API.
 *
 * Validaciones (en orden):
 *   1. Ningún campo puede estar vacío.
 *   2. La contraseña debe tener al menos 6 caracteres.
 *   3. Se debe seleccionar un rol.
 *
 * Si todo es válido, convierte el rol a su FK numérica
 * (docente → 3, estudiante → 2) y hace el POST al backend.
 * En caso de éxito, muestra un mensaje y redirige al login. */
async function registrar() {
    const nombre   = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const correo   = document.getElementById('correo').value.trim();
    const pass     = document.getElementById('password').value;
    const rol      = document.getElementById('rol').value;

    // Validación: campos obligatorios
    if (!nombre || !apellido || !correo || !pass) {
        mostrarMsg('error', 'Todos los campos son obligatorios.');
        return;
    }

    // Validación: longitud mínima de contraseña
    if (pass.length < 6) {
        mostrarMsg('error', 'La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    // Validación: rol seleccionado
    if (!rol) {
        mostrarMsg('error', 'Selecciona tu rol: Estudiante o Docente.');
        return;
    }

    // Convierte el rol string a su clave foránea numérica para la BD
    const fkRol = rol === 'docente' ? 3 : 2;

    try {
        // Envía los datos del nuevo usuario al backend
        const res = await fetch('http://localhost:3000/api/auth/registro', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ nombre, apellido, correo, contraseña: pass, fkRol })
        });

        const data = await res.json();

        // Si el servidor responde con error, muestra el mensaje recibido
        if (!res.ok) {
            mostrarMsg('error', data.error || 'Error al registrar.');
            return;
        }

        // Registro exitoso: avisa al usuario y redirige al login tras 1.2 segundos
        mostrarMsg('exito', '¡Cuenta creada! Redirigiendo al login...');
        setTimeout(() => { window.location.href = 'login.html'; }, 1200);

    } catch (err) {
        // Error de red: servidor caído o sin conexión
        mostrarMsg('error', 'No se pudo conectar con el servidor.');
    }
}