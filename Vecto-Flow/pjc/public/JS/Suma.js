const COLORES_CLASE = ['vec-a', 'vec-b', 'vec-extra', 'vec-extra', 'vec-extra'];
let resultadoActual = null;

window.addEventListener('DOMContentLoaded', () => {
    cargarVectoresPreview();
});

function cargarVectoresPreview() {
    const data = localStorage.getItem('vectores_activos');
    const contenedor = document.getElementById('vectores-preview');

    if (!data) {
        contenedor.innerHTML = '<p style="color:var(--color-error); font-size:13px;">⚠️ No hay vectores guardados. <a href="ingresar-vectores.html">Ingresa vectores primero</a>.</p>';
        document.getElementById('btn-ejecutar').disabled = true;
        return;
    }

    const vectores = JSON.parse(data);
    contenedor.innerHTML = '';

    vectores.forEach((vec, idx) => {
        if (idx > 0) {
            const simbolo = document.createElement('div');
            simbolo.className = 'operacion-simbolo';
            simbolo.innerText = '+';
            contenedor.appendChild(simbolo);
        }

        const card = document.createElement('div');
        card.className = `vector-card ${idx === 0 ? 'vec-a' : idx === 1 ? 'vec-b' : 'vec-extra'}`;

        const titulo = document.createElement('div');
        titulo.className = 'vector-card-titulo';
        titulo.innerText = `Vector ${vec.nombre}`;

        const celdas = document.createElement('div');
        celdas.className = 'vector-celdas-display';

        vec.valores.forEach((val, i) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'celda-display';
            wrapper.innerHTML = `<span class="idx">[${i}]</span><div class="val">${val}</div>`;
            celdas.appendChild(wrapper);
        });

        card.appendChild(titulo);
        card.appendChild(celdas);
        contenedor.appendChild(card);
    });
}

function ejecutarSuma() {
    const data = localStorage.getItem('vectores_activos');
    if (!data) return;

    const vectores = JSON.parse(data);
    const alerta = document.getElementById('alerta-error');
    alerta.classList.remove('visible');

    // Validar dimensiones
    const dim = vectores[0].dim;
    for (const v of vectores) {
        if (v.dim !== dim) {
            document.getElementById('alerta-texto').innerText =
                `Dimensiones incompatibles: Vector ${v.nombre} tiene ${v.dim} elementos pero Vector ${vectores[0].nombre} tiene ${dim}.`;
            alerta.classList.add('visible');
            return;
        }
    }

    // Calcular C[i] = A[i] + B[i] + ... + N[i]
    const resultado = [];
    for (let i = 0; i < dim; i++) {
        let suma = 0;
        vectores.forEach(v => { suma += v.valores[i]; });
        resultado.push(parseFloat(suma.toFixed(4)));
    }

    resultadoActual = { vectores, resultado, dim, fecha: new Date().toISOString() };

    // Mostrar resultado
    const celdas = document.getElementById('resultado-celdas');
    celdas.innerHTML = '';
    resultado.forEach((val, i) => {
        celdas.innerHTML += `
            <div class="celda-display">
                <span class="idx">[${i}]</span>
                <div class="val">${val}</div>
            </div>`;
    });

    // Tabla comparativa rápida
    const tablaDiv = document.getElementById('tabla-resultado');
    let html = '<table><thead><tr><th class="col-idx">Índice</th>';
    vectores.forEach(v => {
        const cls = v.nombre === 'A' ? 'col-a' : v.nombre === 'B' ? 'col-b' : '';
        html += `<th class="${cls}">${v.nombre}[i]</th>`;
    });
    html += '<th class="col-c">C[i]</th></tr></thead><tbody>';

    for (let i = 0; i < dim; i++) {
        html += `<tr><td style="text-align:center; font-family:'Space Mono',monospace; font-weight:700; color:#475569;">${i}</td>`;
        vectores.forEach(v => {
            const cls = v.nombre === 'A' ? 'col-a' : v.nombre === 'B' ? 'col-b' : '';
            html += `<td class="${cls}" style="text-align:center;">${v.valores[i]}</td>`;
        });
        html += `<td class="col-c" style="text-align:center;">${resultado[i]}</td></tr>`;
    }
    html += '</tbody></table>';
    tablaDiv.innerHTML = html;

    // Guardar resultado en localStorage para paso a paso
    localStorage.setItem('resultado_suma', JSON.stringify(resultadoActual));

    document.getElementById('resultado-bloque').classList.add('visible');
    document.getElementById('resultado-bloque').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function verPasoAPaso() {
    if (!resultadoActual) { alert('Primero ejecuta la suma.'); return; }
    window.location.href = 'paso-a-paso.html';
}

function verTablaCompleta() {
    if (!resultadoActual) { alert('Primero ejecuta la suma.'); return; }
    window.location.href = 'tabla-comparativa.html';
}

function guardarEnHistorial() {
    if (!resultadoActual) { alert('Primero ejecuta la suma.'); return; }

    const historial = JSON.parse(localStorage.getItem('historial_sumas') || '[]');
    historial.unshift(resultadoActual);
    localStorage.setItem('historial_sumas', JSON.stringify(historial));

    alert('✅ Operación guardada en tu historial.');
}