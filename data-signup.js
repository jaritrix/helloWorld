document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
    const popupOverlay = document.getElementById('popup-overlay');
    const continueBtn = document.getElementById('continue-button');
    const balloonContainer = document.getElementById('balloon-container');

    if (!signupForm || !popupOverlay || !continueBtn || !balloonContainer) {
        console.error('Some elements are missing in HTML!');
        return;
    }

    let balloonInterval;

    function startBalloons() {
        balloonInterval = setInterval(() => {
            const colors = ['red', 'pink', 'green', 'yellow', 'golden'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const balloon = document.createElement('img');
            balloon.src = `src/${color}.png`;
            balloon.style.left = Math.random() * 75 + '%';
            balloonContainer.appendChild(balloon);
            balloon.addEventListener('animationend', () => balloon.remove());
        }, 250);
    }

    function stopBalloons() {
        clearInterval(balloonInterval);
        balloonContainer.innerHTML = '';
    }

    signupForm.addEventListener('submit', function (e) {
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

        // Basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            emailError.textContent = 'Please enter a valid email address.';
            hasError = true;
        }

        // Password length check
        if (password.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters.';
            hasError = true;
        }

        // Get users from localStorage or empty array
        let users = JSON.parse(localStorage.getItem('users') || '[]');

        // Username exists check
        const usernameExists = users.some(user => user.username === username);
        if (usernameExists) {
            usernameError.textContent = 'Username already exists!';
            hasError = true;
        }

        // Email exists check
        const emailExists = users.some(user => user.email === email);
        if (emailExists) {
            emailError.textContent = 'Email already exists!';
            hasError = true;
        }

        if (hasError) return; // Agar koi error hai to popup nahi dikhana

        // Signup data backend ko bhejein
        fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, name, email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'Signup successful') {
                signupForm.reset();
                setTimeout(() => {
                    popupOverlay.style.display = 'flex'; // Yahi par popup dikhana hai
                    startBalloons();
                }, 500);
            } else {
                // Agar koi aur message aaye to popup mat dikhana
                // Error message show kar sakte hain
            }
        })
        .catch(err => {
            alert('Server error: ' + err.message);
        });
    });

    continueBtn.onclick = function() {
        stopBalloons();
        window.location.href = 'index.html';
    };

    // Error clear on input
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