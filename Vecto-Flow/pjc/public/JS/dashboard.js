/*
 * ============================================================
 *  dashboard.js — Lógica del panel principal (Dashboard)
 * ============================================================
 *  Este archivo se encarga de dos responsabilidades clave:
 *
 *  1. Al cargar la página, lee la sesión activa del usuario
 *     desde localStorage y personaliza la interfaz con su
 *     nombre e inicial del avatar.
 *
 *  2. Provee la función de cierre de sesión (logout), que
 *     elimina la sesión y redirige al login.
 *
 *  Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-12
 * ============================================================
 */


/* ============================================================
 *  EVENTO: Carga inicial del DOM
 * ============================================================
 *  'DOMContentLoaded' se dispara cuando el navegador terminó
 *  de construir el árbol HTML, sin esperar imágenes ni CSS.
 *  Es el momento seguro más temprano para manipular elementos
 *  del DOM con JavaScript.
 *
 *  Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-12
 * ============================================================ */
window.addEventListener('DOMContentLoaded', () => {

     /* ── Lectura de la sesión desde localStorage ──────────────
     *  localStorage guarda datos como texto plano (strings).
     *  JSON.parse() convierte ese string de vuelta a un objeto
     *  JavaScript utilizable.
     *
     *  El operador || '{}' es un valor de seguridad: si la clave
     *  'sesion' no existe en localStorage (devuelve null),
     *  se parsea '{}' en su lugar → objeto vacío, evitando
     *  un error de ejecución en JSON.parse(null). */
    const sesion = JSON.parse(localStorage.getItem('sesion') || '{}');

    /* ── Guardia de sesión ────────────────────────────────────
     *  Si el objeto 'sesion' no tiene la propiedad 'usuario'
     *  (es decir, no hay sesión activa o está vacía), se
     *  detiene la ejecución inmediatamente con 'return'.
     *  Esto previene errores al intentar leer datos inexistentes
     *  y evita mostrar información vacía en la UI. */
    if (!sesion.usuario) return;


    /* ── Referencias a elementos del DOM ─────────────────────
     *  Se obtienen los tres elementos HTML que se personalizarán
     *  con los datos del usuario logueado.
     *
     *  getElementById devuelve null si el elemento no existe,
     *  por eso cada asignación posterior verifica con 'if'. */

    // Elemento que muestra el nombre del usuario en la barra de navegación (navbar)
    const nombreEl = document.getElementById('nombre-display');

    // Elemento que muestra el nombre en el mensaje de bienvenida del dashboard
    const bienvenidaEl = document.getElementById('bienvenida-nombre');

    // Elemento que muestra la inicial del nombre como avatar (ej: "J" para "Juan")
    const avatarEl = document.getElementById('avatar-inicial');


    /* ── Actualización de la interfaz con los datos del usuario ──
     *  Cada bloque 'if' verifica que el elemento exista antes
     *  de modificarlo, evitando errores si el HTML no tiene
     *  alguno de estos elementos en ciertas páginas. */

    // Muestra el nombre completo del usuario en la navbar
    if (nombreEl) nombreEl.innerText = sesion.usuario;

    // Muestra el nombre completo en el saludo de bienvenida
    if (bienvenidaEl) bienvenidaEl.innerText = sesion.usuario;

    // Muestra solo la primera letra del nombre, en mayúscula, como avatar.
    // charAt(0) obtiene el primer carácter del string.
    // toUpperCase() lo convierte a mayúscula (ej: "maria" → "M").
    if (avatarEl) avatarEl.innerText = sesion.usuario.charAt(0).toUpperCase();
});


/* ============================================================
 *  FUNCIÓN: logout()
 * ============================================================
 *  Cierra la sesión del usuario activo realizando dos acciones:
 *
 *  1. Elimina la clave 'sesion' de localStorage, borrando
 *     completamente los datos de sesión del navegador.
 *     Después de esto, si el usuario recarga cualquier página
 *     protegida, no encontrará sesión activa.
 *
 *  2. Redirige al navegador a 'login.html', forzando al
 *     usuario a autenticarse nuevamente si desea acceder.
 *
 *  Esta función es llamada típicamente desde un botón
 *  "Cerrar sesión" en la navbar del dashboard.
 *
 *  Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-12
 * ============================================================ */

function logout() {
    localStorage.removeItem('sesion');       // Elimina la sesión del almacenamiento local
    window.location.href = 'login.html';     // Redirige a la página de inicio de sesión
}