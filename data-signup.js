// Form aur popup elements select karo
const signupForm = document.getElementById('signupForm');
const popup = document.getElementById('popup');
const continueBtn = document.getElementById('popup-continue');

// Form submit hone par
signupForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Input values lo
  const username = document.getElementById('signup-username').value.trim();
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();

  // Simple validation (zarurat ho to aur add karo)
  let valid = true;
  if (!username) {
    document.getElementById('username-error').textContent = "Username required";
    valid = false;
  } else {
    document.getElementById('username-error').textContent = "";
  }
  if (!name) {
    document.getElementById('name-error').textContent = "Name required";
    valid = false;
  } else {
    document.getElementById('name-error').textContent = "";
  }
  if (!email || !email.includes('@')) {
    document.getElementById('email-error').textContent = "Valid email required";
    valid = false;
  } else {
    document.getElementById('email-error').textContent = "";
  }
  if (!password || password.length < 6) {
    document.getElementById('password-error').textContent = "Password must be at least 6 characters";
    valid = false;
  } else {
    document.getElementById('password-error').textContent = "";
  }

  if (!valid) return;

  // Backend ko data bhejo (API endpoint apne backend ke hisab se set karo)
  try {
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, name, email, password })
    });
    const data = await res.json();

    if (data.message === 'Signup successful') {
      signupForm.reset();
      showPopup();
    } else {
      // Error message dikhao
      document.getElementById('username-error').textContent = data.error || "Signup failed";
    }
  } catch (err) {
    document.getElementById('username-error').textContent = "Network error";
  }
});

// Popup dikhane ka function
function showPopup() {
  console.log('Popup open');
  popup.classList.add('open');
}

// Popup band karne ka function
function closePopup() {
  console.log('Popup close');
  popup.classList.remove('open');
}

// Sirf continueBtn pe band ho
continueBtn.addEventListener('click', closePopup);