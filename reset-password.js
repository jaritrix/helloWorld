document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('resetPasswordForm');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const errorDiv = document.getElementById('reset-error');

    // Email ya username localStorage/sessionStorage se le sakte hain (yahan demo ke liye 'resetEmail' use kiya hai)
    const resetEmail = localStorage.getItem('resetEmail'); // Aapko forgot flow me set karna hoga

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        errorDiv.textContent = '';

        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword !== confirmPassword) {
            errorDiv.textContent = "Passwords do not match.";
            return;
        }

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(user => user.email === resetEmail);

        if (userIndex === -1) {
            errorDiv.textContent = "User not found.";
            return;
        }

        if (users[userIndex].password === newPassword) {
            errorDiv.textContent = "This is your current password.";
            return;
        }

        // Update password
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));

        // Success: Redirect to login with message
        alert("Password reset successful");
        window.location.href = "index.html";
    });
});