// ========== BOOKING SYSTEM - COMPLETELY FIXED ==========

let selectedCar = null;
let selectedPayment = null;
let appliedPromo = null;
let subtotal = 0;
let total = 0;
let days = 0;

// Initialize booking page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Booking page loaded');
    
    const urlParams = new URLSearchParams(window.location.search);
    const carId = parseInt(urlParams.get('car'));
    
    if (!carId) {
        showToast('No car selected!', 'error');
        setTimeout(() => window.location.href = 'cars.html', 1500);
        return;
    }
    
    const cars = loadCars();
    selectedCar = cars.find(c => c.id === carId);
    
    if (!selectedCar) {
        showToast('Car not found!', 'error');
        setTimeout(() => window.location.href = 'cars.html', 1500);
        return;
    }
    
    // Display car summary
    displayCarSummary();
    
    // Set min dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pickupDate').min = today;
    document.getElementById('returnDate').min = today;
    
    // Add event listeners
    document.getElementById('pickupDate').addEventListener('change', calculateTotal);
    document.getElementById('returnDate').addEventListener('change', calculateTotal);
    document.getElementById('withDriver').addEventListener('change', calculateTotal);
    document.getElementById('applyPromoBtn').addEventListener('click', applyPromoCode);
    
    // Payment method selection
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            selectedPayment = this.dataset.method;
            console.log('Payment selected:', selectedPayment);
        });
    });
    
    // Booking form submit
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', confirmBooking);
        console.log('Form submit listener attached');
    } else {
        console.error('Booking form not found!');
    }
});

function displayCarSummary() {
    const container = document.getElementById('carSummary');
    if (container && selectedCar) {
        container.innerHTML = `
            <img src="${selectedCar.image}" style="width:120px; height:80px; border-radius:12px; object-fit:cover" onerror="this.src='https://via.placeholder.com/120x80?text=Car'">
            <div style="flex:1">
                <h3 style="margin-bottom:5px">${selectedCar.name}</h3>
                <div class="car-specs" style="margin:5px 0">
                    <span><i class="ri-settings-3-line"></i> ${selectedCar.transmission}</span>
                    <span><i class="ri-group-line"></i> ${selectedCar.seats} Seats</span>
                </div>
                <div class="car-price">${formatPrice(selectedCar.price)} <small>/ day</small></div>
            </div>
        `;
    }
}

function calculateTotal() {
    const pickupDate = document.getElementById('pickupDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const withDriver = document.getElementById('withDriver').checked;
    
    console.log('Calculating total - Pickup:', pickupDate, 'Return:', returnDate);
    
    if (!pickupDate || !returnDate) {
        document.getElementById('summaryDetails').innerHTML = '<p class="text-gray" style="padding:1rem; text-align:center">Please select pickup and return dates</p>';
        return;
    }
    
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days < 1) {
        showToast('Return date must be after pickup date', 'error');
        return;
    }
    
    subtotal = selectedCar.price * days;
    const driverFee = withDriver ? 2000 * days : 0;
    const discount = appliedPromo ? appliedPromo.discount : 0;
    total = subtotal + driverFee - discount;
    
    // Update summary display
    document.getElementById('summaryDetails').innerHTML = `
        <div style="margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span>Daily Rate:</span>
                <span>${formatPrice(selectedCar.price)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span>Number of Days:</span>
                <span><strong>${days}</strong> days</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-dim);">
                <span>Subtotal:</span>
                <span>${formatPrice(subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span><i class="ri-taxi-line"></i> Driver Fee:</span>
                <span>${formatPrice(driverFee)}</span>
            </div>
            ${discount > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: var(--success);">
                <span>Discount (${appliedPromo.code}):</span>
                <span>-${formatPrice(discount)}</span>
            </div>` : ''}
            <div style="display: flex; justify-content: space-between; padding: 12px 0; margin-top: 10px; border-top: 2px solid var(--accent); font-size: 1.2rem; font-weight: bold;">
                <span>Total Amount:</span>
                <span style="color: var(--accent);">${formatPrice(total)}</span>
            </div>
        </div>
    `;
}

function applyPromoCode() {
    const codeInput = document.getElementById('promoCode');
    const code = codeInput.value.toUpperCase();
    
    const promos = {
        'WELCOME500': { discount: 500, minSpend: 0, type: 'fixed' },
        'SAVE10': { discount: 10, minSpend: 10000, type: 'percent' },
        'RENTALX20': { discount: 20, minSpend: 20000, type: 'percent' },
        'WEEKEND': { discount: 1000, minSpend: 5000, type: 'fixed' }
    };
    
    const promo = promos[code];
    const promoMessage = document.getElementById('promoMessage');
    
    if (!promo) {
        promoMessage.innerHTML = '<span style="color: var(--danger);">❌ Invalid promo code</span>';
        appliedPromo = null;
        calculateTotal();
        return;
    }
    
    if (subtotal < promo.minSpend) {
        promoMessage.innerHTML = `<span style="color: var(--danger);">❌ Minimum spend of ${formatPrice(promo.minSpend)} required</span>`;
        appliedPromo = null;
        calculateTotal();
        return;
    }
    
    let discount = promo.type === 'percent' ? (subtotal * promo.discount / 100) : promo.discount;
    appliedPromo = { code, discount };
    promoMessage.innerHTML = `<span style="color: var(--success);">✅ Promo applied! You saved ${formatPrice(discount)}</span>`;
    calculateTotal();
}

function confirmBooking(event) {
    event.preventDefault();
    console.log('Confirm booking called');
    
    const pickupDate = document.getElementById('pickupDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const withDriver = document.getElementById('withDriver').checked;
    const notes = document.getElementById('notes').value;
    
    // Validation
    if (!pickupDate || !returnDate) {
        showToast('Please select pickup and return dates', 'error');
        return;
    }
    
    if (days < 1) {
        showToast('Please select valid dates', 'error');
        return;
    }
    
    if (!selectedPayment) {
        showToast('Please select a payment method', 'warning');
        return;
    }
    
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    if (!user) {
        showToast('Please login first', 'warning');
        window.location.href = 'signin.html';
        return;
    }
    
    // Create booking object
    const booking = {
        id: Date.now(),
        carId: selectedCar.id,
        carName: selectedCar.name,
        carPrice: selectedCar.price,
        userId: user.email,
        userName: user.name,
        days: days,
        pickupDate: pickupDate,
        returnDate: returnDate,
        withDriver: withDriver,
        subtotal: subtotal,
        driverFee: withDriver ? 2000 * days : 0,
        discount: appliedPromo ? appliedPromo.discount : 0,
        total: total,
        paymentMethod: selectedPayment,
        notes: notes,
        status: 'confirmed',
        bookingDate: new Date().toISOString(),
        promoCode: appliedPromo ? appliedPromo.code : null
    };
    
    console.log('Saving booking:', booking);
    
    // Save to localStorage
    let bookings = JSON.parse(localStorage.getItem('rentalx_rentals') || '[]');
    bookings.push(booking);
    localStorage.setItem('rentalx_rentals', JSON.stringify(bookings));
    
    // Save payment transaction
    let payments = JSON.parse(localStorage.getItem('rentalx_payments') || '[]');
    payments.push({
        id: Date.now(),
        bookingId: booking.id,
        userId: user.email,
        amount: total,
        method: selectedPayment,
        status: 'completed',
        date: new Date().toISOString(),
        transactionId: 'TXN' + Date.now()
    });
    localStorage.setItem('rentalx_payments', JSON.stringify(payments));
    
    // Add loyalty points (10 points per 1000 spent)
    const pointsEarned = Math.floor(total / 100);
    let currentPoints = JSON.parse(localStorage.getItem(`rentalx_loyalty_${user.email}`) || '0');
    currentPoints += pointsEarned;
    localStorage.setItem(`rentalx_loyalty_${user.email}`, currentPoints);
    
    // Add activity
    addActivity(`Booked ${selectedCar.name} for ${days} days (${formatPrice(total)})`, 'calendar-check-line');
    
    showToast(`✅ Booking confirmed! You earned ${pointsEarned} loyalty points!`, 'success');
    
    // Generate and show invoice
    generateInvoice(booking);
}

function generateInvoice(booking) {
    const invoiceHTML = `
        <div class="invoice" id="invoicePrint">
            <div class="invoice-header">
                <h2>🚗 RentalX</h2>
                <p>Premium Car Rental Pakistan</p>
                <p>Invoice #: ${booking.id}</p>
                <p>Date: ${new Date(booking.bookingDate).toLocaleString()}</p>
            </div>
            <div class="invoice-details" style="margin: 20px 0;">
                <h3>Booking Details</h3>
                <p><strong>Customer:</strong> ${booking.userName}</p>
                <p><strong>Email:</strong> ${booking.userId}</p>
                <p><strong>Car:</strong> ${booking.carName}</p>
                <p><strong>Pickup Date:</strong> ${new Date(booking.pickupDate).toLocaleDateString()}</p>
                <p><strong>Return Date:</strong> ${new Date(booking.returnDate).toLocaleDateString()}</p>
                <p><strong>Duration:</strong> ${booking.days} days</p>
                ${booking.withDriver ? '<p><strong>Driver:</strong> Included (+Rs. 2,000/day)</p>' : '<p><strong>Driver:</strong> Self-drive</p>'}
                ${booking.promoCode ? `<p><strong>Promo Code:</strong> ${booking.promoCode}</p>` : ''}
            </div>
            <div class="invoice-total" style="text-align: right; border-top: 2px solid #ddd; padding-top: 15px; margin-top: 15px;">
                <p>Subtotal: ${formatPrice(booking.subtotal)}</p>
                ${booking.driverFee > 0 ? `<p>Driver Fee: ${formatPrice(booking.driverFee)}</p>` : ''}
                ${booking.discount > 0 ? `<p>Discount: -${formatPrice(booking.discount)}</p>` : ''}
                <h3>Total Paid: ${formatPrice(booking.total)}</h3>
                <p>Payment Method: ${booking.paymentMethod.toUpperCase()}</p>
                <p>Status: ✅ PAID</p>
            </div>
            <div style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd;">
                <p>Thank you for choosing RentalX!</p>
                <p>For support: support@rentalx.com | +92 300 1234567</p>
            </div>
        </div>
    `;
    
    const modal = document.getElementById('invoiceModal');
    const content = document.getElementById('invoiceContent');
    if (content) content.innerHTML = invoiceHTML;
    if (modal) modal.classList.add('active');
}

function closeInvoice() {
    const modal = document.getElementById('invoiceModal');
    if (modal) modal.classList.remove('active');
    window.location.href = 'dashboard.html';
}

function downloadInvoice() {
    const invoiceContent = document.getElementById('invoiceContent').innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
        <html>
            <head>
                <title>RentalX Invoice</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 2rem; }
                    .invoice { max-width: 800px; margin: 0 auto; }
                    .invoice-header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 1rem; }
                    .invoice-details { margin: 1rem 0; }
                    .invoice-total { text-align: right; border-top: 2px solid #333; padding-top: 1rem; margin-top: 1rem; }
                </style>
            </head>
            <body>${invoiceContent}</body>
        </html>
    `);
    win.print();
}