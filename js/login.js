import { login, currentUser } from "./auth.js";


const form = document.querySelector("#loginForm");
const email = document.querySelector("#loginemail");
const password = document.querySelector("#loginPassword");


form.addEventListener("submit", (e) => {
    e.preventDefault();
    login(email.value, password.value);
    let liveUser = currentUser();
    location.href = liveUser.role === "admin" ? "admin.html" : "dashboard.html";
})


