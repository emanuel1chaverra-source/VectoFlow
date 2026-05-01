function recuperar() {

    let user = document.getElementById("usuario").value;
    let data = localStorage.getItem("usuario");
    let mensaje = document.getElementById("mensaje");

    if (!data) {
        mensaje.innerText = "No hay usuarios registrados";
        mensaje.style.color = "red";
        return;
    }

    let usuario = JSON.parse(data);

    if (user === usuario.usuario) {
        mensaje.innerText = "Tu contraseña es: " + usuario.password;
        mensaje.style.color = "green";
    } else {
        mensaje.innerText = "Usuario no encontrado";
        mensaje.style.color = "red";
    }
}