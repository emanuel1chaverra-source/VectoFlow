function registrar() {

    let user = document.getElementById("usuario").value;
    let correo = document.getElementById("correo").value;
    let pass = document.getElementById("password").value;

    if (user === "" || correo === "" || pass === "") {
        alert("Todos los campos son obligatorios");
        return;
    }

    // guardar en localStorage
    let usuario = {
        usuario: user,
        correo: correo,
        password: pass
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));

    alert("Usuario registrado correctamente");

    // redirigir al login
    window.location.href = "login.html";
}