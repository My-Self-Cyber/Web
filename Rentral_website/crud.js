// Modal functions
function openModal(car = null) {
    const modal = document.getElementById('carModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (car) {
        modalTitle.innerText = 'Edit Car';
        document.getElementById('carId').value = car.id;
        document.getElementById('carName').value = car.name;
        document.getElementById('carBrand').value = car.brand;
        document.getElementById('carImage').value = car.image;
        document.getElementById('carPrice').value = car.price;
        document.getElementById('carEngine').value = car.engine;
        document.getElementById('carTransmission').value = car.transmission;
        document.getElementById('carSeats').value = car.seats;
    } else {
        modalTitle.innerText = 'Add New Car';
        document.getElementById('carForm').reset();
        document.getElementById('carId').value = '';
    }
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('carModal').classList.remove('active');
}

// Add/Edit Car
document.getElementById('carForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const carId = document.getElementById('carId').value;
    const carData = {
        name: document.getElementById('carName').value,
        brand: document.getElementById('carBrand').value,
        image: document.getElementById('carImage').value || 'https://via.placeholder.com/400x220?text=Car',
        price: parseInt(document.getElementById('carPrice').value),
        engine: document.getElementById('carEngine').value,
        transmission: document.getElementById('carTransmission').value,
        seats: parseInt(document.getElementById('carSeats').value)
    };
    
    let cars = JSON.parse(localStorage.getItem('rentalx_cars') || '[]');
    
    if (carId) {
        // Edit existing car
        const index = cars.findIndex(c => c.id == carId);
        if (index !== -1) {
            cars[index] = { ...cars[index], ...carData };
        }
    } else {
        // Add new car
        const newId = Math.max(...cars.map(c => c.id), 0) + 1;
        cars.push({ id: newId, ...carData });
    }
    
    localStorage.setItem('rentalx_cars', JSON.stringify(cars));
    closeModal();
    displayCars();
    alert('Car saved successfully!');
});

// Edit car
function editCar(id) {
    const cars = loadCars();
    const car = cars.find(c => c.id === id);
    if (car) openModal(car);
}

// Delete car
function deleteCar(id) {
    if (confirm('Are you sure you want to delete this car?')) {
        let cars = JSON.parse(localStorage.getItem('rentalx_cars') || '[]');
        cars = cars.filter(c => c.id !== id);
        localStorage.setItem('rentalx_cars', JSON.stringify(cars));
        displayCars();
        alert('Car deleted successfully!');
    }
}

// Add Car button listener
document.getElementById('addCarBtn')?.addEventListener('click', () => openModal(null));

// Close modal on outside click
window.onclick = (e) => {
    const modal = document.getElementById('carModal');
    if (e.target === modal) closeModal();
};