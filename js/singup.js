import { register } from "./auth.js";

const name = document.querySelector("#fullName");
const email = document.querySelector("#regEmail");
const password = document.querySelector("#password");
const confirmPassowrd = document.querySelector("#confirmPassword");
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    register(name.value,email.value,password.value,confirmPassowrd.value);
    location.href = "login.html";
})


