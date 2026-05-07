// Cargar datos de sesión al iniciar
window.addEventListener('DOMContentLoaded', () => {
    const sesion = JSON.parse(localStorage.getItem('sesion') || '{}');
    if (!sesion.usuario) return;

    // Actualizar nombre en navbar
    const nombreEl = document.getElementById('nombre-display');
    const bienvenidaEl = document.getElementById('bienvenida-nombre');
    const avatarEl = document.getElementById('avatar-inicial');

    if (nombreEl) nombreEl.innerText = sesion.usuario;
    if (bienvenidaEl) bienvenidaEl.innerText = sesion.usuario;
    if (avatarEl) avatarEl.innerText = sesion.usuario.charAt(0).toUpperCase();
});

function logout() {
    localStorage.removeItem('sesion');
    window.location.href = 'login.html';
}