// ========== HOME PAGE SLIDESHOW & FEATURED CARS ==========

let slideIndex = 0;
let slideInterval;

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedCars();
    startSlideshow();
});

// Load featured cars (top 4 cars by rating)
function loadFeaturedCars() {
    const cars = loadCars();
    const featured = [...cars].sort((a, b) => b.rating - a.rating).slice(0, 4);
    const container = document.getElementById('featuredCars');
    
    if (!container) return;
    
    container.innerHTML = featured.map(car => `
        <div class="premium-card">
            <img src="${car.image}" class="car-image" onerror="this.src='https://via.placeholder.com/400x220?text=${car.name}'">
            <div class="car-info">
                <div style="display:flex; justify-content:space-between">
                    <h3 class="car-title">${car.name}</h3>
                    <span class="car-year">${car.year}</span>
                </div>
                <div class="rating">
                    <div class="stars">${generateStars(car.rating)}</div>
                    <span>(${car.reviews})</span>
                </div>
                <div class="car-specs">
                    <span><i class="ri-settings-3-line"></i> ${car.transmission}</span>
                    <span><i class="ri-group-line"></i> ${car.seats} Seats</span>
                    <span><i class="ri-gas-station-line"></i> ${car.fuelType}</span>
                </div>
                <div class="car-price">${formatPrice(car.price)} <small>/ day</small></div>
                <button onclick="viewCar(${car.id})" class="btn btn-primary" style="width:100%">View Details</button>
            </div>
        </div>
    `).join('');
}

function viewCar(carId) {
    window.location.href = `booking.html?car=${carId}`;
}

// Slideshow Functions
function startSlideshow() {
    const slides = document.querySelectorAll('.slide');
    if (!slides || slides.length === 0) return;

    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (!slides || slides.length === 0 || !dots || dots.length === 0) return;
    
    // Remove active class from current slide
    slides[slideIndex].classList.remove('active');
    dots[slideIndex].classList.remove('active');
    
    // Calculate new index
    slideIndex += direction;
    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length - 1;
    
    // Add active class to new slide
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
    
    // Reset timer
    resetTimer();
}

function currentSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (!slides || slides.length === 0 || !dots || dots.length === 0) return;
    
    // Remove active class from current slide
    slides[slideIndex].classList.remove('active');
    dots[slideIndex].classList.remove('active');
    
    // Set new index
    slideIndex = index;
    
    // Add active class to new slide
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
    
    // Reset timer
    resetTimer();
}

function resetTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// Pause slideshow on hover
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.slideshow-container');
    if (container) {
        container.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        container.addEventListener('mouseleave', () => {
            startSlideshow();
        });
    }
});