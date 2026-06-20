function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "Samesta" && password === "SamestaTB123") {

        localStorage.setItem("isLogin", "true");

        window.location.href = "admin.html";

    } else {

        alert("Username atau Password salah");

    }
}