function seleccionarRol(rol, chip) {
    document.querySelectorAll('.rol-chip').forEach(c => c.classList.remove('activo'));
    chip.classList.add('activo');
    document.getElementById('rol').value = rol;
}

function togglePassword() {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
}

function mostrarMsg(tipo, texto) {
    const err = document.getElementById('msg-error');
    const ok = document.getElementById('msg-exito');
    err.style.display = 'none';
    ok.style.display = 'none';
    if (tipo === 'error') { err.innerText = texto; err.style.display = 'block'; }
    if (tipo === 'exito') { ok.innerText = texto; ok.style.display = 'block'; }
}

async function registrar() {
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const pass = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;

    if (!nombre || !apellido || !correo || !pass) {
        mostrarMsg('error', 'Todos los campos son obligatorios.');
        return;
    }
    if (pass.length < 6) {
        mostrarMsg('error', 'La contraseña debe tener al menos 6 caracteres.');
        return;
    }
    if (!rol) {
        mostrarMsg('error', 'Selecciona tu rol: Estudiante o Docente.');
        return;
    }

    const fkRol = rol === 'docente' ? 3 : 2;

    try {
        const res = await fetch('http://localhost:3000/api/auth/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, apellido, correo, contraseña: pass, fkRol })
        });

        const data = await res.json();

        if (!res.ok) {
            mostrarMsg('error', data.error || 'Error al registrar.');
            return;
        }

        mostrarMsg('exito', '¡Cuenta creada! Redirigiendo al login...');
        setTimeout(() => { window.location.href = 'login.html'; }, 1200);

    } catch (err) {
        mostrarMsg('error', 'No se pudo conectar con el servidor.');
    }
}