document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
    const popupOverlay = document.getElementById('popup-overlay');
    const continueBtn = document.getElementById('continue-button');
    const balloonContainer = document.getElementById('balloon-container');

    // Define API_URL globally for consistency
    // IMPORTANT: Change this to your Render URL when deployed
    const API_URL = 'http://localhost:3000'; // Assuming your backend routes are /signup, /login directly at root

    if (!signupForm || !popupOverlay || !continueBtn || !balloonContainer) {
        console.error('Some essential HTML elements are missing!');
        return;
    }

    let balloonInterval;

    function startBalloons() {
        balloonInterval = setInterval(() => {
            const colors = ['red', 'pink', 'green', 'yellow', 'golden']; // Use actual balloon image names
            const color = colors[Math.floor(Math.random() * colors.length)];
            const balloon = document.createElement('img');
            balloon.src = `src/${color}.png`; // Ensure these paths are correct
            balloon.className = 'balloon-animation'; // Add a class for CSS animations
            balloon.style.left = Math.random() * 75 + '%'; // Adjust as needed
            balloonContainer.appendChild(balloon);
            balloon.addEventListener('animationend', () => balloon.remove());
        }, 250);
    }

    function stopBalloons() {
        clearInterval(balloonInterval);
        balloonContainer.innerHTML = ''; // Clear all balloons
    }

    signupForm.addEventListener('submit', async function (e) { // Added async keyword
        e.preventDefault();

        // Error divs
        const usernameError = document.getElementById('username-error');
        const emailError = document.getElementById('email-error');
        const passwordError = document.getElementById('password-error');
        const nameError = document.getElementById('name-error');

        // Clear previous errors
        usernameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        nameError.textContent = '';

        const username = document.getElementById('signup-username').value.trim();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;

        let hasError = false;

        // Client-side validations
        if (name === '') {
            nameError.textContent = 'Name is required.';
            hasError = true;
        }
        if (username === '') { // Adding username validation too
            usernameError.textContent = 'Username is required.';
            hasError = true;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            emailError.textContent = 'Please enter a valid email address.';
            hasError = true;
        }
        if (password.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters.';
            hasError = true;
        }

        if (hasError) return; // If any client-side error, stop here

        try {
            const response = await fetch(`${API_URL}/signup`, { // Use template literal for URL
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, name, email, password })
            });

            const data = await response.json();

            if (response.ok) { // Check for successful HTTP status (200-299)
                // Assuming backend sends token and username on success
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username); // Ensure backend sends username in response

                signupForm.reset(); // Clear form fields
                setTimeout(() => {
                    popupOverlay.style.display = 'flex'; // Show popup
                    startBalloons(); // Start balloons
                }, 500); // Small delay for visual effect
            } else {
                // Backend sent an error response (e.g., 400, 409)
                if (data.message) {
                    if (data.message.includes('Username already taken')) {
                        usernameError.textContent = data.message;
                    } else if (data.message.includes('Email already exists')) {
                        emailError.textContent = data.message;
                    } else if (data.message.includes('All fields required')) {
                        // This case should ideally be caught by client-side validation,
                        // but good to have as a fallback.
                        alert(data.message);
                    } else {
                        // Generic error message from backend
                        alert('Signup failed: ' + data.message);
                    }
                } else {
                    alert('An unknown error occurred during signup.');
                }
            }
        } catch (err) {
            console.error('Network or server error during signup:', err);
            alert('Could not connect to the server. Please try again later.');
        }
    });

    continueBtn.onclick = function() {
        stopBalloons();
        // Redirect to your main game page or dashboard after successful signup
        // If index.html is your login page, you might want to redirect to a game page here.
        // For now, keeping it as index.html, assuming it handles logged-in state.
        window.location.href = 'index.html';
    };

    // Error clear on input - Good practice, keep these
    document.getElementById('signup-username').addEventListener('input', function() {
        document.getElementById('username-error').textContent = '';
    });
    document.getElementById('signup-email').addEventListener('input', function() {
        document.getElementById('email-error').textContent = '';
    });
    document.getElementById('signup-password').addEventListener('input', function() {
        document.getElementById('password-error').textContent = '';
    });
    document.getElementById('signup-name').addEventListener('input', function() {
        document.getElementById('name-error').textContent = '';
    });
});