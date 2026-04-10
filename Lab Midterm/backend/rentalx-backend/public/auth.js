// Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is logged in from localStorage
        const savedUser = localStorage.getItem('rentalx_currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
        
        // Initialize forms based on current page
        this.initializeForms();
    }

    initializeForms() {
        // Sign Up Form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignUp(e));
        }

        // Sign In Form
        const signinForm = document.getElementById('signin-form');
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => this.handleSignIn(e));
        }
    }

    // Sign Up function
    handleSignUp(e) {
        e.preventDefault();
        
        const name = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('rentalx_users') || '[]');
        const existingUser = users.find(user => user.email === email);
        
        if (existingUser) {
            alert('User already exists with this email!');
            return;
        }

        // Try to register with backend API first (if available)
        const payload = { name, email, password };

        fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(async res => {
            if (res.ok) {
                const data = await res.json();
                // Save token + user
                if (data.token) localStorage.setItem('rentalx_token', data.token);
                localStorage.setItem('rentalx_currentUser', JSON.stringify(data.user || { name, email }));
                alert('Account created successfully! Redirecting to home page...');
                window.location.href = 'index.html';
            } else {
                // fallback to local storage approach
                const newUser = {
                    id: Date.now(),
                    name,
                    email,
                    password,
                    phone,
                    createdAt: new Date().toISOString()
                };

                users.push(newUser);
                localStorage.setItem('rentalx_users', JSON.stringify(users));
                this.currentUser = newUser;
                localStorage.setItem('rentalx_currentUser', JSON.stringify(newUser));
                alert('Account created locally (offline). Redirecting to home page...');
                window.location.href = 'index.html';
            }
        }).catch(() => {
            // network error -> fallback
            const newUser = {
                id: Date.now(),
                name,
                email,
                password,
                phone,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('rentalx_users', JSON.stringify(users));
            this.currentUser = newUser;
            localStorage.setItem('rentalx_currentUser', JSON.stringify(newUser));
            alert('Account created locally (offline). Redirecting to home page...');
            window.location.href = 'index.html';
        });
    }

    // Sign In function
    handleSignIn(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Try backend login first
        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }).then(async res => {
            if (res.ok) {
                const data = await res.json();
                if (data.token) localStorage.setItem('rentalx_token', data.token);
                localStorage.setItem('rentalx_currentUser', JSON.stringify(data.user || { email }));
                alert('Login successful! Redirecting to home page...');
                window.location.href = 'index.html';
            } else {
                // fallback to local users
                const users = JSON.parse(localStorage.getItem('rentalx_users') || '[]');
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    this.currentUser = user;
                    localStorage.setItem('rentalx_currentUser', JSON.stringify(user));
                    alert('Login successful (offline)! Redirecting to home page...');
                    window.location.href = 'index.html';
                } else {
                    alert('Invalid email or password!');
                }
            }
        }).catch(() => {
            // network error -> fallback
            const users = JSON.parse(localStorage.getItem('rentalx_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                this.currentUser = user;
                localStorage.setItem('rentalx_currentUser', JSON.stringify(user));
                localStorage.setItem('rentalx_token', 'local-token');
                localStorage.setItem('rentalx_token', 'local-token');
                alert('Login successful (offline)! Redirecting to home page...');
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password!');
            }
        });
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Initialize auth system
const auth = new AuthSystem();