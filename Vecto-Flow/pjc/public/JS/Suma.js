/*
 * Suma.js — Lógica de la pantalla de ejecución de suma de vectores
 * -----------------------------------------------------------------
 * Carga los vectores guardados en localStorage, los previsualiza,
 * ejecuta la suma elemento a elemento, muestra el resultado con
 * una tabla comparativa y permite navegar a la vista paso a paso,
 * tabla completa o guardar la operación en el historial.
 * Trazabilidad: CU-03 | RF-009 | HU-008 | RNF-04
 */


// Clases CSS para colorear cada vector según su posición en la operación
const COLORES_CLASE = ['vec-a', 'vec-b', 'vec-extra', 'vec-extra', 'vec-extra'];

// Almacena el resultado de la última suma ejecutada (vectores, resultado, dim, fecha)
let resultadoActual = null;


// Al cargar el DOM, muestra la previsualización de los vectores activos
window.addEventListener('DOMContentLoaded', () => {
    cargarVectoresPreview();
});



/* ── cargarVectoresPreview() ───────────────────────────────────
 * Lee los vectores desde localStorage y los renderiza como cards
 * en el contenedor #vectores-preview, separados por el símbolo '+'.
 * Si no hay vectores guardados, muestra un aviso y deshabilita
 * el botón de ejecutar.
 * Trazabilidad: CU-01 | RF-001 | HU-001 | RNF-19 */
function cargarVectoresPreview() {
    const data       = localStorage.getItem('vectores_activos');
    const contenedor = document.getElementById('vectores-preview');

    if (!data) {
        contenedor.innerHTML = '<p style="color:var(--color-error); font-size:13px;">⚠️ No hay vectores guardados. <a href="ingresar-vectores.html">Ingresa vectores primero</a>.</p>';
        document.getElementById('btn-ejecutar').disabled = true;
        return;
    }

    const vectores = JSON.parse(data);
    contenedor.innerHTML = '';

    vectores.forEach((vec, idx) => {
        // Separador '+' entre vectores
        if (idx > 0) {
            const simbolo = document.createElement('div');
            simbolo.className = 'operacion-simbolo';
            simbolo.innerText = '+';
            contenedor.appendChild(simbolo);
        }

        // Card del vector con su nombre y celdas de valores
        const card = document.createElement('div');
        card.className = `vector-card ${idx === 0 ? 'vec-a' : idx === 1 ? 'vec-b' : 'vec-extra'}`;

        const titulo = document.createElement('div');
        titulo.className = 'vector-card-titulo';
        titulo.innerText = `Vector ${vec.nombre}`;

        const celdas = document.createElement('div');
        celdas.className = 'vector-celdas-display';

        // Cada celda muestra el índice [i] y el valor correspondiente
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


/* ── ejecutarSuma() ────────────────────────────────────────────
 * Calcula C[i] = A[i] + B[i] + ... + N[i] para cada posición.
 *
 * Primero valida que todos los vectores tengan la misma dimensión.
 * Luego calcula la suma, muestra las celdas del resultado, genera
 * una tabla comparativa HTML con todos los vectores y guarda el
 * resultado en localStorage para que paso-a-paso.js lo consuma.
 * Trazabilidad: CU-03 | RF-009 | HU-008 | RNF-04 */
function ejecutarSuma() {
    const data = localStorage.getItem('vectores_activos');
    if (!data) return;

    const vectores = JSON.parse(data);
    const alerta   = document.getElementById('alerta-error');
    alerta.classList.remove('visible');

    // Validar que todos los vectores tengan la misma cantidad de elementos
    const dim = vectores[0].dim;
    for (const v of vectores) {
        if (v.dim !== dim) {
            document.getElementById('alerta-texto').innerText =
                `Dimensiones incompatibles: Vector ${v.nombre} tiene ${v.dim} elementos pero Vector ${vectores[0].nombre} tiene ${dim}.`;
            alerta.classList.add('visible');
            return;
        }
    }

    // Calcular C[i] sumando el valor en la posición i de cada vector
    // toFixed(4) evita errores de precisión de punto flotante
    const resultado = [];
    for (let i = 0; i < dim; i++) {
        let suma = 0;
        vectores.forEach(v => { suma += v.valores[i]; });
        resultado.push(parseFloat(suma.toFixed(4)));
    }

    // Guardar el resultado completo para usarlo en otras vistas
    resultadoActual = { vectores, resultado, dim, fecha: new Date().toISOString() };

    // Renderizar las celdas del vector resultado C
    const celdas = document.getElementById('resultado-celdas');
    celdas.innerHTML = '';
    resultado.forEach((val, i) => {
        celdas.innerHTML += `
            <div class="celda-display">
                <span class="idx">[${i}]</span>
                <div class="val">${val}</div>
            </div>`;
    });

    // Construir tabla comparativa: una columna por vector + columna C
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

    // Persiste el resultado para que paso-a-paso.js y tabla-comparativa.js lo lean
    localStorage.setItem('resultado_suma', JSON.stringify(resultadoActual));

    // Muestra el bloque de resultado y hace scroll suave hacia él
    document.getElementById('resultado-bloque').classList.add('visible');
    document.getElementById('resultado-bloque').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// CU-04 | RF-018 | HU-018 — verPasoAPaso()
// Redirige a la vista animada paso a paso (requiere suma ejecutada
function verPasoAPaso() {
    if (!resultadoActual) { alert('Primero ejecuta la suma.'); return; }
    window.location.href = 'paso-a-paso.html';
}



// CU-17 | RF-013 | HU-011 — verTablaCompleta()
// Redirige a la tabla comparativa completa (requiere suma ejecutada)
function verTablaCompleta() {
    if (!resultadoActual) { alert('Primero ejecuta la suma.'); return; }
    window.location.href = 'tabla-comparativa.html';
}


/* ── guardarEnHistorial() ──────────────────────────────────────
 * Agrega el resultado actual al historial de sumas en localStorage.
 * Usa unshift() para que la operación más reciente quede primero.
 * El historial es un array de objetos resultadoActual.
 * Trazabilidad: CU-09 | RF-019 | HU-019 | RNF-15 */
async function guardarEnHistorial() {
    if (!resultadoActual) { alert('Primero ejecuta la suma.'); return; }

    // Guarda en localStorage como respaldo local
    const historial = JSON.parse(localStorage.getItem('historial_sumas') || '[]');
    historial.unshift(resultadoActual);
    localStorage.setItem('historial_sumas', JSON.stringify(historial));

    // Guarda en la base de datos
    const token = localStorage.getItem('token');
    if (!token) {
        alert('⚠️ No hay sesión activa. Solo se guardó localmente.');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/vectores/guardar-suma', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                vectores: resultadoActual.vectores,
                resultado: resultadoActual.resultado,
                dim: resultadoActual.dim
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.mensaje);
        } else {
            alert('⚠️ Se guardó localmente pero hubo un error en el servidor: ' + data.error);
        }
    } catch (err) {
        console.error(err);
        alert('⚠️ Sin conexión al servidor. Se guardó solo localmente.');
    }
}