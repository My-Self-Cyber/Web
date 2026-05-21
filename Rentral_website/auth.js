// ========== AUTHENTICATION SYSTEM ==========

// Sign Up
document.getElementById('signupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    
    if (password !== confirm) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('rentalx_users') || '[]');
    
    if (users.find(u => u.email === email)) {
        alert('Email already registered!');
        return;
    }
    
    const newUser = { name, email, phone, password };
    users.push(newUser);
    localStorage.setItem('rentalx_users', JSON.stringify(users));
    
    // Auto login after signup
    localStorage.setItem('rentalx_currentUser', JSON.stringify(newUser));
    
    // Initialize user data
    localStorage.setItem(`rentalx_loyalty_${email}`, '100'); // Welcome bonus
    
    alert('Account created successfully! Welcome to RentalX!');
    window.location.href = 'dashboard.html';
});

// Sign In
document.getElementById('signinForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;
    
    const users = JSON.parse(localStorage.getItem('rentalx_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('rentalx_currentUser', JSON.stringify(user));
        alert(`Welcome back, ${user.name}!`);
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid email or password!');
    }
});