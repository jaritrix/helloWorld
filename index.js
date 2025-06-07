document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const usernameErrorDiv = document.getElementById('login-error');
    const passwordErrorDiv = document.getElementById('password-error');

    // Error clear on input
    usernameInput.addEventListener('input', function () {
        usernameErrorDiv.textContent = '';
    });
    passwordInput.addEventListener('input', function () {
        passwordErrorDiv.textContent = '';
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        usernameErrorDiv.textContent = '';
        passwordErrorDiv.textContent = '';

        const usernameOrEmail = usernameInput.value.trim();
        const password = passwordInput.value;

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernameOrEmail, password })
        })
        .then(res => res.json())
        .then(data => {
            // Clear previous errors
            usernameErrorDiv.textContent = '';
            passwordErrorDiv.textContent = '';

            if (data.message === 'Login successful') {
                window.location.href = "data-page.html";
            } 
            if (data.usernameError) {
                usernameErrorDiv.textContent = data.usernameError;
                usernameErrorDiv.style.color = "red";
            }
            if (data.passwordError) {
                passwordErrorDiv.textContent = data.passwordError;
                passwordErrorDiv.style.color = "red";
            }
            // fallback for any other error
            if (!data.usernameError && !data.passwordError && data.message && data.message !== 'Login successful') {
                usernameErrorDiv.textContent = data.message;
                usernameErrorDiv.style.color = "red";
            }
        })
        .catch(err => {
            usernameErrorDiv.textContent = "Server error: " + err.message;
            usernameErrorDiv.style.color = "red";
        });
    });
});