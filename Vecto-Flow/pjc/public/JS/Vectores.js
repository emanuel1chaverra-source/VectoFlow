/*
 * Vectores.js — Ingreso y validación de vectores
 * ------------------------------------------------
 * Permite al usuario definir los vectores A, B y opcionalmente
 * vectores extra (C, D, E...), ingresando su dimensión y valores
 * celda por celda. Valida que todos tengan la misma dimensión
 * antes de guardarlos en localStorage y continuar a la suma.
 * Trazabilidad: CU-01 | RF-001 | HU-001 | RNF-05
 */


// Contador de vectores extra agregados dinámicamente (C, D, E...)
let contadorExtras = 0;


/* ── generarCeldas(nombre, dim) ────────────────────────────────
 * Genera los inputs numéricos del vector A o B según la dimensión
 * ingresada. Cada celda muestra su índice [i] y un input asociado.
 * Si la dimensión es inválida (fuera de 1–10), muestra un aviso.
 * Cada input llama a verificarDimensiones() al cambiar su valor.
 * Trazabilidad: CU-01 | RF-001 | HU-001 | RNF-02 */
function generarCeldas(nombre, dim) {
    const n = parseInt(dim);
    const contenedor = document.getElementById(`celdas-${nombre}`);
    contenedor.innerHTML = '';

    if (!n || n < 1 || n > 5) {
        contenedor.innerHTML = '<span class="placeholder-celdas">Dimensión inválida (1–5)</span>';
        return;
    }

    for (let i = 0; i < n; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'celda-wrapper';

        const idx = document.createElement('span');
        idx.className = 'celda-indice';
        idx.innerText = `[${i}]`;

        const input = document.createElement('input');
        input.type        = 'number';
        input.className   = 'celda-valor';
        input.id          = `vec-${nombre}-${i}`;
        input.placeholder = '0';
        input.step        = 'any'; // Permite decimales
        input.addEventListener('input', () => {
            input.classList.remove('error'); // Limpia error visual al corregir el valor
            verificarDimensiones();
        });

        wrapper.appendChild(idx);
        wrapper.appendChild(input);
        contenedor.appendChild(wrapper);
    }

    verificarDimensiones();
}


/* ── generarCeldasExtra(id, nombre, dim) ───────────────────────
 * Igual que generarCeldas() pero para vectores extra (C, D...).
 * Usa el id único del bloque extra en lugar del nombre del vector.
 * Trazabilidad: CU-07 | RF-007 | HU-010 | RNF-05 */
function generarCeldasExtra(id, nombre, dim) {
    const n = parseInt(dim);
    const contenedor = document.getElementById(`celdas-${id}`);
    contenedor.innerHTML = '';

    if (!n || n < 1 || n > 5) {
        contenedor.innerHTML = '<span class="placeholder-celdas">Dimensión inválida (1–5)</span>';
        return;
    }

    for (let i = 0; i < n; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'celda-wrapper';

        const idx = document.createElement('span');
        idx.className = 'celda-indice';
        idx.innerText = `[${i}]`;

        const input = document.createElement('input');
        input.type        = 'number';
        input.className   = 'celda-valor';
        input.id          = `vec-${id}-${i}`;
        input.placeholder = '0';
        input.step        = 'any';
        input.addEventListener('input', verificarDimensiones);

        wrapper.appendChild(idx);
        wrapper.appendChild(input);
        contenedor.appendChild(wrapper);
    }

    verificarDimensiones();
}


/* ── agregarVectorExtra() ──────────────────────────────────────
 * Crea dinámicamente un nuevo bloque de vector extra en el DOM.
 * Los nombres siguen la secuencia C, D, E, F, G.
 * Cada bloque incluye su propio input de dimensión, celdas
 * y un botón para eliminarlo.
 * Trazabilidad: CU-07 | RF-007 | HU-010 | RNF-05 */
function agregarVectorExtra() {
    contadorExtras++;
    const id     = `extra-${contadorExtras}`;
    const nombres = ['C', 'D', 'E', 'F', 'G'];
    const nombre  = nombres[contadorExtras - 1] || `V${contadorExtras + 2}`;

    const contenedor = document.getElementById('vectores-extra');
    const bloque     = document.createElement('div');
    bloque.className = 'vector-bloque vec-extra';
    bloque.id        = `bloque-${id}`;
    bloque.innerHTML = `
        <div class="vector-header">
            <span class="vector-label">Vector ${nombre}</span>
            <button class="btn btn-peligro" style="padding:6px 12px; font-size:12px;" onclick="eliminarVectorExtra('${id}')">✕ Eliminar</button>
        </div>
        <div class="dim-row">
            <label>Dimensión:</label>
            <input type="number" class="input-field" id="dim-${id}" min="1" max="10" placeholder="ej. 4" oninput="generarCeldasExtra('${id}', '${nombre}', this.value)">
            <span style="font-size:12px; color:var(--color-texto-suave);">elementos (máx. 10)</span>
        </div>
        <div class="celdas-vector" id="celdas-${id}">
            <span class="placeholder-celdas">Ingresa la dimensión para ver las celdas del vector ${nombre}</span>
        </div>
    `;
    contenedor.appendChild(bloque);
}


// CU-12 | RF-006 | HU-004 | RNF-11 — eliminarVectorExtra()
// Elimina el bloque de un vector extra del DOM y re-verifica dimensiones
function eliminarVectorExtra(id) {
    const bloque = document.getElementById(`bloque-${id}`);
    if (bloque) bloque.remove();
    verificarDimensiones();
}

/* ── verificarDimensiones() ────────────────────────────────────
 * Compara las dimensiones de todos los vectores activos (A, B y extras).
 * Si no coinciden, muestra una alerta con los valores detectados.
 * Se ejecuta cada vez que el usuario cambia una dimensión o un valor.
 * Trazabilidad: CU-01 | RF-017 | HU-001 | RNF-05 */
function verificarDimensiones() {
    const dimA = parseInt(document.getElementById('dim-a')?.value);
    const dimB = parseInt(document.getElementById('dim-b')?.value);
    const alerta      = document.getElementById('alerta-dim');
    const alertaTexto = document.getElementById('alerta-dim-texto');

    // Si falta alguna dimensión principal, ocultar alerta y salir
    if (!dimA || !dimB) { alerta.classList.remove('visible'); return; }

    // Recopilar todas las dimensiones incluyendo los extras
    const dims = [dimA, dimB];
    const extras = document.querySelectorAll('[id^="dim-extra-"]');
    extras.forEach(e => { const v = parseInt(e.value); if (v) dims.push(v); });

    const todasIguales = dims.every(d => d === dims[0]);

    if (!todasIguales) {
        alertaTexto.innerText = `Las dimensiones no coinciden: ${dims.join(', ')}. Todos los vectores deben tener el mismo tamaño.`;
        alerta.classList.add('visible');
    } else {
        alerta.classList.remove('visible');
    }
}


/* ── obtenerValoresVector(id, dim) ─────────────────────────────
 * Recorre los inputs de un vector y devuelve sus valores como
 * array de números. Si algún campo está vacío o no es numérico,
 * le aplica la clase 'error' visualmente y retorna null.
 * Trazabilidad: CU-01 | RF-001 | HU-001 | RNF-05 */
function obtenerValoresVector(id, dim) {
    const valores = [];
    for (let i = 0; i < dim; i++) {
        const input = document.getElementById(`vec-${id}-${i}`);
        if (!input) return null;
        const val = parseFloat(input.value);
        if (isNaN(val)) { input.classList.add('error'); return null; }
        valores.push(val);
    }
    return valores;
}


/* ── reiniciarTodo() ───────────────────────────────────────────
 * Pide confirmación y limpia todos los vectores del formulario:
 * dimensiones, celdas y bloques extra. El historial de sumas
 * en localStorage no se ve afectado.
 * Trazabilidad: CU-12 | RF-006 | HU-004 | RNF-11 */
function reiniciarTodo() {
    if (!confirm('¿Seguro que quieres reiniciar todos los vectores? El historial no se borrará.')) return;

    document.getElementById('dim-a').value = '';
    document.getElementById('dim-b').value = '';
    document.getElementById('celdas-a').innerHTML = '<span class="placeholder-celdas">Ingresa la dimensión para ver las celdas del vector A</span>';
    document.getElementById('celdas-b').innerHTML = '<span class="placeholder-celdas">Ingresa la dimensión para ver las celdas del vector B</span>';
    document.getElementById('vectores-extra').innerHTML = '';
    document.getElementById('alerta-dim').classList.remove('visible');
    contadorExtras = 0;
}


/* ── guardarYContinuar() ───────────────────────────────────────
 * Valida que A y B tengan dimensión ingresada y que coincidan.
 * Luego recoge los valores de todos los vectores (A, B y extras),
 * verifica que los extras también tengan la misma dimensión,
 * guarda el array de vectores en localStorage y redirige a la
 * pantalla de ejecución de la suma.
 * Trazabilidad: CU-01 | RF-001 | HU-001 | RNF-06 */
function guardarYContinuar() {
    const dimA = parseInt(document.getElementById('dim-a').value);
    const dimB = parseInt(document.getElementById('dim-b').value);

    if (!dimA || !dimB) {
        alert('Debes ingresar la dimensión de los vectores A y B.');
        return;
    }

    if (dimA !== dimB) {
        document.getElementById('alerta-dim').classList.add('visible');
        alert('Los vectores A y B deben tener la misma dimensión.');
        return;
    }

    const valA = obtenerValoresVector('a', dimA);
    const valB = obtenerValoresVector('b', dimB);

    if (!valA || !valB) {
        alert('Completa todos los valores numéricos de los vectores antes de continuar.');
        return;
    }

    // Construir el array de vectores con A y B como base
    const vectores = [
        { nombre: 'A', valores: valA, dim: dimA },
        { nombre: 'B', valores: valB, dim: dimB }
    ];

    // Agregar vectores extra si existen, validando su dimensión
    let i = 1;
    while (document.getElementById(`bloque-extra-${i}`)) {
        const dimExtra = parseInt(document.getElementById(`dim-extra-${i}`)?.value);
        if (dimExtra !== dimA) {
            alert(`El vector extra tiene dimensión diferente (${dimExtra} vs ${dimA}).`);
            return;
        }
        const valExtra = obtenerValoresVector(`extra-${i}`, dimExtra);
        if (!valExtra) { alert('Completa todos los valores del vector extra.'); return; }
        const nombres = ['C', 'D', 'E', 'F'];
        vectores.push({ nombre: nombres[i - 1] || `V${i + 2}`, valores: valExtra, dim: dimExtra });
        i++;
    }

    // Guardar vectores y redirigir a la pantalla de suma
    localStorage.setItem('vectores_activos', JSON.stringify(vectores));
    window.location.href = '../PAGE/Ejecutarsuma.html';
}