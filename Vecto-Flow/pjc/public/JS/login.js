function login() {

    let correo = document.getElementById("correo").value;
    let pass = document.getElementById("password").value;

    let data = localStorage.getItem("usuario");

    if (!data) {
        alert("No hay usuarios registrados");
        return;
    }

    let usuario = JSON.parse(data);

    if (correo === usuario.correo && pass === usuario.password) {
        alert("Bienvenido");
        window.location.href = "dashboard-estudiante.html";
    } else {
        alert("Correo o contraseña incorrectos");
    }
}

function togglePassword() {
    let input = document.getElementById("password");

    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}