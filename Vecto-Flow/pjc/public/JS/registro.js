function seleccionarRol(rol, chip) {
    // Quitar activo de todos
    document.querySelectorAll('.rol-chip').forEach(c => c.classList.remove('activo'));
    // Activar el seleccionado
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

function registrar() {
    const user = document.getElementById('usuario').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const pass = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;

    if (!user || !correo || !pass) {
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

    const usuario = { usuario: user, correo: correo, password: pass, rol: rol };
    localStorage.setItem('usuario', JSON.stringify(usuario));

    mostrarMsg('exito', '¡Cuenta creada! Redirigiendo al login...');
    setTimeout(() => { window.location.href = 'login.html'; }, 1200);
}