document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('login-email'); // This ID is used for email/username
    const passwordInput = document.getElementById('login-password');
    const usernameErrorDiv = document.getElementById('login-error'); // Error div for username/email
    const passwordErrorDiv = document.getElementById('password-error'); // Error div for password

    // Define API_URL globally
    // IMPORTANT: Replace with your Render URL when deployed
    const API_URL = 'https://helloworld-yu4p.onrender.com'; // Your Render backend base URL

    // Clear error messages on input
    usernameInput.addEventListener('input', function () {
        usernameErrorDiv.textContent = '';
        passwordErrorDiv.textContent = ''; // Clear password error too on username change
    });
    passwordInput.addEventListener('input', function () {
        passwordErrorDiv.textContent = '';
        usernameErrorDiv.textContent = ''; // Clear username error too on password change
    });

    loginForm.addEventListener('submit', async function (e) { // Added async keyword
        e.preventDefault();

        // Clear previous errors before new submission
        usernameErrorDiv.textContent = '';
        passwordErrorDiv.textContent = '';

        const usernameOrEmail = usernameInput.value.trim();
        const password = passwordInput.value;

        // Client-side validation (Optional but good practice)
        if (!usernameOrEmail) {
            usernameErrorDiv.textContent = 'Email or Username is required.';
            usernameErrorDiv.style.color = "red";
            return;
        }
        if (!password) {
            passwordErrorDiv.textContent = 'Password is required.';
            passwordErrorDiv.style.color = "red";
            return;
        }

        try {
            const response = await fetch(`${API_URL}/login`, { // Use template literal for URL
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrEmail, password })
            });

            const data = await response.json();

            if (response.ok) { // Check for successful HTTP status (200-299)
                // Login successful. Store token and username.
                localStorage.setItem('token', data.token);     // Make sure your backend sends 'token'
                localStorage.setItem('username', data.username); // Make sure your backend sends 'username'

                loginForm.reset(); // Clear form fields
                window.location.href = "data-page.html"; // Redirect to your game/dashboard page
            } else {
                // Login failed. Handle error messages from backend.
                // Your backend sends: { message: 'Invalid Credentials.' }
                if (data.message) {
                    usernameErrorDiv.textContent = data.message; // Display general error message
                    usernameErrorDiv.style.color = "red";
                    // Or, if you want to show it on password error div:
                    // passwordErrorDiv.textContent = data.message;
                    // passwordErrorDiv.style.color = "red";
                } else {
                    // Fallback for unexpected error response
                    usernameErrorDiv.textContent = "An unknown error occurred during login.";
                    usernameErrorDiv.style.color = "red";
                }
            }
        } catch (err) {
            console.error('Network or server error during login:', err);
            usernameErrorDiv.textContent = "Could not connect to the server. Please try again later.";
            usernameErrorDiv.style.color = "red";
        }
    });
});