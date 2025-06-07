document.addEventListener('DOMContentLoaded', function () {
    const forgotForm = document.getElementById('forgotPasswordForm');
    const errorMessage = document.getElementById('errorMessage');
    const emailInput = document.getElementById('email');
    const resendLink = document.getElementById('resend-link');
    const otpSection = document.getElementById('otp-section');
    const otpInput = document.getElementById('otp-input');
    const otpSendBtn = forgotForm.querySelector('button[type="submit"]');

    forgotForm.addEventListener('submit', function (e) {
        e.preventDefault();
        errorMessage.textContent = '';

        const email = emailInput.value.trim();
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            errorMessage.style.color = 'green';
            errorMessage.textContent = 'Reset link sent successfully to your email!';
            resendLink.style.display = 'block';
            otpSection.style.display = 'block';
            otpSendBtn.disabled = true;
            otpSendBtn.classList.add('no-hover');
        } else {
            errorMessage.style.color = 'red';
            errorMessage.textContent = 'This email is not registered!';
            resendLink.style.display = 'none';
            otpSection.style.display = 'none';
        }
    });

    otpInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0,6);
    });

    resendLink.onclick = function() {
        errorMessage.style.color = 'red';
        errorMessage.textContent = 'Reset link resent to your email!';
    };

    document.getElementById('verify-otp-btn').onclick = function() {
        // Yahan aap OTP verify kar sakte hain (agar logic hai)
        // OTP sahi ho to redirect:
        window.location.href = 'reset-password.html';
    };
});