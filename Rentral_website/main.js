// -----------------------------
// 🌐 main.js — RentalX Website
// -----------------------------

// ✅ Mobile Menu Toggle
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
let menuBtnIcon;

if (menuBtn && navLinks) {
    menuBtnIcon = menuBtn.querySelector("i");
    menuBtn.addEventListener("click", (e) => {
        navLinks.classList.toggle("open");

        const isOpen = navLinks.classList.contains("open");
        menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
    });

    navLinks.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
            navLinks.classList.remove("open");
            menuBtnIcon.setAttribute("class", "ri-menu-line");
        }
    });
}

// ✅ Highlight Active Page in Navbar
const links = document.querySelectorAll(".nav__links a");
const currentPage = window.location.pathname.split("/").pop();

links.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (linkHref === currentPage || (currentPage === "" && linkHref === "index.html")) {
        link.classList.add("active");
    }
});

// ✅ ScrollReveal Animations
const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000,
};

// Home Section
if (document.querySelector('.header__image img')) {
    ScrollReveal().reveal(".header__image img", {
        ...scrollRevealOption,
        origin: "right",
    });
}

if (document.querySelector('.header__content h1')) {
    ScrollReveal().reveal(".header__content h1", {
        ...scrollRevealOption,
        delay: 500,
    });
}

if (document.querySelector('.header__content p')) {
    ScrollReveal().reveal(".header__content p", {
        ...scrollRevealOption,
        delay: 1000,
    });
}

if (document.querySelector('.header__links')) {
    ScrollReveal().reveal(".header__links", {
        ...scrollRevealOption,
        delay: 1500,
    });
}

// Steps
if (document.querySelector('.steps__card')) {
    ScrollReveal().reveal(".steps__card", {
        ...scrollRevealOption,
        interval: 500,
    });
}

// Services
if (document.querySelector('.service__image img')) {
    ScrollReveal().reveal(".service__image img", {
        ...scrollRevealOption,
        origin: "left",
    });
}

if (document.querySelector('.service__content .section__subheader')) {
    ScrollReveal().reveal(".service__content .section__subheader", {
        ...scrollRevealOption,
        delay: 500,
    });
}

if (document.querySelector('.service__content .section__header')) {
    ScrollReveal().reveal(".service__content .section__header", {
        ...scrollRevealOption,
        delay: 1000,
    });
}

if (document.querySelector('.service__list li')) {
    ScrollReveal().reveal(".service__list li", {
        ...scrollRevealOption,
        delay: 1500,
        interval: 500,
    });
}

// Experience
if (document.querySelector('.experience__card')) {
    ScrollReveal().reveal(".experience__card", {
        duration: 1000,
        interval: 500,
    });
}

// Download
if (document.querySelector('.download__image img')) {
    ScrollReveal().reveal(".download__image img", {
        ...scrollRevealOption,
        origin: "right",
    });
}

if (document.querySelector('.download__content .section__header')) {
    ScrollReveal().reveal(".download__content .section__header", {
        ...scrollRevealOption,
        delay: 500,
    });
}

if (document.querySelector('.download__content p')) {
    ScrollReveal().reveal(".download__content p", {
        ...scrollRevealOption,
        delay: 1000,
    });
}

if (document.querySelector('.download__links')) {
    ScrollReveal().reveal(".download__links", {
        ...scrollRevealOption,
        delay: 1500,
    });
}

// ✅ Cars Page Animation (for cars.html)
if (document.querySelector('.car__card')) {
    ScrollReveal().reveal(".car__card", {
        ...scrollRevealOption,
        delay: 100,
        origin: "bottom",
        interval: 200,
    });
}

// ✅ Smooth scroll for internal anchors
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        if (this.getAttribute("href") !== "#") {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 50,
                    behavior: "smooth",
                });
            }
        }
    });
});

// ===============================
// ✅ AUTO UPDATE UI ON PAGE LOAD
// ===============================
function updateNavbarUI() {
    const currentUser = localStorage.getItem('rentalx_currentUser');
    const authButtons = document.getElementById("auth-buttons");
    const navUser = document.getElementById("nav-user");
    const userGreeting = document.getElementById("user-greeting");
    const logoutBtn = document.getElementById("logout-btn");
    const loginRequired = document.getElementById("login-required");
    const rentContent = document.getElementById("rent-content");

    console.log("🔄 Updating navbar UI...");
    console.log("User logged in:", !!currentUser);
    console.log("nav-user element:", navUser);
    console.log("auth-buttons element:", authButtons);

    if (currentUser) {
        // User is logged in - SHOW LOGOUT, HIDE SIGNUP/SIGNIN
        const userData = JSON.parse(currentUser);
        
        if (authButtons) {
            authButtons.style.display = 'none';
            console.log("✅ Hidden auth buttons");
        }
        if (navUser) {
            navUser.style.display = 'flex';
            console.log("✅ Shown nav-user");
        }
        if (userGreeting) {
            userGreeting.textContent = `Welcome, ${userData.name}`;
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
            console.log("✅ Shown logout button");
        }
        if (loginRequired) loginRequired.style.display = 'none';
        if (rentContent) rentContent.style.display = 'block';
        
    } else {
        // User is not logged in - SHOW SIGNUP/SIGNIN, HIDE LOGOUT
        console.log("👤 User not logged in");
        
        if (authButtons) {
            authButtons.style.display = 'flex';
            console.log("✅ Shown auth buttons");
        }
        if (navUser) {
            navUser.style.display = 'none';
            console.log("✅ Hidden nav-user");
        }
        if (userGreeting) userGreeting.textContent = '';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (loginRequired) loginRequired.style.display = 'block';
        if (rentContent) rentContent.style.display = 'none';
    }
}

// ===============================
// ✅ LOGOUT FUNCTIONALITY
// ===============================
function setupLogout() {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        console.log("🔧 Setting up logout button listener");
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            if (confirm("Are you sure you want to logout?")) {
                localStorage.removeItem('rentalx_currentUser');
                alert('Logged out successfully!');
                window.location.href = 'index.html';
            }
        });
    } else {
        console.log("❌ Logout button not found");
    }
}

// ===============================
// ✅ PROTECT RENT BUTTONS
// ===============================
function protectRentButtons() {
    if (window.location.pathname.includes('rent.html')) {
        const rentButtons = document.querySelectorAll('.rent-now-btn, #check-availability-btn');
        
        rentButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const isLoggedIn = localStorage.getItem('rentalx_currentUser') !== null;
                
                if (!isLoggedIn) {
                    e.preventDefault();
                    alert('Please sign in to rent a car.');
                    window.location.href = 'signin.html';
                } else {
                    alert('Car rental process started!');
                    // Add your rent logic here
                }
            });
        });
    }
}

// ===============================
// ✅ INITIALIZE EVERYTHING
// ===============================
document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Initializing RentalX website...");
    
    // Update navbar UI
    updateNavbarUI();
    
    // Setup logout functionality
    setupLogout();
    
    // Protect rent buttons
    protectRentButtons();
    
    // Extra safety check after page fully loads
    setTimeout(updateNavbarUI, 100);
});

// Also update UI when navigating between pages
window.addEventListener('pageshow', function() {
    updateNavbarUI();
});