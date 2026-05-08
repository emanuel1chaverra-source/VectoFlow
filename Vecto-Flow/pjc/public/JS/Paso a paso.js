/*
 * Paso_a_paso.js — Visualización animada de la suma de vectores
 * ---------------------------------------------------------------
 * Carga el resultado de una suma (guardado en localStorage),
 * construye dinámicamente la fila de vectores en el DOM y permite
 * al usuario navegar por cada paso de la operación: celda a celda,
 * mostrando qué valores se suman y cuál es el resultado en C.
 * Soporta reproducción automática, pausa, avance, retroceso y
 * control de velocidad.
 */


// ── Estado global de la animación ──────────────────────────────
let datos        = null;   // Objeto con los vectores y resultados leídos de localStorage
let pasoActual   = -1;     // Índice del paso visible (-1 = sin iniciar)
let reproduciendo = false; // Indica si la reproducción automática está activa
let intervalo    = null;   // Referencia al setInterval de la reproducción
let velocidad    = 900;    // Milisegundos entre cada paso automático

// Clases CSS asignadas a cada vector según su posición (A, B, extras)
const CLASES_VECTOR = ['a', 'b', 'extra', 'extra', 'extra'];


/* ── Inicialización al cargar el DOM ───────────────────────────
 * Lee los datos de la suma desde localStorage.
 * Si no existen, muestra un aviso y detiene la ejecución.
 * Si existen, construye la interfaz y configura los valores iniciales. */
window.addEventListener('DOMContentLoaded', () => {
    const raw = localStorage.getItem('resultado_suma');
    if (!raw) {
        document.getElementById('escenario').innerHTML =
            `<p style="color:#f87171; font-family:'Space Mono',monospace; font-size:14px;">
            ⚠️ No hay suma ejecutada.<br>
            <a href="ejecutar-suma.html" style="color:#a5b4fc;">Vuelve y ejecuta la suma primero</a>.</p>`;
        return;
    }

    datos = JSON.parse(raw);
    construirFilaVectores();
    actualizarContador();
    document.getElementById('barra-label-der').innerText = `0 / ${datos.dim}`;
    document.getElementById('barra-label-izq').innerText = `Índice 0`;
});


/* ── construirFilaVectores() ───────────────────────────────────
 * Genera dinámicamente en el DOM todos los vectores de entrada
 * (A, B y extras) separados por signos '+', seguidos de '=' y
 * el vector resultado C con todas sus celdas en '?' (pendientes).
 * Cada celda recibe un ID único: celda-{vectorIdx}-{posición}
 * para poder manipularla individualmente durante la animación. */
function construirFilaVectores() {
    const fila = document.getElementById('fila-vectores');
    fila.innerHTML = '';

    datos.vectores.forEach((vec, vIdx) => {
        // Separador '+' entre vectores
        if (vIdx > 0) {
            const sep = document.createElement('div');
            sep.style.cssText = 'font-size:24px; color:rgba(255,255,255,0.3); align-self:center; padding-bottom:10px;';
            sep.innerText = '+';
            fila.appendChild(sep);
        }

        const grupo = document.createElement('div');
        grupo.className = 'grupo-vector';

        // Etiqueta del vector con color diferenciado por índice
        const etiqueta = document.createElement('div');
        etiqueta.className = 'etiqueta-vector';
        etiqueta.style.color = vIdx === 0 ? '#a5b4fc' : vIdx === 1 ? '#67e8f9' : '#fcd34d';
        etiqueta.innerText = `Vector ${vec.nombre}`;

        // Fila de celdas con los valores del vector
        const filaCeldas = document.createElement('div');
        filaCeldas.className = 'fila-celdas';
        filaCeldas.id = `fila-vec-${vIdx}`;

        const claseBase = vIdx === 0 ? 'celda-a' : vIdx === 1 ? 'celda-b' : 'celda-extra';
        vec.valores.forEach((val, i) => {
            const celda = document.createElement('div');
            celda.className = `celda-paso ${claseBase}`;
            celda.id = `celda-${vIdx}-${i}`;
            celda.innerText = val;
            filaCeldas.appendChild(celda);
        });

        grupo.appendChild(etiqueta);
        grupo.appendChild(filaCeldas);
        fila.appendChild(grupo);
    });

    // Separador '='
    const igual = document.createElement('div');
    igual.style.cssText = 'font-size:24px; color:rgba(255,255,255,0.3); align-self:center; padding-bottom:10px;';
    igual.innerText = '=';
    fila.appendChild(igual);

    // Vector C (resultado): celdas inicializadas en '?' hasta que se calculen
    const grupoC = document.createElement('div');
    grupoC.className = 'grupo-vector';

    const etiquetaC = document.createElement('div');
    etiquetaC.className = 'etiqueta-vector';
    etiquetaC.style.color = '#6ee7b7';
    etiquetaC.innerText = 'Vector C';

    const filaC = document.createElement('div');
    filaC.className = 'fila-celdas';
    filaC.id = 'fila-vec-c';

    datos.resultado.forEach((val, i) => {
        const celda = document.createElement('div');
        celda.className = 'celda-paso celda-c';
        celda.id = `celda-c-${i}`;
        celda.innerText = '?';
        filaC.appendChild(celda);
    });

    grupoC.appendChild(etiquetaC);
    grupoC.appendChild(filaC);
    fila.appendChild(grupoC);
}


/* ── irAPaso(idx) ──────────────────────────────────────────────
 * Navega directamente a un paso específico de la animación.
 * Limpia el estado visual previo, marca las celdas ya completadas,
 * resalta las celdas activas del paso actual, muestra la ecuación
 * correspondiente y actualiza la barra de progreso.
 * Tras 300ms anima el resultado en la celda C y muestra los valores. */
function irAPaso(idx) {
    if (!datos) return;
    if (idx < 0 || idx > datos.dim) return;

    limpiarResaltado();

    // Si se llegó al último paso, mostrar pantalla de completado
    if (idx === datos.dim) {
        mostrarFinal();
        pasoActual = idx;
        actualizarUI();
        return;
    }

    pasoActual = idx;

    // Marcar como completadas todas las celdas anteriores al paso actual
    for (let i = 0; i < idx; i++) {
        datos.vectores.forEach((_, vIdx) => {
            const c = document.getElementById(`celda-${vIdx}-${i}`);
            if (c) c.classList.add('celda-completa');
        });
        const cc = document.getElementById(`celda-c-${i}`);
        if (cc) {
            cc.innerText = datos.resultado[i];
            cc.classList.add('celda-resuelta');
        }
    }

    // Resaltar las celdas del paso actual en cada vector
    datos.vectores.forEach((_, vIdx) => {
        const c = document.getElementById(`celda-${vIdx}-${idx}`);
        const claseActiva = vIdx === 0 ? 'celda-activa-a' : vIdx === 1 ? 'celda-activa-b' : 'celda-activa-extra';
        if (c) { c.classList.remove('celda-completa'); c.classList.add(claseActiva); }
    });

    // Celda C del paso actual: mostrar '?' mientras se "calcula"
    const cc = document.getElementById(`celda-c-${idx}`);
    if (cc) { cc.innerText = '?'; cc.classList.remove('celda-resuelta'); cc.classList.add('celda-activa-c'); }

    // Mostrar la ecuación simbólica: A[i] + B[i] = C[i]
    const opIndice   = document.getElementById('op-indice');
    const opEcuacion = document.getElementById('op-ecuacion');

    opIndice.innerText = `POSICIÓN i = ${idx}`;

    let ecuacion = '';
    datos.vectores.forEach((vec, vIdx) => {
        const color  = vIdx === 0 ? 'op-a' : vIdx === 1 ? 'op-b' : 'op-c';
        const nombre = vIdx === 0 ? 'A' : vIdx === 1 ? 'B' : vec.nombre;
        if (vIdx > 0) ecuacion += ' <span class="op-num"> + </span>';
        ecuacion += `<span class="${color}">${nombre}[${idx}]</span>`;
    });
    ecuacion += ` <span class="op-num"> = </span><span class="op-c">C[${idx}]</span>`;
    opEcuacion.innerHTML = ecuacion;

    // Tras 300ms: revelar el resultado numérico en la celda C y en la ecuación
    setTimeout(() => {
        const cEl = document.getElementById(`celda-c-${idx}`);
        if (cEl) cEl.innerText = datos.resultado[idx];

        let ecuacion2 = '';
        datos.vectores.forEach((vec, vIdx) => {
            const color = vIdx === 0 ? 'op-a' : vIdx === 1 ? 'op-b' : 'op-num';
            if (vIdx > 0) ecuacion2 += ' <span class="op-num"> + </span>';
            ecuacion2 += `<span class="${color}">${vec.valores[idx]}</span>`;
        });
        ecuacion2 += ` <span class="op-num"> = </span><span class="op-c" style="font-size:26px;">${datos.resultado[idx]}</span>`;
        opEcuacion.innerHTML = ecuacion2;
    }, 300);

    // Actualizar barra de progreso
    const pct = ((idx + 1) / datos.dim) * 100;
    document.getElementById('barra-fill').style.width = pct + '%';
    document.getElementById('barra-label-izq').innerText = `Índice ${idx}`;
    document.getElementById('barra-label-der').innerText = `${idx + 1} / ${datos.dim}`;

    actualizarUI();
}


/* ── limpiarResaltado() ────────────────────────────────────────
 * Elimina todas las clases de resaltado activo y completado
 * de todas las celdas, dejando la fila en estado neutro.
 * Se llama antes de aplicar el estado visual de un nuevo paso. */
function limpiarResaltado() {
    if (!datos) return;
    for (let i = 0; i < datos.dim; i++) {
        datos.vectores.forEach((_, vIdx) => {
            const c = document.getElementById(`celda-${vIdx}-${i}`);
            if (c) {
                c.classList.remove('celda-activa-a', 'celda-activa-b', 'celda-activa-extra', 'celda-completa');
            }
        });
        const cc = document.getElementById(`celda-c-${i}`);
        if (cc) cc.classList.remove('celda-activa-c');
    }
}


/* ── mostrarFinal() ────────────────────────────────────────────
 * Marca todas las celdas como completadas, actualiza la ecuación
 * a "¡COMPLETADO!", llena la barra al 100% y muestra el mensaje
 * final. Detiene cualquier reproducción activa. */
function mostrarFinal() {
    for (let i = 0; i < datos.dim; i++) {
        datos.vectores.forEach((_, vIdx) => {
            const c = document.getElementById(`celda-${vIdx}-${i}`);
            if (c) { c.classList.remove('celda-completa'); c.classList.add('celda-completa'); }
        });
        const cc = document.getElementById(`celda-c-${i}`);
        if (cc) { cc.innerText = datos.resultado[i]; cc.classList.add('celda-resuelta'); }
    }

    document.getElementById('op-indice').innerText = '¡COMPLETADO!';
    document.getElementById('op-ecuacion').innerHTML = '<span class="op-c">Vector C calculado ✓</span>';
    document.getElementById('barra-fill').style.width = '100%';
    document.getElementById('barra-label-der').innerText = `${datos.dim} / ${datos.dim}`;
    document.getElementById('mensaje-final').classList.add('visible');

    setEstado('completo');
    detenerReproduccion();
}


/* ── togglePlay() ──────────────────────────────────────────────
 * Botón de play/pausa: si está reproduciendo lo pausa,
 * si está pausado o detenido inicia la reproducción. */
function togglePlay() {
    if (reproduciendo) {
        pausar();
    } else {
        reproducir();
    }
}


/* ── reproducir() ──────────────────────────────────────────────
 * Inicia la reproducción automática paso a paso.
 * Si ya llegó al final, reinicia la animación primero.
 * Avanza un paso inmediatamente y luego usa setInterval
 * para continuar según la velocidad configurada. */
function reproducir() {
    if (!datos) return;
    if (pasoActual >= datos.dim - 1 && pasoActual !== -1) {
        reiniciarAnimacion();
        return;
    }

    reproduciendo = true;
    document.getElementById('btn-play').innerText = '⏸';
    setEstado('corriendo');
    document.getElementById('mensaje-final').classList.remove('visible');

    avanzarPaso();
    intervalo = setInterval(() => {
        if (pasoActual >= datos.dim - 1) {
            irAPaso(datos.dim); // Ir al paso final (completado)
            detenerReproduccion();
        } else {
            avanzarPaso();
        }
    }, velocidad);
}


// Avanza al siguiente paso si no se llegó al final
function avanzarPaso() {
    const siguiente = pasoActual + 1;
    if (siguiente <= datos.dim - 1) irAPaso(siguiente);
}


// Pausa la reproducción y actualiza el estado visual
function pausar() {
    detenerReproduccion();
    setEstado('pausado');
}


/* ── detenerReproduccion() ─────────────────────────────────────
 * Limpia el intervalo activo, pone el flag a false
 * y restaura el ícono del botón a '▶'. */
function detenerReproduccion() {
    reproduciendo = false;
    clearInterval(intervalo);
    intervalo = null;
    document.getElementById('btn-play').innerText = '▶';
}


// Avanza un paso manualmente (detiene la reproducción si estaba activa)
function avanzar() {
    detenerReproduccion();
    const siguiente = pasoActual + 1;
    if (siguiente <= datos.dim) irAPaso(siguiente);
}


/* ── retroceder() ──────────────────────────────────────────────
 * Retrocede un paso: limpia el resaltado, resetea las celdas C
 * del paso actual y va al paso anterior.
 * Si ya está en el primer paso, reinicia la animación completa. */
function retroceder() {
    detenerReproduccion();
    limpiarResaltado();

    // Resetear todas las celdas C a '?' para reconstruir desde el paso anterior
    for (let i = 0; i < datos.dim; i++) {
        const cc = document.getElementById(`celda-c-${i}`);
        if (cc) { cc.innerText = '?'; cc.classList.remove('celda-resuelta', 'celda-activa-c'); }
    }

    document.getElementById('mensaje-final').classList.remove('visible');
    const anterior = pasoActual - 1;
    if (anterior >= 0) {
        pasoActual = -1; // Reset para que irAPaso reconstruya desde cero
        irAPaso(anterior);
    } else {
        reiniciarAnimacion();
    }
}


/* ── reiniciarAnimacion() ──────────────────────────────────────
 * Vuelve todo al estado inicial: limpia celdas, barra de progreso,
 * ecuación y estado del chip. Equivale a "volver al inicio". */
function reiniciarAnimacion() {
    detenerReproduccion();
    pasoActual = -1;
    limpiarResaltado();

    for (let i = 0; i < datos.dim; i++) {
        const cc = document.getElementById(`celda-c-${i}`);
        if (cc) { cc.innerText = '?'; cc.classList.remove('celda-resuelta', 'celda-activa-c'); }
        datos.vectores.forEach((_, vIdx) => {
            const c = document.getElementById(`celda-${vIdx}-${i}`);
            if (c) c.classList.remove('celda-completa');
        });
    }

    document.getElementById('op-indice').innerText = '—';
    document.getElementById('op-ecuacion').innerText = 'Presiona ▶ para comenzar';
    document.getElementById('barra-fill').style.width = '0%';
    document.getElementById('barra-label-izq').innerText = 'Índice 0';
    document.getElementById('barra-label-der').innerText = `0 / ${datos.dim}`;
    document.getElementById('mensaje-final').classList.remove('visible');

    setEstado('espera');
    actualizarUI();
}


/* ── cambiarVelocidad() ────────────────────────────────────────
 * Lee el valor del selector de velocidad y lo aplica.
 * Si hay una reproducción en curso, la reinicia con la nueva velocidad. */
function cambiarVelocidad() {
    velocidad = parseInt(document.getElementById('velocidad-select').value);
    if (reproduciendo) {
        detenerReproduccion();
        reproducir();
    }
}


/* ── setEstado(estado) ─────────────────────────────────────────
 * Actualiza el chip de estado visual con el texto y clase CSS
 * correspondiente al estado actual de la animación.
 * Estados posibles: 'espera', 'corriendo', 'pausado', 'completo'. */
function setEstado(estado) {
    const chip = document.getElementById('estado-chip');
    const textos = { espera: 'En espera', corriendo: 'Reproduciendo...', pausado: 'Pausado', completo: '¡Completado!' };
    chip.className = `estado-chip estado-${estado}`;
    chip.innerText = textos[estado] || estado;
}


// Actualiza el texto del contador de pasos (ej: "3/8")
function actualizarContador() {
    const el = document.getElementById('paso-contador');
    if (!datos) return;
    el.innerText = pasoActual >= 0 ? `${pasoActual + 1}/${datos.dim}` : `0/${datos.dim}`;
}


/* ── actualizarUI() ────────────────────────────────────────────
 * Sincroniza el estado de los botones de navegación:
 * deshabilita "retroceder" si se está en el inicio,
 * deshabilita "avanzar" si se llegó al final. */
function actualizarUI() {
    actualizarContador();
    const btnRet = document.getElementById('btn-retroceder');
    const btnAvz = document.getElementById('btn-avanzar');

    if (pasoActual <= 0) {
        btnRet.disabled = pasoActual < 0;
    } else {
        btnRet.disabled = false;
    }

    btnAvz.disabled = pasoActual >= datos.dim;
    btnRet.disabled = pasoActual <= -1;
}