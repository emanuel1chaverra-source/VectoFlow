let contadorExtras = 0;

function generarCeldas(nombre, dim) {
    const n = parseInt(dim);
    const contenedor = document.getElementById(`celdas-${nombre}`);
    contenedor.innerHTML = '';

    if (!n || n < 1 || n > 10) {
        contenedor.innerHTML = '<span class="placeholder-celdas">Dimensión inválida (1–10)</span>';
        return;
    }

    for (let i = 0; i < n; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'celda-wrapper';

        const idx = document.createElement('span');
        idx.className = 'celda-indice';
        idx.innerText = `[${i}]`;

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'celda-valor';
        input.id = `vec-${nombre}-${i}`;
        input.placeholder = '0';
        input.step = 'any';
        input.addEventListener('input', () => {
            input.classList.remove('error');
            verificarDimensiones();
        });

        wrapper.appendChild(idx);
        wrapper.appendChild(input);
        contenedor.appendChild(wrapper);
    }

    verificarDimensiones();
}

function generarCeldasExtra(id, nombre, dim) {
    const n = parseInt(dim);
    const contenedor = document.getElementById(`celdas-${id}`);
    contenedor.innerHTML = '';

    if (!n || n < 1 || n > 10) {
        contenedor.innerHTML = '<span class="placeholder-celdas">Dimensión inválida (1–10)</span>';
        return;
    }

    for (let i = 0; i < n; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'celda-wrapper';

        const idx = document.createElement('span');
        idx.className = 'celda-indice';
        idx.innerText = `[${i}]`;

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'celda-valor';
        input.id = `vec-${id}-${i}`;
        input.placeholder = '0';
        input.step = 'any';
        input.addEventListener('input', verificarDimensiones);

        wrapper.appendChild(idx);
        wrapper.appendChild(input);
        contenedor.appendChild(wrapper);
    }

    verificarDimensiones();
}

function agregarVectorExtra() {
    contadorExtras++;
    const id = `extra-${contadorExtras}`;
    const nombres = ['C', 'D', 'E', 'F', 'G'];
    const nombre = nombres[contadorExtras - 1] || `V${contadorExtras + 2}`;

    const contenedor = document.getElementById('vectores-extra');
    const bloque = document.createElement('div');
    bloque.className = 'vector-bloque vec-extra';
    bloque.id = `bloque-${id}`;
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

function eliminarVectorExtra(id) {
    const bloque = document.getElementById(`bloque-${id}`);
    if (bloque) bloque.remove();
    verificarDimensiones();
}

function verificarDimensiones() {
    const dimA = parseInt(document.getElementById('dim-a')?.value);
    const dimB = parseInt(document.getElementById('dim-b')?.value);
    const alerta = document.getElementById('alerta-dim');
    const alertaTexto = document.getElementById('alerta-dim-texto');

    if (!dimA || !dimB) { alerta.classList.remove('visible'); return; }

    // Recopilar todas las dimensiones
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

    // Construir objeto de vectores
    const vectores = [
        { nombre: 'A', valores: valA, dim: dimA },
        { nombre: 'B', valores: valB, dim: dimB }
    ];

    // Extras
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

    // Guardar en localStorage y redirigir
    localStorage.setItem('vectores_activos', JSON.stringify(vectores));
    window.location.href = '../PAGE/Ejecutarsuma.html';
}