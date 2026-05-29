// ============================================================
// detalle-vector.js — Lógica de la página detalle-vector.html
// Ubicación: public/JS/detalle-vector.js
// Trazabilidad: HU-019 | RF-019 | RNF-06
// Propósito: Carga el historial de operaciones y renderiza
//            el detalle atómico de cada vector involucrado.
// Roles: 1=Admin | 2=Estudiante | 3=Docente
// ============================================================

const API    = 'http://localhost:3000';
const sesion = JSON.parse(localStorage.getItem('sesion') || '{}');
const token  = localStorage.getItem('token') || '';
const rol    = sesion.rol;              // número: 1, 2 ó 3
const nombre = sesion.nombre || sesion.usuario || 'Usuario';

// ─────────────────────────────────────────────
// FUNCIÓN: logout
// Elimina la sesión del localStorage y redirige al login.
// Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-12
// ─────────────────────────────────────────────
function logout() {
    localStorage.removeItem('sesion');
    localStorage.removeItem('token');
    window.location.href = '../PAGE/login.html';
}

// ─────────────────────────────────────────────
// FUNCIÓN: hdrs
// Retorna los headers con el token JWT para las peticiones fetch.
// Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-12
// ─────────────────────────────────────────────
function hdrs() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    };
}

// ─────────────────────────────────────────────
// FUNCIÓN: renderNavbar
// Rellena navbar con nombre, avatar, rol y links de navegación
// según si el usuario es Estudiante (2) o Docente (3).
// Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-12
// ─────────────────────────────────────────────
function renderNavbar() {
    document.getElementById('nombre-display').innerText = nombre;
    document.getElementById('avatar-inicial').innerText = nombre.charAt(0).toUpperCase();

    const badge = document.getElementById('rol-badge');
    const nav   = document.getElementById('navMenu');

    if (rol === 2) {
        badge.className = 'rol-badge estudiante';
        badge.innerText = 'Estudiante';
        nav.innerHTML =
            '<a href="../PAGE/Ingresarvectores.html">➕ Nueva Suma</a>' +
            '<a href="../PAGE/historial.html">📋 Historial</a>' +
            '<a href="../PAGE/detalle-vector.html" class="activo">🔬 Detalle</a>' +
            '<a href="../PAGE/resumen-sesion.html">📊 Mis Métricas</a>';

    } else if (rol === 3) {
        badge.className = 'rol-badge docente';
        badge.innerText = 'Docente';
        nav.innerHTML =
            '<a href="../PAGE/Dashboard-docente.html">🏠 Inicio</a>' +
            '<a href="../PAGE/crear-ejercicio.html">📝 Crear Ejercicio</a>' +
            '<a href="../PAGE/monitoreo-estudiantes.html">👥 Monitoreo</a>' +
            '<a href="../PAGE/detalle-vector.html" class="activo">🔬 Detalle</a>';

        // Mostrar panel de filtro y cargar lista de estudiantes
        document.getElementById('filtroPanel').classList.remove('oculto');
        cargarEstudiantes();
    }
}

// ─────────────────────────────────────────────
// FUNCIÓN: cargarEstudiantes (solo Docente)
// Llama GET /api/auth/usuarios/estudiantes y puebla el <select>
// con los estudiantes disponibles para filtrar.
// Trazabilidad: CU-22 | RF-021 | HU-021 | RNF-08
// ─────────────────────────────────────────────    
async function cargarEstudiantes() {
    try {
        const res  = await fetch(API + '/api/auth/usuarios/estudiantes', { headers: hdrs() });
        const data = await res.json();
        const sel  = document.getElementById('selectEstudiante');
        sel.innerHTML = '<option value="">Selecciona un estudiante...</option>';
        data.forEach(e => {
            sel.innerHTML += `<option value="${e.PKUsuario}">${e.Nombre} ${e.Apellido}</option>`;
        });
    } catch (err) {
        console.error('Error cargando estudiantes:', err);
    }
}

// ─────────────────────────────────────────────
// FUNCIÓN: cargarHistorial
// - Estudiante (rol=2): GET /api/operaciones (sus propias operaciones)
// - Docente    (rol=3): GET /api/operaciones/estudiante/:id
// Renderiza las cards de suma en #contenido.
// Trazabilidad: CU-10 | RF-019 | HU-019 | RNF-06
// ─────────────────────────────────────────────
async function cargarHistorial() {
    const contenido = document.getElementById('contenido');
    contenido.innerHTML = '<div class="loading"><span>⏳</span>Cargando historial...</div>';

    let url = API + '/api/operaciones';

    if (rol === 3) {
        const id = document.getElementById('selectEstudiante').value;
        if (!id) {
            contenido.innerHTML = '<div class="empty"><span>👆</span>Selecciona un estudiante para ver su detalle.</div>';
            return;
        }
        url = API + '/api/operaciones/estudiante/' + id;
    }

    try {
        const res  = await fetch(url, { headers: hdrs() });
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            contenido.innerHTML = '<div class="empty"><span>📭</span>No hay sumas registradas aún.</div>';
            return;
        }

        let html = '';
        for (const op of data) {
            html += await buildSumaCard(op);
        }
        contenido.innerHTML = html;

    } catch (err) {
        contenido.innerHTML = `<div class="error-msg"><span>❌</span>Error al cargar los datos: ${err.message}</div>`;
    }
}
// ─────────────────────────────────────────────
// FUNCIÓN: getDetalle
// Llama GET /api/detalle-vector/:fkVector
// Retorna el arreglo de elementos atómicos del vector.
// Trazabilidad: CU-08 | RF-012 | HU-009 | RNF-06
// ─────────────────────────────────────────────
async function getDetalle(fkVector) {
    try {
        const res  = await fetch(API + '/api/detalle-vector/' + fkVector, { headers: hdrs() });
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

// ─────────────────────────────────────────────
// FUNCIÓN: buildSumaCard
// Construye el HTML de una card de operación con:
//   - Chips de los vectores (A, B, C opcional, Resultado)
//   - Tabla atómica índice por índice: A[i], B[i], C[i], Resultado[i]
// Trazabilidad: CU-17 | RF-013 | HU-011 | RNF-17
// ─────────────────────────────────────────────
async function buildSumaCard(op) {
    const fecha    = new Date(op.FechaOperacion).toLocaleString('es-CO');
    const detalleA = await getDetalle(op.FKVectorA);
    const detalleB = await getDetalle(op.FKVectorB);
    const detalleC = op.FKVectorC ? await getDetalle(op.FKVectorC) : [];
    const tieneC   = detalleC.length > 0;
    const maxLen   = Math.max(detalleA.length, detalleB.length);

    // ── Chips de vectores ──
    const chipsHtml = `
        <div class="vectores-grid">
            <div class="vector-chip">
                <div class="v-label">Vector A</div>
                <div class="v-nombre">${op.VectorA || 'Vector A'}</div>
            </div>
            <div class="vector-chip">
                <div class="v-label">Vector B</div>
                <div class="v-nombre">${op.VectorB || 'Vector B'}</div>
            </div>
            ${tieneC ? `<div class="vector-chip">
                <div class="v-label">Vector C</div>
                <div class="v-nombre">${op.VectorC || 'Vector C'}</div>
            </div>` : ''}
            <div class="vector-chip resultado">
                <div class="v-label">Resultado</div>
                <div class="v-nombre">R = A + B${tieneC ? ' + C' : ''}</div>
            </div>
        </div>`;

    // ── Filas de la tabla atómica índice por índice ──
    let filas = '';
    for (let i = 0; i < maxLen; i++) {
        const a     = detalleA[i] !== undefined ? detalleA[i].Valor : '—';
        const b     = detalleB[i] !== undefined ? detalleB[i].Valor : '—';
        const c     = tieneC ? (detalleC[i] !== undefined ? detalleC[i].Valor : '—') : null;
        const total = (detalleA[i] ? Number(detalleA[i].Valor) : 0)
                    + (detalleB[i] ? Number(detalleB[i].Valor) : 0)
                    + (tieneC && detalleC[i] ? Number(detalleC[i].Valor) : 0);

        filas += `<tr>
            <td><span class="chip-indice">${i}</span></td>
            <td class="valor-celda">${a}</td>
            <td class="valor-celda">${b}</td>
            ${tieneC ? `<td class="valor-celda">${c}</td>` : ''}
            <td><span class="total-celda">${total}</span></td>
        </tr>`;
    }

    return `
        <div class="suma-card">
            <div class="suma-header">
                <h3>📐 Operación #${op.PKOperacion}</h3>
                <span class="suma-meta">🕐 ${fecha}</span>
                ${op.Ejercicio ? `<span class="ejercicio-badge">📝 ${op.Ejercicio}</span>` : ''}
            </div>
            <div class="suma-body">
                ${chipsHtml}
                <div class="tabla-atomica-wrapper">
                    <table class="tabla-atomica">
                        <thead>
                            <tr>
                                <th>Índice [i]</th>
                                <th>A[i]</th>
                                <th>B[i]</th>
                                ${tieneC ? '<th>C[i]</th>' : ''}
                                <th>Resultado[i]</th>
                            </tr>
                        </thead>
                        <tbody>${filas}</tbody>
                    </table>
                </div>
            </div>
        </div>`;
}

// ─────────────────────────────────────────────
// INIT — Se ejecuta al cargar el DOM
// Verifica sesión, renderiza navbar y carga datos según rol.
// Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-12
// ─────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    // Si no hay sesión, redirigir al login
    if (!sesion || !rol) {
        window.location.href = '../PAGE/login.html';
        return;
    }

    renderNavbar();

    if (rol === 2) {
        // Estudiante: carga su propio historial automáticamente
        cargarHistorial();
    } else if (rol === 3) {
        // Docente: espera que seleccione un estudiante
        document.getElementById('contenido').innerHTML =
            '<div class="empty"><span>👆</span>Selecciona un estudiante y presiona "Ver Detalle".</div>';
    }
});