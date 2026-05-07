let datos = null;
let pasoActual = -1;
let reproduciendo = false;
let intervalo = null;
let velocidad = 900;

const CLASES_VECTOR = ['a', 'b', 'extra', 'extra', 'extra'];

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

function construirFilaVectores() {
    const fila = document.getElementById('fila-vectores');
    fila.innerHTML = '';

    datos.vectores.forEach((vec, vIdx) => {
        if (vIdx > 0) {
            const sep = document.createElement('div');
            sep.style.cssText = 'font-size:24px; color:rgba(255,255,255,0.3); align-self:center; padding-bottom:10px;';
            sep.innerText = '+';
            fila.appendChild(sep);
        }

        const grupo = document.createElement('div');
        grupo.className = 'grupo-vector';

        const etiqueta = document.createElement('div');
        etiqueta.className = 'etiqueta-vector';
        etiqueta.style.color = vIdx === 0 ? '#a5b4fc' : vIdx === 1 ? '#67e8f9' : '#fcd34d';
        etiqueta.innerText = `Vector ${vec.nombre}`;

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

    // Separador =
    const igual = document.createElement('div');
    igual.style.cssText = 'font-size:24px; color:rgba(255,255,255,0.3); align-self:center; padding-bottom:10px;';
    igual.innerText = '=';
    fila.appendChild(igual);

    // Vector C
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

function irAPaso(idx) {
    if (!datos) return;
    if (idx < 0 || idx > datos.dim) return;

    // Limpiar resaltado
    limpiarResaltado();

    if (idx === datos.dim) {
        // Paso final - todo completado
        mostrarFinal();
        pasoActual = idx;
        actualizarUI();
        return;
    }

    pasoActual = idx;

    // Marcar celdas completadas
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

    // Resaltar celdas activas
    datos.vectores.forEach((_, vIdx) => {
        const c = document.getElementById(`celda-${vIdx}-${idx}`);
        const claseActiva = vIdx === 0 ? 'celda-activa-a' : vIdx === 1 ? 'celda-activa-b' : 'celda-activa-extra';
        if (c) { c.classList.remove('celda-completa'); c.classList.add(claseActiva); }
    });

    const cc = document.getElementById(`celda-c-${idx}`);
    if (cc) { cc.innerText = '?'; cc.classList.remove('celda-resuelta'); cc.classList.add('celda-activa-c'); }

    // Ecuación
    const opIndice = document.getElementById('op-indice');
    const opEcuacion = document.getElementById('op-ecuacion');

    opIndice.innerText = `POSICIÓN i = ${idx}`;

    let ecuacion = '';
    datos.vectores.forEach((vec, vIdx) => {
        const color = vIdx === 0 ? 'op-a' : vIdx === 1 ? 'op-b' : 'op-c';
        const nombre = vIdx === 0 ? 'A' : vIdx === 1 ? 'B' : vec.nombre;
        if (vIdx > 0) ecuacion += ' <span class="op-num"> + </span>';
        ecuacion += `<span class="${color}">${nombre}[${idx}]</span>`;
    });
    ecuacion += ` <span class="op-num"> = </span><span class="op-c">C[${idx}]</span>`;
    opEcuacion.innerHTML = ecuacion;

    // Animar C después de 300ms
    setTimeout(() => {
        const cEl = document.getElementById(`celda-c-${idx}`);
        if (cEl) cEl.innerText = datos.resultado[idx];
        // Ecuación resuelta
        let ecuacion2 = '';
        datos.vectores.forEach((vec, vIdx) => {
            const color = vIdx === 0 ? 'op-a' : vIdx === 1 ? 'op-b' : 'op-num';
            if (vIdx > 0) ecuacion2 += ' <span class="op-num"> + </span>';
            ecuacion2 += `<span class="${color}">${vec.valores[idx]}</span>`;
        });
        ecuacion2 += ` <span class="op-num"> = </span><span class="op-c" style="font-size:26px;">${datos.resultado[idx]}</span>`;
        opEcuacion.innerHTML = ecuacion2;
    }, 300);

    // Progreso
    const pct = ((idx + 1) / datos.dim) * 100;
    document.getElementById('barra-fill').style.width = pct + '%';
    document.getElementById('barra-label-izq').innerText = `Índice ${idx}`;
    document.getElementById('barra-label-der').innerText = `${idx + 1} / ${datos.dim}`;

    actualizarUI();
}

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

function mostrarFinal() {
    // Completar todo
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

function togglePlay() {
    if (reproduciendo) {
        pausar();
    } else {
        reproducir();
    }
}

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
            irAPaso(datos.dim);
            detenerReproduccion();
        } else {
            avanzarPaso();
        }
    }, velocidad);
}

function avanzarPaso() {
    const siguiente = pasoActual + 1;
    if (siguiente <= datos.dim - 1) irAPaso(siguiente);
}

function pausar() {
    detenerReproduccion();
    setEstado('pausado');
}

function detenerReproduccion() {
    reproduciendo = false;
    clearInterval(intervalo);
    intervalo = null;
    document.getElementById('btn-play').innerText = '▶';
}

function avanzar() {
    detenerReproduccion();
    const siguiente = pasoActual + 1;
    if (siguiente <= datos.dim) irAPaso(siguiente);
}

function retroceder() {
    detenerReproduccion();
    limpiarResaltado();
    // Reset celdas C
    for (let i = 0; i < datos.dim; i++) {
        const cc = document.getElementById(`celda-c-${i}`);
        if (cc) { cc.innerText = '?'; cc.classList.remove('celda-resuelta', 'celda-activa-c'); }
    }
    document.getElementById('mensaje-final').classList.remove('visible');
    const anterior = pasoActual - 1;
    if (anterior >= 0) {
        pasoActual = -1;
        irAPaso(anterior);
    } else {
        reiniciarAnimacion();
    }
}

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

function cambiarVelocidad() {
    velocidad = parseInt(document.getElementById('velocidad-select').value);
    if (reproduciendo) {
        detenerReproduccion();
        reproducir();
    }
}

function setEstado(estado) {
    const chip = document.getElementById('estado-chip');
    const textos = { espera: 'En espera', corriendo: 'Reproduciendo...', pausado: 'Pausado', completo: '¡Completado!' };
    chip.className = `estado-chip estado-${estado}`;
    chip.innerText = textos[estado] || estado;
}

function actualizarContador() {
    const el = document.getElementById('paso-contador');
    if (!datos) return;
    el.innerText = pasoActual >= 0 ? `${pasoActual + 1}/${datos.dim}` : `0/${datos.dim}`;
}

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