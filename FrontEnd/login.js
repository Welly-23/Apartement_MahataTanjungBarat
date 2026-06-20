function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {

        localStorage.setItem("adminLogin", "true");

        window.location.href = "admin.html";

    } else {

        alert("Username atau Password salah");

    }
}