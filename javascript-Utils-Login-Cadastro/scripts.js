document.addEventListener("DOMContentLoaded", () => {
    const registerContainer = document.getElementById('register-container');
    const loginContainer = document.getElementById('login-container');
    const siteFoda = document.getElementById('sitefoda');

    document.body.addEventListener('click', (e) => {
        const action = e.target.dataset.action;

        if(!action) return;

        switch (action) {
            case 'close':
                closeContainers(registerContainer, loginContainer, siteFoda);
                break;
            case 'toggle-form':
                toggleForm(registerContainer, loginContainer);
                break;
            case 'toggle-password':
                togglePassword(e.target);
                break;
            case 'register':
                register(registerContainer, loginContainer);
                break;
            case 'login':
                loginUser(siteFoda);
                break;
        }
    });

    document.getElementById("register-phone").addEventListener("input", formatPhoneNumber);
    document.getElementById("login-name").addEventListener("input", formatPhoneNumber);
});

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, ""); 

    if (!value.startsWith("55")) {
        value = "55" + value;
    }

    value = value.slice(0, 13);

    if (value.length >= 4) {
        value = "+55 (" + value.slice(2, 4) + ") " + value.slice(4, 9) + "-" + value.slice(9);
    } else {
        value = "+55 (" + value.slice(2);
    }

    e.target.value = value;
}

function closeContainers(registerContainer, loginContainer, siteFoda) {
    registerContainer.classList.add("hidden");
    loginContainer.classList.add("hidden");

    siteFoda.classList.remove("hidden");
}

function toggleForm(registerContainer, loginContainer) {
    registerContainer.classList.toggle("hidden");
    loginContainer.classList.toggle("hidden");
}

function togglePassword(eyeIcon) {
    const passwordInput = eyeIcon.previousElementSibling;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}

function register(registerContainer, loginContainer) {
    const name = document.getElementById("register-name").value.trim();
    const phone = document.getElementById("register-phone").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const confirmPassword = document.getElementById("register-confirm-password").value.trim();

    const phoneRegex = /^\+55 \(\d{2}\) \d{4,5}-\d{4}$/;

    if(!name || !phone || !password || !confirmPassword) {
        alert("Preencha todos os campos");
        return;
    }

    if(!phoneRegex.test(phone)) {
        alert("Telefone inválido");
        return;
    }

    if(password.length < 6) {
        alert("A senha deve ter no mínimo 6 caracteres");
        return;
    }

    if(password !== confirmPassword) {
        alert("As senhas não conferem");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if(users.some(user => user.phone === phone)) {
        alert("Telefone já cadastrado");
        return;
    }

    users.push({ name, phone, password });
    localStorage.setItem("users", JSON.stringify(users));

    console.log("Usuário registrado com sucesso", { name, phone, password });
    alert("Usuário registrado com sucesso");

    toggleForm(registerContainer, loginContainer);
}

function loginUser(siteFoda) {
    const phone = document.getElementById("login-name").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if(!phone || !password) {
        alert("Preencha todos os campos");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(user => user.phone === phone && user.password === password);

    if(!user) {
        alert("Usuário ou senha inválidos");
        return;
    }

    console.log("Usuário logado com sucesso", { phone, password });
    alert(`Bem-vindo, ${user.name}`);

    closeContainers(document.getElementById('register-container'), document.getElementById('login-container'), siteFoda);
}