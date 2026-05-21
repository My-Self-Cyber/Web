// ========== NOTIFICATION & LATE FEE SYSTEM ==========

// Initialize notification system on page load
document.addEventListener('DOMContentLoaded', () => {
    startNotificationSystem();
});

// Start the notification system
function startNotificationSystem() {
    console.log('✅ Notification system started');
    
    // Recalculate late fees immediately (in case page was closed)
    updateLateFees();
    
    // Check notifications immediately
    checkRentalNotifications();
    
    // Check every 30 minutes for new notifications
    setInterval(checkRentalNotifications, 30 * 60 * 1000);
    
    // Update late fees every 6 hours
    setInterval(updateLateFees, 6 * 60 * 60 * 1000);
    
    // Also update late fees every 1 minute for testing/demo purposes (optional)
    // setInterval(updateLateFees, 1 * 60 * 1000);
}

// Check and display notifications for late rentals
function checkRentalNotifications() {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    if (!user) return;
    
    const rentals = JSON.parse(localStorage.getItem('rentalx_rentals') || '[]');
    const userRentals = rentals.filter(r => r.userId === user.email && r.status === 'confirmed');
    const now = new Date();
    
    userRentals.forEach(rental => {
        const returnDate = new Date(rental.returnDate);
        const isLate = now > returnDate;
        
        if (isLate) {
            const notificationKey = `notification_${rental.id}`;
            const lastNotified = localStorage.getItem(notificationKey);
            
            // Show notification if not shown in the last 6 hours
            if (!lastNotified || (now - new Date(lastNotified)) > 6 * 60 * 60 * 1000) {
                const timeLate = getTimeLateText(returnDate, now);
                showNotification(`⚠️ Rental Late - ${rental.carName}`, 
                    `Your rental for ${rental.carName} is ${timeLate}. Late fees are being applied (Rs. 500 per 6 hours).`);
                
                localStorage.setItem(notificationKey, now.toISOString());
                logNotification(rental, 'LATE_RENTAL', `Car rental ${timeLate}`);
            }
        }
    });
}

// Get readable time late text
function getTimeLateText(returnDate, currentDate) {
    const diffMs = currentDate - returnDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} and ${diffHours} hour${diffHours > 1 ? 's' : ''} overdue`;
    } else {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} overdue`;
    }
}

// Update late fees for overdue rentals
function updateLateFees() {
    const rentals = JSON.parse(localStorage.getItem('rentalx_rentals') || '[]');
    let updated = false;
    const now = new Date();
    
    rentals = rentals.map(rental => {
        if (rental.status === 'confirmed') {
            const returnDate = new Date(rental.returnDate);
            const isLate = now > returnDate;
            
            if (isLate) {
                // Calculate hours late
                const hoursLate = Math.floor((now - returnDate) / (1000 * 60 * 60));
                
                // Late fee: Rs. 500 per 6 hours
                const latePeriods = Math.floor(hoursLate / 6);
                const lateFee = latePeriods * 500;
                
                if (!rental.lateFeeApplied) {
                    rental.lateFeeApplied = 0;
                }
                
                // Only update if new fee has been calculated
                if (lateFee > rental.lateFeeApplied) {
                    rental.lateFeeApplied = lateFee;
                    rental.total = (rental.subtotal || rental.carPrice * rental.days) + 
                                   rental.driverFee + 
                                   lateFee - 
                                   rental.discount;
                    rental.totalWithLateFee = rental.total;
                    updated = true;
                    
                    console.log(`💰 Late fee updated for rental ${rental.id}: Rs. ${lateFee}`);
                }
            }
        }
        return rental;
    });
    
    if (updated) {
        localStorage.setItem('rentalx_rentals', JSON.stringify(rentals));
        console.log('✅ Late fees updated');
        
        // Refresh dashboard display if it's open
        if (document.getElementById('rentalsList')) {
            const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
            if (user) {
                const allRentals = rentals.filter(r => r.userId === user.email);
                if (typeof displayBookings === 'function') {
                    displayBookings(allRentals);
                }
            }
        }
    }
}

// Show notification using toast (without changing UI)
function showNotification(title, message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = 'toast warning';
    notification.style.cssText = `
        min-width: 350px;
        background: linear-gradient(135deg, #ff9500, #ff6b6b);
        border-left: 4px solid #ff6b6b;
    `;
    notification.innerHTML = `
        <div style="display: flex; gap: 10px; align-items: flex-start;">
            <i class="ri-notification-2-line" style="font-size: 20px; flex-shrink: 0;"></i>
            <div>
                <strong style="display: block; margin-bottom: 5px;">${title}</strong>
                <span style="font-size: 0.9em;">${message}</span>
            </div>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Remove after 8 seconds
    setTimeout(() => notification.remove(), 8000);
}

// Log notification to history
function logNotification(rental, type, message) {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    if (!user) return;
    
    const notifications = JSON.parse(localStorage.getItem(`rentalx_notifications_${user.email}`) || '[]');
    
    notifications.unshift({
        id: Date.now(),
        rentalId: rental.id,
        carName: rental.carName,
        type: type,
        message: message,
        timestamp: new Date().toISOString(),
        read: false
    });
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
        notifications.pop();
    }
    
    localStorage.setItem(`rentalx_notifications_${user.email}`, JSON.stringify(notifications));
}

// Get unread notifications count
function getUnreadNotificationsCount() {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    if (!user) return 0;
    
    const notifications = JSON.parse(localStorage.getItem(`rentalx_notifications_${user.email}`) || '[]');
    return notifications.filter(n => !n.read).length;
}

// Mark notification as read
function markNotificationAsRead(notificationId) {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    if (!user) return;
    
    const notifications = JSON.parse(localStorage.getItem(`rentalx_notifications_${user.email}`) || '[]');
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
        notification.read = true;
        localStorage.setItem(`rentalx_notifications_${user.email}`, JSON.stringify(notifications));
    }
}

// Get all notifications for user
function getUserNotifications() {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    if (!user) return [];
    
    return JSON.parse(localStorage.getItem(`rentalx_notifications_${user.email}`) || '[]');
}

// Display late fee info in dashboard rental table
function displayLateFeeInfo(rental) {
    if (rental.lateFeeApplied && rental.lateFeeApplied > 0) {
        return `<span style="color: var(--danger); font-weight: bold;">+Rs. ${rental.lateFeeApplied}</span>`;
    }
    return '-';
}

// Clear all notifications for user
function clearAllNotifications() {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    if (!user) return;
    
    localStorage.removeItem(`rentalx_notifications_${user.email}`);
}

// Export functions for use in dashboard
window.notificationSystem = {
    checkRentalNotifications,
    updateLateFees,
    showNotification,
    getUserNotifications,
    getUnreadNotificationsCount,
    markNotificationAsRead,
    clearAllNotifications,
    displayLateFeeInfo
};

console.log('✅ Notification system loaded');
