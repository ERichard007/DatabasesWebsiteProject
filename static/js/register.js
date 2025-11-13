const password = document.getElementById("password")
const show_password = document.getElementById("show_password")

show_password.addEventListener('click', () => {
    const hidden = password.type === "password"
    password.type = hidden ? "text" : "password"
})