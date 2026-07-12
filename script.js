// =========================================
// Verum — main script
// Simple vanilla JS, no libraries.
// =========================================

// ---- Mobile menu toggle ----

import {currentUser} from "./js/auth.js";

let profileCard = document.querySelector(".profile-card");

const userProfileUi = () => {
    if(currentUser()) {
       document.querySelector(".toggle-user-active").innerHTML = `<i class="fa-solid fa-circle-user" id="user-icon"></i>`;
       profileCard.innerHTML = `
       <div class="profile-header">
      <i class="fa-solid fa-user"></i>
        <div class="profile-info">
            <h3>${currentUser().name}</h3>
            <p>${currentUser().email}</p>
        </div>
    </div>

    <div class="divider"></div>
    <ul class="menu">
        <li>
            <i class="fa-solid fa-table-cells-large"></i>
            <a href ="${currentUser().role === "admin" ? "./pages/admin.html" : "./pages/dashboard.html"}"><span>Dashboard</span></a>
        </li>
    </ul>

    <div class="divider"></div>

    <button class="logout-btn">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
        <span>Log out</span>
    </button>
       
       
       `
    }else{
      document.querySelector(".toggle-user-active").innerHTML = `
      <a href="./pages/login.html" class="btn btn-secondary btn-sm">Log in</a>
      <a href="./pages/register.html" class="btn btn-primary btn-sm">Register</a>
      `
    }
}



userProfileUi();





window.onclick = (e) => {
  let logoutBtn = e.target.closest(".logout-btn");
  let userIcon = document.querySelector("#user-icon");

  if(logoutBtn) {
      sessionStorage.removeItem("currentUser");
      userProfileUi();
  }

  if(userIcon){
    if(userIcon){
     document.body.classList.toggle("hide-scroll");
     document.querySelector(".profile-card").classList.toggle("active");
    }
  }
}




var navToggle = document.querySelector('.nav-toggle');
var navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });
}


// ---- Fade-in elements when they scroll into view ----
var revealItems = document.querySelectorAll('.reveal');

function checkReveal() {
  var windowHeight = window.innerHeight;
  for (var i = 0; i < revealItems.length; i++) {
    var item = revealItems[i];
    var top = item.getBoundingClientRect().top;
    if (top < windowHeight - 80) {
      item.classList.add('is-visible');
    }
  }
}

window.addEventListener('scroll', checkReveal);
window.addEventListener('load', checkReveal);

// ---- Animated counters (numbers that count up) ----
var counters = document.querySelectorAll('.stat-num');
var countersStarted = false;

function startCounters() {
  if (countersStarted) return;

  var statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;

  var sectionTop = statsSection.getBoundingClientRect().top;
  if (sectionTop > window.innerHeight) return;

  countersStarted = true;

  counters.forEach(function (counter) {
    var target = parseFloat(counter.getAttribute('data-target'));
    var decimals = counter.getAttribute('data-decimals') || 0;
    var duration = 1500;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var value = target * progress;
      counter.textContent = value.toFixed(decimals);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = target.toFixed(decimals);
      }
    }
    requestAnimationFrame(step);
  });
}

window.addEventListener('scroll', startCounters);
window.addEventListener('load', startCounters);

// ---- Show / hide password ----
var toggleButtons = document.querySelectorAll('.toggle-password');

toggleButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    var inputId = button.getAttribute('data-target');
    var input = document.getElementById(inputId);

    if (input.type === 'password') {
      input.type = 'text';
      button.querySelector('.eye-open').style.display = 'none';
      button.querySelector('.eye-closed').style.display = 'block';
    } else {
      input.type = 'password';
      button.querySelector('.eye-open').style.display = 'block';
      button.querySelector('.eye-closed').style.display = 'none';
    }
  });
});

// ---- Password strength check (register page) ----
var passwordInput = document.getElementById('password');
var strengthBars = document.querySelectorAll('.strength-bars i');
var strengthText = document.getElementById('strengthText');
var requirementItems = document.querySelectorAll('.requirement-list li');

if (passwordInput) {
  passwordInput.addEventListener('input', function () {
    var value = passwordInput.value;

    var hasLength = value.length >= 8;
    var hasUpper = /[A-Z]/.test(value);
    var hasNumber = /[0-9]/.test(value);
    var hasSymbol = /[^A-Za-z0-9]/.test(value);

    var score = 0;
    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;

    var colors = ['#e4e4e7', '#dc2626', '#f59e0b', '#4149ff', '#16a34a'];
    var labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

    strengthBars.forEach(function (bar, index) {
      bar.style.background = index < score ? colors[score] : '#e4e4e7';
    });

    if (strengthText) {
      strengthText.textContent = value.length ? labels[score] : '';
    }

    requirementItems.forEach(function (item) {
      var rule = item.getAttribute('data-rule');
      var passed = false;
      if (rule === 'length') passed = hasLength;
      if (rule === 'upper') passed = hasUpper;
      if (rule === 'number') passed = hasNumber;
      if (rule === 'symbol') passed = hasSymbol;
      item.classList.toggle('met', passed);
    });
  });
}

// ---- Confirm password matches (register page) ----
var confirmInput = document.getElementById('confirmPassword');
var confirmNote = document.getElementById('confirmNote');

function checkPasswordsMatch() {
  if (!confirmInput.value) {
    confirmNote.textContent = '';
    confirmNote.classList.remove('error');
    return;
  }
  if (confirmInput.value === passwordInput.value) {
    confirmNote.textContent = 'Passwords match';
    confirmNote.classList.remove('error');
  } else {
    confirmNote.textContent = 'Passwords do not match';
    confirmNote.classList.add('error');
  }
}

if (confirmInput && passwordInput) {
  confirmInput.addEventListener('input', checkPasswordsMatch);
  passwordInput.addEventListener('input', checkPasswordsMatch);
}

// ---- Stop demo forms from actually submitting ----
var demoForms = document.querySelectorAll('form[data-demo]');
demoForms.forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
  });
});


