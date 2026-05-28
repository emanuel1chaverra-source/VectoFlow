// ============================================================
// gestionar-sesiones.js — Lógica del panel de sesiones (Docente)
// Ubicación: public/JS/gestionar-sesiones.js
// Trazabilidad: HU-018 | RF-018 | HU-019 | RF-019 | HU-020 | RF-020 | RNF-06
// ============================================================

const API = 'http://localhost:3000';
let todasLasSesiones = [];
let token = '';

// ── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    token = localStorage.getItem('token');
    if (!token) { window.location.href = '../PAGE/login.html'; return; }
    cargarSesiones();
    cargarEstudiantes();
});

// ── READ — Cargar todas las sesiones ────────────────────────
// HU-018 | RF-018
async function cargarSesiones() {
    try {
        const res = await fetch(`${API}/api/sesiones`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        todasLasSesiones = await res.json();
        renderTabla(todasLasSesiones);
        actualizarStats(todasLasSesiones);
    } catch {
        document.getElementById('tablaSesiones').innerHTML =
            `<tr><td colspan="8" class="empty"><span>⚠️</span>Error al cargar sesiones.</td></tr>`;
    }
}

// ── Cargar estudiantes para el select del modal ──────────────
async function cargarEstudiantes() {
    try {
        const res = await fetch(`${API}/api/auth/usuarios/estudiantes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        const select = document.getElementById('selectEstudiante');
        select.innerHTML =
            '<option value="">— Selecciona un estudiante —</option>' +
            data.map(e => `<option value="${e.PKUsuario}">${e.Nombre || '—'} ${e.Apellido || ''}</option>`).join('');
    } catch {
        document.getElementById('selectEstudiante').innerHTML =
            '<option value="">Error al cargar estudiantes</option>';
    }
}

// ── CREATE — Crear nueva sesión ──────────────────────────────
// HU-019 | RF-019
async function crearSesion() {
    const FKUsuario   = document.getElementById('selectEstudiante').value;
    const IPAcceso    = document.getElementById('inputIP').value.trim();
    const Dispositivo = document.getElementById('inputDispositivo').value.trim();
    const msg         = document.getElementById('msgModal');

    if (!FKUsuario) {
        msg.textContent = '⚠️ Selecciona un estudiante.';
        return;
    }

    try {
        const res = await fetch(`${API}/api/sesiones`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ FKUsuario, IPAcceso, Dispositivo })
        });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error);
        cerrarModal();
        cargarSesiones();
    } catch (err) {
        msg.textContent = '❌ ' + (err.message || 'Error al crear sesión.');
    }
}

// ── UPDATE — Cerrar sesión manualmente ───────────────────────
// HU-020 | RF-020
async function cerrarSesionManual(id) {
    if (!confirm('¿Cerrar esta sesión?')) return;
    try {
        const res = await fetch(`${API}/api/sesiones/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error);
        cargarSesiones();
    } catch {
        alert('Error al cerrar la sesión.');
    }
}

// ── RENDER TABLA ─────────────────────────────────────────────
function renderTabla(sesiones) {
    const tbody = document.getElementById('tablaSesiones');
    if (sesiones.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty"><span>🕐</span>No hay sesiones registradas.</td></tr>`;
        return;
    }
    tbody.innerHTML = sesiones.map((s, i) => {
        const inicio = new Date(s.FechaInicio);
        const fin    = s.FechaFin ? new Date(s.FechaFin) : null;
        const activa = s.Estado == 1;
        return `
            <tr>
                <td><strong>${i + 1}</strong></td>
                <td>${s.Nombre || '—'} ${s.Apellido1 || ''}</td>
                <td>${formatFecha(inicio)}</td>
                <td>${fin ? formatFecha(fin) : '<em style="color:#94a3b8">En curso</em>'}</td>
                <td><code style="font-size:12px;background:#f1f5f9;padding:2px 6px;border-radius:4px">${s.IPAcceso || '—'}</code></td>
                <td>${s.Dispositivo || '—'}</td>
                <td><span class="badge ${activa ? 'badge-activa' : 'badge-cerrada'}">${activa ? '🟢 Activa' : '🔒 Cerrada'}</span></td>
                <td>
                    ${activa
                        ? `<button class="btn-accion btn-cerrar" onclick="cerrarSesionManual(${s.PKSesion})">🔒 Cerrar</button>`
                        : '<em style="color:#94a3b8;font-size:12px">Cerrada</em>'
                    }
                </td>
            </tr>`;
    }).join('');
}

// ── STATS ────────────────────────────────────────────────────
function actualizarStats(sesiones) {
    document.getElementById('totalSesiones').textContent    = sesiones.length;
    document.getElementById('sesionesActivas').textContent  = sesiones.filter(s => s.Estado == 1).length;
    document.getElementById('sesionesCerradas').textContent = sesiones.filter(s => s.Estado == 0).length;
}

// ── FILTRAR ──────────────────────────────────────────────────
function filtrar() {
    const estado = document.getElementById('filtroEstado').value;
    const filtradas = estado === ''
        ? todasLasSesiones
        : todasLasSesiones.filter(s => String(s.Estado) === estado);
    renderTabla(filtradas);
}

// ── MODAL ────────────────────────────────────────────────────
function abrirModal() {
    document.getElementById('msgModal').textContent   = '';
    document.getElementById('selectEstudiante').value = '';
    document.getElementById('inputIP').value          = '';
    document.getElementById('inputDispositivo').value = '';
    document.getElementById('modalOverlay').classList.add('activo');
}

function cerrarModal() {
    document.getElementById('modalOverlay').classList.remove('activo');
}

// ── HELPER FECHA ─────────────────────────────────────────────
function formatFecha(f) {
    return f.toLocaleString('es-CO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}