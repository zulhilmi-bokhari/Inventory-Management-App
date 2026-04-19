const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const user = await response.json();
            localStorage.setItem('inventory_user', JSON.stringify(user));
            window.location.href = 'index.html';
        } else {
            const data = await response.json();
            errorMessage.innerText = data.error || 'Login failed';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.innerText = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
    }
});

// If already logged in, redirect
if (localStorage.getItem('inventory_user')) {
    window.location.href = 'index.html';
}
