// ============================================================
// admin.js — Lógica del panel de administración de usuarios
// Ubicación: public/admin.js
// Propósito: Consume la API de usuarios para listar, crear,
//            editar y activar/desactivar usuarios desde el
//            frontend. Protege la ruta verificando el rol.
// Trazabilidad: HU-024 | RF-024 | RNF-11 | RNF-12
// ============================================================

// URL base de la API de usuarios (rutas protegidas del backend)
// Coincide con el prefijo /api/auth + /usuarios definido en authRoutes.js
const API = 'http://localhost:3000/api/auth/usuarios';


// ─────────────────────────────────────────────
// FUNCIÓN: getToken
// Propósito: Recupera el token JWT almacenado en localStorage
//            por login.js al momento de autenticarse.
//            Se incluye en cada petición protegida como header.
// ─────────────────────────────────────────────
function getToken() {
    return localStorage.getItem('token');
}


// ─────────────────────────────────────────────
// FUNCIÓN: cargarUsuarios
// Propósito: Hace GET /api/auth/usuarios para obtener todos los
//            usuarios y renderiza las filas en la tabla HTML.
// Trazabilidad: HU-024 | RF-024
// ─────────────────────────────────────────────
async function cargarUsuarios() {
    try {
        // Petición GET protegida — envía el token JWT en el header
        const res = await fetch(API, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        // Si el servidor rechaza por permisos, redirige al login
        if (res.status === 401 || res.status === 403) {
            alert('Sesión expirada o sin permisos. Inicia sesión nuevamente.');
            window.location.href = 'login.html';
            return;
        }

        const usuarios = await res.json();
        const tbody = document.getElementById('tabla-usuarios');
        tbody.innerHTML = '';

        // Si no hay usuarios registrados, muestra mensaje informativo
        if (usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">No hay usuarios registrados.</td></tr>';
            return;
        }

        // Itera cada usuario y construye una fila HTML dinámica
        usuarios.forEach(u => {
            // Badge de estado según el valor de la columna Estado (1=activo, 0=inactivo)
            const estadoBadge = u.Estado === 1
                ? '<span class="badge activo">Activo</span>'
                : '<span class="badge inactivo">Inactivo</span>';

            // Botón dinámico: si está activo muestra Desactivar, si no muestra Activar
            const btnEstado = u.Estado === 1
                ? `<button class="btn-accion desactivar" onclick="toggleEstado(${u.PKUsuario})">🔴 Desactivar</button>`
                : `<button class="btn-accion activar" onclick="toggleEstado(${u.PKUsuario})">🟢 Activar</button>`;

            tbody.innerHTML += `
                <tr id="fila-${u.PKUsuario}">
                    <td>${u.PKUsuario}</td>
                    <td>${u.Nombre} ${u.Apellido}</td>
                    <td>${u.Correo}</td>
                    <td>${u.NombreRol}</td>
                    <td>${new Date(u.FechaRegistro).toLocaleDateString('es-CO')}</td>
                    <td>${estadoBadge}</td>
                    <td>
                        <button class="btn-accion editar"
                            onclick="abrirModal(${u.PKUsuario}, '${u.Nombre}', '${u.Apellido}', '${u.Correo}', ${u.FKRol})">
                            ✏️ Editar
                        </button>
                        ${btnEstado}
                    </td>
                </tr>`;
        });

    } catch (err) {
        // Error de red o servidor caído
        document.getElementById('tabla-usuarios').innerHTML =
            '<tr><td colspan="7" style="text-align:center;color:red;">❌ Error al conectar con el servidor</td></tr>';
    }
}


// ─────────────────────────────────────────────
// FUNCIÓN: abrirModalCrear
// Propósito: Limpia y muestra el modal de creación de usuario.
// Trazabilidad: CU-24 | RF-024 | HU-024
// ─────────────────────────────────────────────
function abrirModalCrear() {
    // Limpia todos los campos del formulario antes de abrir
    document.getElementById('crear-nombre').value   = '';
    document.getElementById('crear-apellido').value = '';
    document.getElementById('crear-correo').value   = '';
    document.getElementById('crear-password').value = '';
    document.getElementById('crear-rol').value      = '2'; // Estudiante por defecto
    document.getElementById('msg-crear').innerText  = '';

    document.getElementById('modal-crear').style.display = 'flex';
}
// CU-24 | RF-024 | HU-024 — cerrarModalCrear()
// Cierra el modal de creación sin guardar cambios
function cerrarModalCrear() {
    document.getElementById('modal-crear').style.display = 'none';
}


// ─────────────────────────────────────────────
// FUNCIÓN: crearUsuario
// Propósito: Hace POST /api/auth/registro para crear un nuevo
//            usuario desde el panel de administración.
// Trazabilidad: CU-24 | RF-024 | HU-024
// ─────────────────────────────────────────────
async function crearUsuario() {
    // Extrae los valores del formulario del modal
    const nombre     = document.getElementById('crear-nombre').value.trim();
    const apellido   = document.getElementById('crear-apellido').value.trim();
    const correo     = document.getElementById('crear-correo').value.trim();
    const contraseña = document.getElementById('crear-password').value.trim();
    const fkRol      = parseInt(document.getElementById('crear-rol').value);
    const msgEl      = document.getElementById('msg-crear');

    // Validación básica en el frontend antes de hacer la petición
    if (!nombre || !apellido || !correo || !contraseña) {
        msgEl.style.color = 'red';
        msgEl.innerText = '⚠️ Todos los campos son obligatorios.';
        return;
    }

    try {
        // POST público al endpoint de registro
        // El admin crea usuarios directamente desde el panel
        const res = await fetch('http://localhost:3000/api/auth/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ nombre, apellido, correo, contraseña, fkRol })
        });

        const data = await res.json();

        // Si la API retorna error (correo duplicado, etc.), lo muestra en el modal
        if (!res.ok) {
            msgEl.style.color = 'red';
            msgEl.innerText = data.error || '❌ Error al crear usuario.';
            return;
        }

        // Éxito: muestra mensaje, cierra el modal y recarga la tabla
        msgEl.style.color = 'green';
        msgEl.innerText = '✅ Usuario creado exitosamente.';
        setTimeout(() => { cerrarModalCrear(); cargarUsuarios(); }, 1000);

    } catch (err) {
        msgEl.style.color = 'red';
        msgEl.innerText = '❌ Error de conexión con el servidor.';
    }
}


// ─────────────────────────────────────────────
// FUNCIÓN: abrirModal (editar)
// Propósito: Precarga los datos del usuario seleccionado
//            en el formulario del modal de edición.
// Trazabilidad: CU-24 | RF-024 | HU-024
// ─────────────────────────────────────────────
function abrirModal(id, nombre, apellido, correo, fkRol) {
    // Inyecta los datos actuales del usuario en los inputs del modal
    document.getElementById('edit-id').value       = id;
    document.getElementById('edit-nombre').value   = nombre;
    document.getElementById('edit-apellido').value = apellido;
    document.getElementById('edit-correo').value   = correo;
    document.getElementById('edit-rol').value      = fkRol;
    document.getElementById('msg-modal').innerText = '';

    document.getElementById('modal-editar').style.display = 'flex';
}

// CU-24 | RF-024 | HU-024 — cerrarModal()
// Cierra el modal de edición sin guardar cambios
function cerrarModal() {
    document.getElementById('modal-editar').style.display = 'none';
    document.getElementById('msg-modal').innerText = '';
}


// ─────────────────────────────────────────────
// FUNCIÓN: guardarEdicion
// Propósito: Hace PUT /api/auth/usuarios/:id para actualizar
//            los datos del usuario seleccionado.
// Trazabilidad: CU-24 | RF-024 | HU-024
// ─────────────────────────────────────────────
async function guardarEdicion() {
    // Extrae el ID oculto y los campos editables del modal
    const id       = document.getElementById('edit-id').value;
    const nombre   = document.getElementById('edit-nombre').value.trim();
    const apellido = document.getElementById('edit-apellido').value.trim();
    const correo   = document.getElementById('edit-correo').value.trim();
    const fkRol    = parseInt(document.getElementById('edit-rol').value);
    const msgEl    = document.getElementById('msg-modal');

    // Validación básica antes de enviar la petición
    if (!nombre || !apellido || !correo) {
        msgEl.style.color = 'red';
        msgEl.innerText = '⚠️ Todos los campos son obligatorios.';
        return;
    }

    try {
        // Petición PUT protegida con el token JWT
        const res = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ nombre, apellido, correo, fkRol })
        });

        const data = await res.json();

        if (!res.ok) {
            msgEl.style.color = 'red';
            msgEl.innerText = data.error || '❌ Error al actualizar.';
            return;
        }

        // Éxito: muestra mensaje, cierra modal y recarga la tabla
        msgEl.style.color = 'green';
        msgEl.innerText = '✅ Usuario actualizado correctamente.';
        setTimeout(() => { cerrarModal(); cargarUsuarios(); }, 1000);

    } catch (err) {
        msgEl.style.color = 'red';
        msgEl.innerText = '❌ Error de conexión con el servidor.';
    }
}


// ─────────────────────────────────────────────
// FUNCIÓN: toggleEstado
// Propósito: Hace DELETE /api/auth/usuarios/:id para alternar
//            el Estado del usuario entre activo (1) e inactivo (0).
//            Es un soft delete — no elimina el registro de la BD.
// Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-11
// ─────────────────────────────────────────────
async function toggleEstado(id) {
    // Confirma la acción con el administrador antes de ejecutar
    if (!confirm('¿Confirmas cambiar el estado de este usuario?')) return;

    try {
        // Petición DELETE protegida — el backend alterna el Estado
        const res = await fetch(`${API}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || '❌ Error al cambiar estado.');
            return;
        }

        // Muestra el mensaje retornado por el backend y recarga la tabla
        alert(`✅ ${data.mensaje}`);
        cargarUsuarios();

    } catch (err) {
        alert('❌ Error de conexión con el servidor.');
    }
}


// ─────────────────────────────────────────────
// FUNCIÓN: logout
// Propósito: Elimina los datos de sesión del localStorage
//            y redirige al usuario a la página de login.
// Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-12
// ────────────────────────────────────────────
function logout() {
    // Elimina el token JWT y los datos de sesión del almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('sesion');

    // Redirige al login
    window.location.href = 'login.html';
}

// ─────────────────────────────────────────────
// INICIALIZACIÓN — Se ejecuta cuando el DOM está listo
// Propósito: Protege la ruta verificando que el usuario
//            tenga sesión activa y sea Administrador (rol = 1).
//            Si no cumple, redirige al login.
// Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-12
// ─────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    // Recupera los datos de sesión guardados por login.js
    const sesion = JSON.parse(localStorage.getItem('sesion') || 'null');

    // Si no hay sesión o el rol no es Administrador (FKRol = 1), bloquea el acceso
    if (!sesion || sesion.rol !== 1) {
        alert('⛔ Acceso denegado. Solo administradores.');
        window.location.href = 'login.html';
        return;
    }

    // Muestra el nombre del admin en la navbar
    document.getElementById('nombre-display').innerText = sesion.nombre || 'Admin';

    // Genera el avatar con la primera letra del nombre
    document.getElementById('avatar-inicial').innerText =
        (sesion.nombre || 'A')[0].toUpperCase();

    // Carga la tabla de usuarios al entrar al panel
    cargarUsuarios();
});