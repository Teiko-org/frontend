document.addEventListener("DOMContentLoaded", () => {
    const registerContainer = document.getElementById('register-container');
    const loginContainer = document.getElementById('login-container');
    const site = document.getElementById('site');
    
    document.body.addEventListener('click', handleButtonClick);

    document.getElementById("register-phone").addEventListener("input", formatPhoneNumber);
    document.getElementById("login-name").addEventListener("input", formatPhoneNumber);

    loadRememberedUser();

    function handleButtonClick(e) {
        const action = e.target.dataset.action;
        if (!action) return;

        switch (action) {
            case 'close':
                closeContainers();
                break;
            case 'toggle-form':
                toggleForm();
                break;
            case 'toggle-password':
                togglePassword(e.target);
                break;
            case 'register':
                registerUser();
                break;
            case 'login':
                loginUser();
                break;
        }
    }

    function loadRememberedUser() {
        const rememberedUser = localStorage.getItem("rememberedUser");
        if (rememberedUser) {
            document.getElementById("login-name").value = rememberedUser;
            document.getElementById("remember-me").checked = true;
        }
    }
});

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, ""); 
    if (!value.startsWith("55")) {
        value = "55" + value;
    }
    value = value.slice(0, 13);
    e.target.value = value.length >= 4 
        ? `+55 (${value.slice(2, 4)}) ${value.slice(4, 9)}-${value.slice(9)}`
        : `+55 (${value.slice(2)}`;
}

function closeContainers() {
    document.getElementById('register-container').classList.add("hidden");
    document.getElementById('login-container').classList.add("hidden");
    document.getElementById('site').classList.remove("hidden");
}

function toggleForm() {
    document.getElementById('register-container').classList.toggle("hidden");
    document.getElementById('login-container').classList.toggle("hidden");
}

function togglePassword(eyeIcon) {
    const passwordInput = eyeIcon.previousElementSibling;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}

function registerUser() {
    const name = document.getElementById("register-name").value.trim();
    const phone = document.getElementById("register-phone").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const confirmPassword = document.getElementById("register-confirm-password").value.trim();
    
    if (!validateRegistration(name, phone, password, confirmPassword)) return;
    
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(user => user.phone === phone)) {
        alert("Telefone já cadastrado");
        return;
    }
    
    users.push({ name, phone, password });
    localStorage.setItem("users", JSON.stringify(users));
    
    alert("Usuário registrado com sucesso");
    toggleForm();
}

function validateRegistration(name, phone, password, confirmPassword) {
    const phoneRegex = /^\+55 \(\d{2}\) \d{4,5}-\d{4}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    
    if (!name || !phone || !password || !confirmPassword) {
        alert("Preencha todos os campos");
        return false;
    }
    if (!phoneRegex.test(phone)) {
        alert("Telefone inválido");
        return false;
    }
    if (!passwordRegex.test(password)) {
        alert("A senha deve ter no mínimo 6 caracteres, incluir pelo menos uma letra maiúscula e um caractere especial.");
        return false;
    }
    if (password !== confirmPassword) {
        alert("As senhas não conferem");
        return false;
    }
    return true;
}

function loginUser() {
    const phone = document.getElementById("login-name").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const rememberMe = document.getElementById("remember-me").checked;
    
    if (!phone || !password) {
        alert("Preencha todos os campos");
        return;
    }
    
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.phone === phone && user.password === password);
    
    if (!user) {
        alert("Usuário ou senha inválidos");
        return;
    }
    
    if (rememberMe) {
        localStorage.setItem("rememberedUser", phone);
    } else {
        localStorage.removeItem("rememberedUser");
    }
    
    alert(`Bem-vindo, ${user.name}`);
    closeContainers();
}
