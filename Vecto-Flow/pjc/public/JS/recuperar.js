/*
 * recuperar.js — Recuperación de contraseña
 * ------------------------------------------
 * Busca en localStorage el usuario registrado y, si el nombre
 * ingresado coincide, muestra su contraseña en pantalla.
 * ⚠️ Nota: guardar contraseñas en texto plano en localStorage
 * no es seguro para entornos de producción.
 * Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-12
 */


/* ── recuperar() ───────────────────────────────────────────────
 * Lee el nombre de usuario del formulario y lo compara con el
 * usuario almacenado en localStorage. Muestra la contraseña si
 * coincide, o un mensaje de error si no existe o no se encontró.
 * Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-07 */
function recuperar() {

    let user    = document.getElementById("usuario").value; // Nombre ingresado por el usuario
    let data    = localStorage.getItem("usuario");          // Dato guardado en localStorage (string JSON)
    let mensaje = document.getElementById("mensaje");       // Elemento donde se muestra el resultado

    // Si no hay ningún usuario registrado en localStorage, informa y termina
    if (!data) {
        mensaje.innerText = "No hay usuarios registrados";
        mensaje.style.color = "red";
        return;
    }

    // Convierte el string JSON a objeto para poder leer sus propiedades
    let usuario = JSON.parse(data);

    // Compara el nombre ingresado con el usuario guardado
    if (user === usuario.usuario) {
        // Si coincide, muestra la contraseña en verde
        mensaje.innerText = "Tu contraseña es: " + usuario.password;
        mensaje.style.color = "green";
    } else {
        // Si no coincide, informa que el usuario no fue encontrado
        mensaje.innerText = "Usuario no encontrado";
        mensaje.style.color = "red";
    }
}