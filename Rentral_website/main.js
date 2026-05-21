// ========== GLOBAL FUNCTIONS ==========

function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: 'ri-checkbox-circle-line', error: 'ri-error-warning-line', warning: 'ri-alert-line', info: 'ri-information-line' };
    toast.innerHTML = `<i class="${icons[type]}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function updateUI() {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    const authLinks = document.getElementById('authLinks');
    const userInfo = document.getElementById('userInfo');
    const dashLink = document.getElementById('dashLink');
    const userNameSpan = document.getElementById('userName');

    if (user) {
        if (authLinks) authLinks.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        if (dashLink) dashLink.style.display = 'block';
        if (userNameSpan) userNameSpan.innerText = user.name;
    } else {
        if (authLinks) authLinks.style.display = 'flex';
        if (userInfo) userInfo.style.display = 'none';
        if (dashLink) dashLink.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('rentalx_currentUser');
    showToast('Logged out successfully!', 'success');
    setTimeout(() => window.location.href = 'index.html', 500);
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(price);
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<i class="ri-star-fill star active"></i>' : '<i class="ri-star-line star"></i>';
    }
    return stars;
}

function getWishlist() {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`rentalx_wishlist_${user.email}`) || '[]');
}

function toggleWishlist(carId) {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    if (!user) { showToast('Please login first', 'warning'); window.location.href = 'signin.html'; return; }
    
    let wishlist = getWishlist();
    if (wishlist.includes(carId)) {
        wishlist = wishlist.filter(id => id !== carId);
        showToast('Removed from wishlist', 'info');
    } else {
        wishlist.push(carId);
        showToast('Added to wishlist!', 'success');
    }
    localStorage.setItem(`rentalx_wishlist_${user.email}`, JSON.stringify(wishlist));
    displayCars();
}

// ========== COMPLETE CARS DATABASE (42 CARS) ==========

function loadCars() {
    let cars = JSON.parse(localStorage.getItem('rentalx_cars') || '[]');
    
    // If no cars or less than 20 cars, reset the database
    if (cars.length === 0 || cars.length < 20) {
        cars = getAllCars();
        localStorage.setItem('rentalx_cars', JSON.stringify(cars));
        console.log('✅ Cars database reset! Total cars:', cars.length);
    }
    return cars;
}

function getAllCars() {
    return [
        // Luxury Sedans (1-8)
        { id: 1, name: 'Mercedes-Benz S-Class', brand: 'Mercedes', image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=800', price: 180000, engine: '4.0L V8 Biturbo', transmission: 'Auto', seats: 5, rating: 5.0, reviews: 234, year: 2024, fuelType: 'Petrol' },
        { id: 2, name: 'BMW 7 Series', brand: 'BMW', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800', price: 165000, engine: '3.0L TwinPower', transmission: 'Auto', seats: 5, rating: 4.9, reviews: 189, year: 2024, fuelType: 'Petrol' },
        { id: 3, name: 'Audi A8 L', brand: 'Audi', image: 'https://images.unsplash.com/photo-1546768292-fb12f6c92568?auto=format&fit=crop&q=80&w=800', price: 170000, engine: '3.0L V6 TFSI', transmission: 'Auto', seats: 5, rating: 4.8, reviews: 156, year: 2024, fuelType: 'Petrol' },
        { id: 4, name: 'Porsche Panamera', brand: 'Porsche', image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&q=80&w=800', price: 200000, engine: '2.9L V6 Biturbo', transmission: 'Auto', seats: 4, rating: 4.9, reviews: 98, year: 2024, fuelType: 'Petrol' },
        { id: 5, name: 'Lexus LS 500', brand: 'Lexus', image: 'https://images.unsplash.com/photo-1590663241325-5c3d3a6e60c3?auto=format&fit=crop&q=80&w=800', price: 160000, engine: '3.5L V6 Twin Turbo', transmission: 'Auto', seats: 5, rating: 4.9, reviews: 112, year: 2024, fuelType: 'Petrol' },
        { id: 6, name: 'Jaguar XJ', brand: 'Jaguar', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800', price: 155000, engine: '3.0L V6 Supercharged', transmission: 'Auto', seats: 5, rating: 4.7, reviews: 89, year: 2023, fuelType: 'Petrol' },
        { id: 7, name: 'Genesis G90', brand: 'Genesis', image: 'https://images.unsplash.com/photo-1603584173870-7f309f8a7149?auto=format&fit=crop&q=80&w=800', price: 145000, engine: '3.5L V6', transmission: 'Auto', seats: 5, rating: 4.8, reviews: 67, year: 2024, fuelType: 'Petrol' },
        { id: 8, name: 'Maserati Ghibli', brand: 'Maserati', image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&q=80&w=800', price: 175000, engine: '3.0L V6', transmission: 'Auto', seats: 5, rating: 4.6, reviews: 123, year: 2024, fuelType: 'Petrol' },
        
        // Sports Cars (9-16)
        { id: 9, name: 'Ferrari F8 Tributo', brand: 'Ferrari', image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&q=80&w=800', price: 450000, engine: '3.9L V8 Twin Turbo', transmission: 'Auto', seats: 2, rating: 5.0, reviews: 234, year: 2024, fuelType: 'Petrol' },
        { id: 10, name: 'Lamborghini Huracan', brand: 'Lamborghini', image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=800', price: 500000, engine: '5.2L V10', transmission: 'Auto', seats: 2, rating: 5.0, reviews: 187, year: 2024, fuelType: 'Petrol' },
        { id: 11, name: 'Porsche 911 Turbo S', brand: 'Porsche', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800', price: 350000, engine: '3.8L Flat 6', transmission: 'Auto', seats: 4, rating: 5.0, reviews: 345, year: 2024, fuelType: 'Petrol' },
        { id: 12, name: 'McLaren 720S', brand: 'McLaren', image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=800', price: 480000, engine: '4.0L V8 Twin Turbo', transmission: 'Auto', seats: 2, rating: 5.0, reviews: 123, year: 2024, fuelType: 'Petrol' },
        { id: 13, name: 'Audi R8', brand: 'Audi', image: 'https://images.unsplash.com/photo-1603584173870-7f309f8a7149?auto=format&fit=crop&q=80&w=800', price: 320000, engine: '5.2L V10', transmission: 'Auto', seats: 2, rating: 4.9, reviews: 234, year: 2024, fuelType: 'Petrol' },
        { id: 14, name: 'Chevrolet Corvette', brand: 'Chevrolet', image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&q=80&w=800', price: 250000, engine: '6.2L V8', transmission: 'Auto', seats: 2, rating: 4.8, reviews: 456, year: 2024, fuelType: 'Petrol' },
        { id: 15, name: 'Nissan GT-R', brand: 'Nissan', image: 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?auto=format&fit=crop&q=80&w=800', price: 220000, engine: '3.8L V6 Twin Turbo', transmission: 'Auto', seats: 4, rating: 4.9, reviews: 567, year: 2024, fuelType: 'Petrol' },
        { id: 16, name: 'BMW M8', brand: 'BMW', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800', price: 280000, engine: '4.4L V8', transmission: 'Auto', seats: 4, rating: 4.8, reviews: 234, year: 2024, fuelType: 'Petrol' },
        
        // Luxury SUVs (17-24)
        { id: 17, name: 'Range Rover Vogue', brand: 'Range Rover', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800', price: 180000, engine: '5.0L V8 Supercharged', transmission: 'Auto', seats: 5, rating: 4.9, reviews: 456, year: 2024, fuelType: 'Petrol' },
        { id: 18, name: 'BMW X7 M50i', brand: 'BMW', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800', price: 160000, engine: '4.4L V8 Twin Turbo', transmission: 'Auto', seats: 7, rating: 4.8, reviews: 234, year: 2024, fuelType: 'Petrol' },
        { id: 19, name: 'Mercedes-Benz GLS', brand: 'Mercedes', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800', price: 170000, engine: '4.0L V8 Biturbo', transmission: 'Auto', seats: 7, rating: 4.9, reviews: 189, year: 2024, fuelType: 'Petrol' },
        { id: 20, name: 'Audi Q8', brand: 'Audi', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800', price: 145000, engine: '3.0L V6 TFSI', transmission: 'Auto', seats: 5, rating: 4.8, reviews: 278, year: 2024, fuelType: 'Petrol' },
        { id: 21, name: 'Porsche Cayenne Turbo', brand: 'Porsche', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800', price: 190000, engine: '4.0L V8 Twin Turbo', transmission: 'Auto', seats: 5, rating: 4.9, reviews: 167, year: 2024, fuelType: 'Petrol' },
        { id: 22, name: 'Volvo XC90', brand: 'Volvo', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800', price: 120000, engine: '2.0L Hybrid', transmission: 'Auto', seats: 7, rating: 4.7, reviews: 345, year: 2024, fuelType: 'Hybrid' },
        { id: 23, name: 'Lexus LX 600', brand: 'Lexus', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800', price: 175000, engine: '3.5L V6 Twin Turbo', transmission: 'Auto', seats: 7, rating: 4.9, reviews: 123, year: 2024, fuelType: 'Petrol' },
        { id: 24, name: 'Cadillac Escalade', brand: 'Cadillac', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800', price: 165000, engine: '6.2L V8', transmission: 'Auto', seats: 7, rating: 4.8, reviews: 234, year: 2024, fuelType: 'Petrol' },
        
        // Popular Pakistan Cars (25-32)
        { id: 25, name: 'Toyota Fortuner Legender', brand: 'Toyota', image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800', price: 65000, engine: '2.8L Diesel', transmission: 'Auto', seats: 7, rating: 4.7, reviews: 1234, year: 2024, fuelType: 'Diesel' },
        { id: 26, name: 'Honda Civic RS', brand: 'Honda', image: 'https://images.unsplash.com/photo-1603584173870-7f309f8a7149?auto=format&fit=crop&q=80&w=800', price: 45000, engine: '1.5L Turbo', transmission: 'Auto', seats: 5, rating: 4.6, reviews: 2345, year: 2024, fuelType: 'Petrol' },
        { id: 27, name: 'Toyota Corolla Altis', brand: 'Toyota', image: 'https://images.unsplash.com/photo-1603584173870-7f309f8a7149?auto=format&fit=crop&q=80&w=800', price: 35000, engine: '1.8L', transmission: 'Auto', seats: 5, rating: 4.5, reviews: 3456, year: 2024, fuelType: 'Petrol' },
        { id: 28, name: 'Kia Sportage', brand: 'Kia', image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800', price: 55000, engine: '2.0L', transmission: 'Auto', seats: 5, rating: 4.6, reviews: 2345, year: 2024, fuelType: 'Petrol' },
        { id: 29, name: 'Hyundai Tucson', brand: 'Hyundai', image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800', price: 58000, engine: '2.0L', transmission: 'Auto', seats: 5, rating: 4.6, reviews: 1876, year: 2024, fuelType: 'Petrol' },
        { id: 30, name: 'Suzuki Swift', brand: 'Suzuki', image: 'https://images.unsplash.com/photo-1603584173870-7f309f8a7149?auto=format&fit=crop&q=80&w=800', price: 20000, engine: '1.2L', transmission: 'Manual', seats: 5, rating: 4.3, reviews: 4567, year: 2024, fuelType: 'Petrol' },
        { id: 31, name: 'Honda City', brand: 'Honda', image: 'https://images.unsplash.com/photo-1603584173870-7f309f8a7149?auto=format&fit=crop&q=80&w=800', price: 30000, engine: '1.5L', transmission: 'Auto', seats: 5, rating: 4.4, reviews: 3456, year: 2024, fuelType: 'Petrol' },
        { id: 32, name: 'Suzuki Wagon R', brand: 'Suzuki', image: 'https://images.unsplash.com/photo-1603584173870-7f309f8a7149?auto=format&fit=crop&q=80&w=800', price: 15000, engine: '1.0L', transmission: 'Manual', seats: 4, rating: 4.2, reviews: 5678, year: 2024, fuelType: 'Petrol' },
        
        // Electric Vehicles (33-38)
        { id: 33, name: 'Tesla Model S', brand: 'Tesla', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800', price: 140000, engine: 'Electric Dual Motor', transmission: 'Auto', seats: 5, rating: 4.8, reviews: 2345, year: 2024, fuelType: 'Electric' },
        { id: 34, name: 'Tesla Model 3', brand: 'Tesla', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800', price: 85000, engine: 'Electric', transmission: 'Auto', seats: 5, rating: 4.8, reviews: 3456, year: 2024, fuelType: 'Electric' },
        { id: 35, name: 'Tesla Model X', brand: 'Tesla', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800', price: 120000, engine: 'Electric Tri Motor', transmission: 'Auto', seats: 7, rating: 4.9, reviews: 1234, year: 2024, fuelType: 'Electric' },
        { id: 36, name: 'Audi e-tron GT', brand: 'Audi', image: 'https://images.unsplash.com/photo-1614200024993-21c60613000b?auto=format&fit=crop&q=80&w=800', price: 130000, engine: 'Electric Dual Motor', transmission: 'Auto', seats: 4, rating: 4.9, reviews: 987, year: 2024, fuelType: 'Electric' },
        { id: 37, name: 'Porsche Taycan', brand: 'Porsche', image: 'https://images.unsplash.com/photo-1614200024993-21c60613000b?auto=format&fit=crop&q=80&w=800', price: 160000, engine: 'Electric Dual Motor', transmission: 'Auto', seats: 4, rating: 4.9, reviews: 876, year: 2024, fuelType: 'Electric' },
        { id: 38, name: 'BMW iX', brand: 'BMW', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800', price: 110000, engine: 'Electric Dual Motor', transmission: 'Auto', seats: 5, rating: 4.8, reviews: 765, year: 2024, fuelType: 'Electric' },
        
        // Offroad Vehicles (39-42)
        { id: 39, name: 'Toyota Land Cruiser', brand: 'Toyota', image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800', price: 85000, engine: '4.5L V8 Diesel', transmission: 'Auto', seats: 8, rating: 4.9, reviews: 2345, year: 2024, fuelType: 'Diesel' },
        { id: 40, name: 'Jeep Wrangler', brand: 'Jeep', image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800', price: 75000, engine: '2.0L Turbo', transmission: 'Auto', seats: 4, rating: 4.7, reviews: 1876, year: 2024, fuelType: 'Petrol' },
        { id: 41, name: 'Land Rover Defender', brand: 'Land Rover', image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800', price: 95000, engine: '3.0L V6', transmission: 'Auto', seats: 5, rating: 4.8, reviews: 987, year: 2024, fuelType: 'Petrol' },
        { id: 42, name: 'Suzuki Jimny', brand: 'Suzuki', image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800', price: 30000, engine: '1.5L', transmission: 'Manual', seats: 4, rating: 4.5, reviews: 3456, year: 2024, fuelType: 'Petrol' }
    ];
}

// ========== DISPLAY CARS FUNCTION ==========

function displayCars() {
    const carsGrid = document.getElementById('carsGrid');
    if (!carsGrid) return;
    
    // Force reload cars from database
    let cars = JSON.parse(localStorage.getItem('rentalx_cars') || '[]');
    
    // If less than 20 cars, reset database
    if (cars.length < 20) {
        cars = getAllCars();
        localStorage.setItem('rentalx_cars', JSON.stringify(cars));
        showToast(`Database reset! ${cars.length} cars loaded.`, 'success');
    }
    
    const wishlist = getWishlist();
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    
    // Apply filters
    const minPrice = document.getElementById('filterMinPrice')?.value;
    const maxPrice = document.getElementById('filterMaxPrice')?.value;
    const seats = document.getElementById('filterSeats')?.value;
    const transmission = document.getElementById('filterTransmission')?.value;
    const search = document.getElementById('filterSearch')?.value?.toLowerCase();
    const fuelType = document.getElementById('filterFuel')?.value;
    const brand = document.getElementById('filterBrand')?.value;
    
    let filteredCars = [...cars];
    
    if (minPrice) filteredCars = filteredCars.filter(c => c.price >= parseInt(minPrice));
    if (maxPrice) filteredCars = filteredCars.filter(c => c.price <= parseInt(maxPrice));
    if (seats) filteredCars = filteredCars.filter(c => c.seats >= parseInt(seats));
    if (transmission && transmission !== '') filteredCars = filteredCars.filter(c => c.transmission === transmission);
    if (fuelType && fuelType !== '') filteredCars = filteredCars.filter(c => c.fuelType === fuelType);
    if (brand && brand !== '') filteredCars = filteredCars.filter(c => c.brand === brand);
    if (search) filteredCars = filteredCars.filter(c => c.name.toLowerCase().includes(search) || c.brand.toLowerCase().includes(search));
    
    // Update results count
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.innerHTML = `🚗 Found ${filteredCars.length} cars (Total: ${cars.length})`;
    }
    
    // Populate brand filter
    const uniqueBrands = [...new Set(cars.map(c => c.brand))];
    const brandFilter = document.getElementById('filterBrand');
    if (brandFilter && brandFilter.options.length <= 1) {
        brandFilter.innerHTML = '<option value="">Any</option>';
        uniqueBrands.forEach(b => {
            const option = document.createElement('option');
            option.value = b;
            option.textContent = b;
            brandFilter.appendChild(option);
        });
    }
    
    // Populate fuel filter
    const uniqueFuel = [...new Set(cars.map(c => c.fuelType))];
    const fuelFilter = document.getElementById('filterFuel');
    if (fuelFilter && fuelFilter.options.length <= 1) {
        fuelFilter.innerHTML = '<option value="">Any</option>';
        uniqueFuel.forEach(f => {
            const option = document.createElement('option');
            option.value = f;
            option.textContent = f;
            fuelFilter.appendChild(option);
        });
    }
    
    if (filteredCars.length === 0) {
        carsGrid.innerHTML = '<div class="text-center" style="grid-column: 1/-1; padding: 3rem;">🚗 No cars found matching your criteria</div>';
        return;
    }
    
    carsGrid.innerHTML = filteredCars.map(car => `
        <div class="premium-card">
            <button class="wishlist-btn ${wishlist.includes(car.id) ? 'active' : ''}" onclick="toggleWishlist(${car.id})">
                <i class="ri-heart-${wishlist.includes(car.id) ? 'fill' : 'line'}"></i>
            </button>
            <img src="${car.image}" class="car-image" onerror="this.src='https://via.placeholder.com/400x220?text=${car.name}'">
            <div class="car-info">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 class="car-title">${car.name}</h3>
                    <span class="car-year">${car.year}</span>
                </div>
                <div class="rating">
                    <div class="stars">${generateStars(car.rating)}</div>
                    <span>(${car.reviews} reviews)</span>
                </div>
                <div class="car-specs">
                    <span><i class="ri-settings-3-line"></i> ${car.transmission}</span>
                    <span><i class="ri-group-line"></i> ${car.seats} Seats</span>
                    <span><i class="ri-gas-station-line"></i> ${car.fuelType}</span>
                </div>
                <div class="car-price">${formatPrice(car.price)} <small>/ day</small></div>
                ${user ? 
                    `<button onclick="bookNow(${car.id})" class="btn btn-primary" style="width: 100%;">Book Now</button>` : 
                    `<button onclick="window.location.href='signin.html'" class="btn btn-primary" style="width: 100%;">Login to Book</button>`
                }
            </div>
        </div>
    `).join('');
}

function bookNow(carId) {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    if (!user) { showToast('Please login first', 'warning'); window.location.href = 'signin.html'; return; }
    window.location.href = `booking.html?car=${carId}`;
}

function addActivity(message, icon = 'information-line') {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    if (!user) return;
    let activities = JSON.parse(localStorage.getItem(`rentalx_activities_${user.email}`) || '[]');
    activities.unshift({ id: Date.now(), message, icon, timestamp: new Date().toISOString() });
    activities = activities.slice(0, 50);
    localStorage.setItem(`rentalx_activities_${user.email}`, JSON.stringify(activities));
}

// Force reset function (call this from console if needed)
function resetCarsDatabase() {
    const newCars = getAllCars();
    localStorage.setItem('rentalx_cars', JSON.stringify(newCars));
    showToast(`${newCars.length} cars loaded successfully!`, 'success');
    displayCars();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    displayCars();
    
    const filterIds = ['filterMinPrice', 'filterMaxPrice', 'filterSeats', 'filterTransmission', 'filterSearch', 'filterFuel', 'filterBrand'];
    filterIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.addEventListener('input', () => displayCars()); el.addEventListener('change', () => displayCars()); }
    });
    
    if (window.location.pathname.includes('dashboard.html')) {
        const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
        if (!user) window.location.href = 'signin.html';
    }
});