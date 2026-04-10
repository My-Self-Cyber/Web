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
    const logoutVisibleBtn = document.getElementById("logout-btn-visible");
    const loginRequired = document.getElementById("login-required");
    const rentContent = document.getElementById("rent-content");

    console.log("🔄 Updating navbar UI...");
    console.log("User logged in:", !!currentUser);
    console.log("nav-user element:", navUser);
    console.log("auth-buttons element:", authButtons);
    console.log("logout visible button:", logoutVisibleBtn);

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
        if (logoutVisibleBtn) {
            logoutVisibleBtn.style.display = 'inline-block';
            console.log("✅ Shown visible logout button");
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
        if (logoutVisibleBtn) logoutVisibleBtn.style.display = 'inline-block';
        if (loginRequired) loginRequired.style.display = 'block';
        if (rentContent) rentContent.style.display = 'none';
    }
}

// ===============================
// ✅ LOGOUT FUNCTIONALITY
// ===============================
function setupLogout() {
    const logoutBtn = document.getElementById("logout-btn");
    const logoutVisibleBtn = document.getElementById("logout-btn-visible");
    const attachLogout = (btn) => {
        if (!btn) return;
        console.log("🔧 Setting up logout button listener", btn.id);
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            if (confirm("Are you sure you want to logout?")) {
                localStorage.removeItem('rentalx_currentUser');
                alert('Logged out successfully!');
                window.location.href = 'index.html';
            }
        });
    };

    attachLogout(logoutBtn);
    attachLogout(logoutVisibleBtn);
    if (!logoutBtn && !logoutVisibleBtn) {
        console.log("❌ No logout button found");
    }
}

// ===============================
// ✅ SAVE SELECTED CAR
// ===============================
function saveSelectedCarFromCard(card) {
    if (!card) return;

    const selectedCar = {
        id: parseInt(card.getAttribute('data-id') || '0', 10),
        title: card.querySelector('h4') ? card.querySelector('h4').textContent.trim() : 'Selected Car',
        rate: parseFloat(card.getAttribute('data-rate') || '0'),
        transmission: card.getAttribute('data-transmission') || '',
        fuel: card.getAttribute('data-fuel') || '',
        seats: card.getAttribute('data-seats') || '',
    };

    localStorage.setItem('rentalx_selectedCar', JSON.stringify(selectedCar));
}

// ===============================
// ✅ PROTECT RENT BUTTONS
// ===============================
function protectRentButtons() {
    const rentButtons = document.querySelectorAll('.rent-now-btn');
    rentButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const card = e.currentTarget.closest('.car__card');
            if (card) {
                saveSelectedCarFromCard(card);
            }

            const isLoggedIn = localStorage.getItem('rentalx_currentUser') !== null;
            if (!isLoggedIn) {
                e.preventDefault();
                alert('Please sign in to continue your booking.');
                window.location.href = 'signin.html';
                return;
            }

            if (!window.location.pathname.includes('rent.html')) {
                window.location.href = 'rent.html';
            }
        });
    });
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

// ===============================
// Booking flow: Select car -> Checkout
// ===============================
let selectedCar = null;

function loadSavedSelectedCar() {
    const saved = localStorage.getItem('rentalx_selectedCar');
    if (!saved) return null;

    try {
        return JSON.parse(saved);
    } catch (err) {
        console.warn('Failed to parse selected car from localStorage', err);
        return null;
    }
}

function applySelectedCarToUI(car) {
    if (!car) return;
    selectedCar = car;
    const info = document.getElementById('selected-car-info');
    if (info) {
        info.innerHTML = `<strong>${selectedCar.title}</strong> — ₹${selectedCar.rate.toLocaleString()} / day · ${selectedCar.transmission} · ${selectedCar.fuel} · ${selectedCar.seats} seats`;
    }
}

function initBookingFlow() {
    const savedCar = loadSavedSelectedCar();
    if (savedCar) {
        applySelectedCarToUI(savedCar);
    }

    // Select car buttons
    document.querySelectorAll('.select-car-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const card = e.target.closest('.car__card');
            if (!card) return;

            selectedCar = {
                id: parseInt(card.getAttribute('data-id') || '0'),
                title: card.querySelector('h4') ? card.querySelector('h4').textContent.trim() : 'Selected Car',
                rate: parseFloat(card.getAttribute('data-rate') || '0'),
                transmission: card.getAttribute('data-transmission') || '',
                fuel: card.getAttribute('data-fuel') || '',
                seats: card.getAttribute('data-seats') || ''
            };

            // Update UI
            const info = document.getElementById('selected-car-info');
            if (info) {
                info.innerHTML = `<strong>${selectedCar.title}</strong> — ₹${selectedCar.rate.toLocaleString()} / day · ${selectedCar.transmission} · ${selectedCar.fuel} · ${selectedCar.seats} seats`;
            }

            // scroll to checkout
            const checkout = document.getElementById('checkout-section');
            if (checkout) checkout.scrollIntoView({behavior: 'smooth', block: 'start'});

            // Recalculate total price
            calculateTotalPrice();
            validateConfirmForm();
        });
    });

    const pickupSelect = document.getElementById('pickup-location');
    if (pickupSelect) {
        pickupSelect.addEventListener('change', () => {
            updateLocationMap();
            validateConfirmForm();
        });
    }

    const availabilityBtn = document.getElementById('check-availability-btn');
    if (availabilityBtn) {
        availabilityBtn.addEventListener('click', () => {
            const checkout = document.getElementById('checkout-section');
            if (checkout) {
                checkout.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            calculateTotalPrice();
            validateConfirmForm();
        });
    }

    const supportBtn = document.getElementById('chat-support-btn');
    if (supportBtn) {
        supportBtn.addEventListener('click', () => {
            alert('Help is on the way! Send your request to support@rentalx.com or call +92 300 1234567.');
        });
    }

    // Form fields listeners to recalc and validate
    ['confirm-pickup', 'confirm-return', 'confirm-fullname', 'confirm-email', 'confirm-phone', 'driving-license', 'emergency-contact'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => { calculateTotalPrice(); validateConfirmForm(); });
            el.addEventListener('change', () => { calculateTotalPrice(); validateConfirmForm(); });
        }
    });

    const confirmForm = document.getElementById('confirm-form');
    if (confirmForm) {
        confirmForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (!validateConfirmForm()) return;

            const token = localStorage.getItem('rentalx_token');
            const bookingData = {
                car_id: selectedCar.id,
                pickup_date: document.getElementById('confirm-pickup').value,
                return_date: document.getElementById('confirm-return').value,
                pickup_location: document.getElementById('pickup-location') ? document.getElementById('pickup-location').value : '',
                dropoff_location: document.getElementById('drop-location') ? document.getElementById('drop-location').value : '',
                fullname: document.getElementById('confirm-fullname').value,
                email: document.getElementById('confirm-email').value,
                phone: document.getElementById('confirm-phone').value,
                license: document.getElementById('driving-license').value,
                emergency: document.getElementById('emergency-contact').value,
                createdAt: new Date().toISOString(),
            };

            if (!selectedCar || !selectedCar.id || selectedCar.id === 0) {
                alert('Please select a valid car before confirming rent.');
                return;
            }

            const saveLocalBooking = (data) => {
                const bookings = JSON.parse(localStorage.getItem('rentalx_bookings') || '[]');
                bookings.push({ id: Date.now(), ...data, syncStatus: 'local' });
                localStorage.setItem('rentalx_bookings', JSON.stringify(bookings));
                displayBookingReceipt(data, calculateTotalPrice(), Date.now(), 'Booking saved locally. You can sync it later when the backend is available.');
                confirmForm.reset();
                selectedCar = null;
                const info = document.getElementById('selected-car-info');
                if (info) info.textContent = 'No car selected.';
                document.getElementById('total-price').textContent = '0';
                document.getElementById('confirm-rent-btn').disabled = true;
            };

            if (!token || token === 'local-token') {
                saveLocalBooking(bookingData);
                return;
            }

            try {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(bookingData),
                });

                if (response.ok) {
                    const result = await response.json();
                    localStorage.removeItem('rentalx_selectedCar');
                    const successMessage = result.message || `A confirmation email has been sent to ${bookingData.email}.`;
                    displayBookingReceipt(bookingData, calculateTotalPrice(), result.booking?.id || Date.now(), successMessage);
                    alert('✅ Booking created! Please confirm via the email link to activate your reservation.');
                    confirmForm.reset();
                    selectedCar = null;
                    const info = document.getElementById('selected-car-info');
                    if (info) info.textContent = 'No car selected.';
                    document.getElementById('total-price').textContent = '0';
                    document.getElementById('confirm-rent-btn').disabled = true;
                } else {
                    const error = await response.json().catch(() => ({}));
                    saveLocalBooking(bookingData);
                    console.warn('Booking failed, saved locally:', error);
                }
            } catch (error) {
                console.error('Booking error:', error);
                saveLocalBooking(bookingData);
            }
        });
    }
}

function calculateTotalPrice() {
    const totalEl = document.getElementById('total-price');
    const pickup = document.getElementById('confirm-pickup');
    const ret = document.getElementById('confirm-return');

    if (!selectedCar || !pickup || !ret || !pickup.value || !ret.value) {
        if (totalEl) totalEl.textContent = '0';
        return 0;
    }

    const start = new Date(pickup.value);
    const end = new Date(ret.value);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
        if (totalEl) totalEl.textContent = '0';
        showDateError('Return date must be after the pickup date. Please select a valid range.');
        return 0;
    }

    // Calculate days, ensure at least 1
    let diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (isNaN(diff) || diff < 1) diff = 1;

    const total = diff * (selectedCar.rate || 0);
    if (totalEl) totalEl.textContent = total.toLocaleString();
    return total;
}

function showDateError(message) {
    const errorElement = document.getElementById('date-error');
    if (!errorElement) return;
    errorElement.textContent = message || '';
    errorElement.style.display = message ? 'block' : 'none';
}

function validateConfirmForm() {
    const fullname = document.getElementById('confirm-fullname');
    const email = document.getElementById('confirm-email');
    const phone = document.getElementById('confirm-phone');
    const pickup = document.getElementById('confirm-pickup');
    const ret = document.getElementById('confirm-return');
    const license = document.getElementById('driving-license');
    const emergency = document.getElementById('emergency-contact');
    const confirmBtn = document.getElementById('confirm-rent-btn');

    let valid = true;
    showDateError('');
    if (!selectedCar || !selectedCar.id || selectedCar.id === 0) valid = false;
    if (!fullname || !fullname.value.trim()) valid = false;
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) valid = false;
    if (!phone || phone.value.trim().length < 7) valid = false;
    if (!pickup || !pickup.value) valid = false;
    if (!ret || !ret.value) valid = false;
    if (!license || license.value.trim().length < 3) valid = false;
    if (!emergency || emergency.value.trim().length < 7) valid = false;

    if (pickup && ret && pickup.value && ret.value) {
        const startDate = new Date(pickup.value);
        const endDate = new Date(ret.value);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate) {
            valid = false;
            showDateError('Return date must be after the pickup date. Please select a valid range.');
        }
    }

    if (confirmBtn) confirmBtn.disabled = !valid;
    return valid;
}

function formatDateString(value) {
    const date = new Date(value);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function displayBookingReceipt(data, total, bookingId, notice = '') {
    const receiptSection = document.getElementById('booking-receipt');
    const receiptCard = document.getElementById('receipt-card');
    const receiptMessage = document.getElementById('receipt-message');

    if (!receiptSection || !receiptCard || !receiptMessage) return;

    receiptMessage.textContent = notice || 'Your booking receipt is ready.';
    receiptCard.innerHTML = `
        <div class="receipt__header">
            <h3>RentalX Receipt</h3>
            <span>Booking #${bookingId}</span>
        </div>
        <dl>
            <dt>Car</dt><dd>${selectedCar ? selectedCar.title : 'N/A'}</dd>
            <dt>Pickup</dt><dd>${data.pickup_location} • ${formatDateString(data.pickup_date)}</dd>
            <dt>Return</dt><dd>${data.dropoff_location} • ${formatDateString(data.return_date)}</dd>
            <dt>Name</dt><dd>${data.fullname}</dd>
            <dt>Email</dt><dd>${data.email}</dd>
            <dt>Phone</dt><dd>${data.phone}</dd>
            <dt>License</dt><dd>${data.license}</dd>
            <dt>Emergency</dt><dd>${data.emergency}</dd>
            <dt>Total</dt><dd>₹${total.toLocaleString()}</dd>
        </dl>
    `;
    receiptSection.style.display = 'block';
    receiptSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initGeolocation() {
    const locationDisplay = document.getElementById('current-location');
    if (!locationDisplay) return;

    if (!navigator.geolocation) {
        locationDisplay.textContent = 'Location is not supported by your browser.';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            locationDisplay.textContent = `Latitude ${position.coords.latitude.toFixed(4)}, Longitude ${position.coords.longitude.toFixed(4)}`;
        },
        () => {
            locationDisplay.textContent = 'Location access denied or unavailable.';
        },
        { enableHighAccuracy: true, timeout: 8000 }
    );
}

function prefillUserInfo() {
    const currentUser = localStorage.getItem('rentalx_currentUser');
    if (!currentUser) return;

    const user = JSON.parse(currentUser);
    const fullname = document.getElementById('confirm-fullname');
    const email = document.getElementById('confirm-email');
    const phone = document.getElementById('confirm-phone');
    if (fullname && user.name) fullname.value = user.name;
    if (email && user.email) email.value = user.email;
    if (phone && user.phone) phone.value = user.phone;
}

function updateLocationMap() {
    const pickupSelect = document.getElementById('pickup-location');
    const mapFrame = document.getElementById('pickup-map');
    if (!pickupSelect || !mapFrame) return;

    const location = pickupSelect.value && pickupSelect.value !== 'Select Pickup Location'
        ? pickupSelect.value
        : 'Pakistan';
    mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&z=13&output=embed`;
}

// ===============================
// Load Cars from Backend API
// ===============================
async function loadCarsFromAPI() {
    const carsGrid = document.getElementById('cars-grid');
    if (!carsGrid) return; // Only run on pages with cars-grid
    
    try {
        const response = await fetch('/api/cars');
        if (!response.ok) throw new Error('Failed to fetch cars');
        
        const cars = await response.json();
        
        carsGrid.innerHTML = ''; // Clear existing content
        
        cars.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'car__card';
            carCard.setAttribute('data-id', car.id);
            carCard.setAttribute('data-rate', car.daily_rate || 0);
            carCard.setAttribute('data-transmission', car.transmission || 'Auto');
            carCard.setAttribute('data-fuel', car.fuel || 'Petrol');
            carCard.setAttribute('data-seats', car.seats || 5);
            
            carCard.innerHTML = `
                <img src="assets/${car.image || 'corolla.jpg'}" alt="${car.name || 'Car'}" onerror="this.src='assets/corolla.jpg'" />
                <h4>${car.name || 'Unknown Car'}</h4>
                <p>${car.description || 'A great car for your journey.'}</p>
                <p><strong>₹${(car.daily_rate || 0).toLocaleString()} / day</strong></p>
                <button class="select-car-btn btn btn__primary">Select & Rent</button>
            `;
            
            carsGrid.appendChild(carCard);
        });
        
        // Re-initialize booking flow for newly added buttons
        initBookingFlow();
        
    } catch (error) {
        console.error('Error loading cars:', error);
        carsGrid.innerHTML = '<p>Unable to load cars. Please try again later.</p>';
    }
}

// Initialize booking flow on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    loadCarsFromAPI(); // Load cars from API first
    updateNavbarUI(); // Update navbar
    setupLogout(); // Setup logout
    initBookingFlow(); // Initialize car selection events for rent page
    initGeolocation(); // Show current location if available
    prefillUserInfo(); // Prefill user information when possible
    updateLocationMap(); // Show pickup map based on selected location
    validateConfirmForm();
});