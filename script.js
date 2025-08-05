// Initialize localStorage with default user if not present
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginCard = document.getElementById('login-card');
const registerCard = document.getElementById('register-card');
const welcomeContainer = document.getElementById('welcome-container');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');
const welcomeMessage = document.getElementById('welcome-message');
const registerPasswordInput = document.getElementById('register-password');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text').querySelector('span');

// Event listeners
showRegister.addEventListener('click', showRegisterForm);
showLogin.addEventListener('click', showLoginForm);
logoutBtn.addEventListener('click', logout);
registerForm.addEventListener('submit', handleRegister);
loginForm.addEventListener('submit', handleLogin);
registerPasswordInput.addEventListener('input', handlePasswordStrength);

// Helper functions

function showRegisterForm(e) {
    e.preventDefault();
    loginCard.style.display = 'none';
    registerCard.style.display = 'block';
    resetMessages();
}

function showLoginForm(e) {
    e.preventDefault();
    registerCard.style.display = 'none';
    loginCard.style.display = 'block';
}

function logout() {
    welcomeContainer.style.display = 'none';
    loginCard.style.display = 'block';
    loginForm.reset();
    document.getElementById('login-success').style.display = 'none';
}

function handleRegister(e) {
    e.preventDefault();
    resetMessages();
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;

    let isValid = validateRegisterForm(name, email, password, confirmPassword);
    
    if (isValid) {
        const users = JSON.parse(localStorage.getItem('users'));
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));

        document.getElementById('register-success').style.display = 'block';
        registerForm.reset();

        setTimeout(() => {
            registerCard.style.display = 'none';
            loginCard.style.display = 'block';
            document.getElementById('login-success').style.display = 'block';
        }, 2000);
    }
}

function handleLogin(e) {
    e.preventDefault();
    resetMessages();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    let isValid = validateLoginForm(email, password);
    
    if (isValid) {
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            loginCard.style.display = 'none';
            welcomeContainer.style.display = 'block';
            welcomeMessage.textContent = `Welcome, ${user.name}!`;
            loginForm.reset();
        } else {
            document.getElementById('login-error').style.display = 'block';
        }
    }
}

function validateRegisterForm(name, email, password, confirmPassword) {
    let isValid = true;

    if (!name) {
        document.getElementById('register-name-error').style.display = 'block';
        isValid = false;
    }

    if (!validateEmail(email)) {
        document.getElementById('register-email-error').style.display = 'block';
        isValid = false;
    }

    if (password.length < 6) {
        document.getElementById('register-password-error').style.display = 'block';
        isValid = false;
    }

    if (password !== confirmPassword) {
        document.getElementById('register-confirm-error').style.display = 'block';
        isValid = false;
    }

    const users = JSON.parse(localStorage.getItem('users'));
    if (users.find(user => user.email === email)) {
        document.getElementById('register-error').style.display = 'block';
        isValid = false;
    }

    return isValid;
}

function validateLoginForm(email, password) {
    let isValid = true;

    if (!validateEmail(email)) {
        document.getElementById('login-email-error').style.display = 'block';
        isValid = false;
    }

    if (password.length < 6) {
        document.getElementById('login-password-error').style.display = 'block';
        isValid = false;
    }

    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function resetMessages() {
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
    document.getElementById('register-error').style.display = 'none';
    document.getElementById('login-error').style.display = 'none';
    document.getElementById('register-success').style.display = 'none';
    document.getElementById('login-success').style.display = 'none';
}

// Password strength meter functions
function handlePasswordStrength() {
    const password = registerPasswordInput.value;
    const strength = getPasswordStrength(password);

    updateStrengthMeter(strength);
}

function getPasswordStrength(password) {
    let strength = 0;

    if (password.length >= 6) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;

    if (password.length >= 12 && strength >= 4) {
        return "strong";
    } else if (strength >= 3) {
        return "medium";
    } else {
        return "weak";
    }
}

function updateStrengthMeter(strength) {
    let width = "0%";
    let color = "var(--danger)";
    let text = "Too weak";

    if (strength === "weak") {
        width = "33%";
        color = "var(--danger)";
        text = "Weak";
    } else if (strength === "medium") {
        width = "66%";
        color = "#ffc107"; // yellow
        text = "Medium";
    } else if (strength === "strong") {
        width = "100%";
        color = "var(--success)";
        text = "Strong";
    }

    strengthBar.style.setProperty('--strength-width', width);
    strengthBar.style.setProperty('--strength-color', color);
    strengthBar.innerHTML = `<div style="width:${width};height:100%;background-color:${color};border-radius:4px;"></div>`;
    strengthText.textContent = text;
}
