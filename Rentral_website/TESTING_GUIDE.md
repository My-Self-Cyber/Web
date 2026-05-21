# 🧪 NOTIFICATION SYSTEM - TESTING GUIDE

## Quick Start Testing (5 minutes)

### Step 1: Create a Test Booking
1. Open the website and login (or create a test account)
2. Go to **Cars** page
3. Select any car and click "Book Now"
4. **Important**: Set **Return Date = TODAY or YESTERDAY**
5. Complete booking and confirm payment

### Step 2: Navigate to Dashboard
1. Go to **Dashboard**
2. You will immediately see a notification: "⚠️ Rental Late - [Car Name]"
3. Check the **Rental History** table
4. In the **Late Fee** column, you'll see the current late fees

### Step 3: Monitor Fee Increases
- **Immediately**: Late fees calculated and shown
- **After 6 hours**: Late fees increase by Rs. 500
- **After 12 hours**: Late fees = Rs. 1,000
- **After 18 hours**: Late fees = Rs. 1,500
- And so on...

---

## Testing Scenarios

### ✅ Test 1: Immediate Late Rental Detection
```
Booking Details:
- Pickup Date: 2 days ago
- Return Date: Yesterday

Expected Result:
✓ Notification appears on page load
✓ "Late Fee" column shows positive amount (Rs. 500, 1000, etc.)
✓ Toast notification displays with warning icon
```

### ✅ Test 2: Notification Persistence
```
Setup:
1. Create late rental (return date = yesterday)
2. Close and reopen browser/page
3. Go to Dashboard

Expected Result:
✓ Late fees recalculated on page load
✓ Dashboard automatically updated
✓ Notification appears again
```

### ✅ Test 3: Multiple Rentals
```
Setup:
1. Create 2-3 bookings:
   - Booking A: Return date = yesterday (late)
   - Booking B: Return date = tomorrow (on time)
   - Booking C: Return date = today (borderline)

Expected Result:
✓ Only Booking A shows late fees
✓ Bookings B & C show "-" in Late Fee column
✓ Only Booking A gets notification
```

### ✅ Test 4: Fee Progression Over Time
```
Setup:
1. Create booking with return date = 1 day ago
2. Manually check browser console

Expected Calculation:
- Hours late = (current time - return date) / 1000 / 60 / 60
- Late periods = Math.floor(hours / 6)
- Late fee = periods × 500

Example:
- 6 hours late → Rs. 500
- 7 hours late → Rs. 500 (rounds down)
- 12 hours late → Rs. 1,000
- 18 hours late → Rs. 1,500
- 24 hours late → Rs. 2,000
```

---

## Checking Console Logs

Press **F12** to open Developer Tools, go to **Console** tab:

You'll see messages like:
```
✅ Notification system started
💰 Late fee updated for rental 1700000000000: Rs. 500
✅ Late fees updated
```

---

## Checking Stored Data

In Browser Console, run:

```javascript
// View all rentals with late fees
const rentals = JSON.parse(localStorage.getItem('rentalx_rentals'));
rentals.forEach(r => console.log(`${r.carName}: Late Fee = ${r.lateFeeApplied || 0}`));

// View notification history for current user
const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
const notifications = JSON.parse(localStorage.getItem(`rentalx_notifications_${user.email}`));
console.log(notifications);

// Check late fee calculation
const rental = rentals[0];
const returnDate = new Date(rental.returnDate);
const now = new Date();
const hoursLate = Math.floor((now - returnDate) / (1000 * 60 * 60));
const lateFee = Math.floor(hoursLate / 6) * 500;
console.log(`Hours late: ${hoursLate}, Calculated fee: ${lateFee}`);
```

---

## Customization Options

### Change Late Fee Amount
In `notifications.js`, line ~73:
```javascript
// Late fee: Rs. 500 per 6 hours
const lateFee = latePeriods * 500;  // Change 500 to desired amount
```

### Change Check Frequency
In `notifications.js`, line ~23:
```javascript
// Check every 30 minutes (1800000 ms)
setInterval(checkRentalNotifications, 30 * 60 * 1000);  // Change 30 to desired minutes
```

### Change Late Fee Update Interval
In `notifications.js`, line ~26:
```javascript
// Update every 6 hours (21600000 ms)
setInterval(updateLateFees, 6 * 60 * 60 * 1000);  // Change 6 to desired hours
```

### Enable Faster Testing (1 minute checks)
Uncomment line ~29 and comment out line ~26:
```javascript
// Test mode: check every 1 minute
setInterval(updateLateFees, 1 * 60 * 1000);
```

---

## UI Changes Made

### Dashboard Table - New Column
```
Before: Car | Pickup | Return | Days | Total | Status | Action
After:  Car | Pickup | Return | Days | Total | Late Fee | Status | Action
                                              ↑
                                           NEW
```

### Notification Appearance
- Location: Top-right corner (toast notification)
- Color: Orange/Red gradient with warning icon
- Duration: Appears for 8 seconds
- Message: "⚠️ Rental Late - [Car Name]" + details

---

## Troubleshooting

### Notification Not Appearing?
1. Check console for errors (F12)
2. Verify rental return date is in the past
3. Confirm user is logged in
4. Clear browser cache and reload

### Late Fees Not Showing?
1. Refresh the Dashboard page
2. Check browser console (F12 → Console tab)
3. Run: `JSON.parse(localStorage.getItem('rentalx_rentals')).forEach(r => console.log(r.lateFeeApplied))`

### Total Amount Not Updated?
1. Booking total should be: `subtotal + driverFee + lateFee - discount`
2. Check in Dashboard table "Total" column
3. Late fees are added, not subtracted

---

## Files to Test

1. **index.html** → Dashboard → View notifications on page load
2. **booking.html** → Create new booking with past return date
3. **dashboard.html** → Main testing location, see late fees in table
4. **cars.html** → Browse cars before booking
5. **notifications.js** → Core system, check console logs

---

## Success Indicators ✅

- [ ] Notification toast appears when rental is late
- [ ] "Late Fee" column visible in Dashboard table
- [ ] Late fees calculate correctly (Rs. 500 per 6 hours)
- [ ] Total amount includes late fees
- [ ] Dashboard updates in real-time
- [ ] System remembers late fees after page reload
- [ ] Notification history saved in localStorage
- [ ] No UI layout changes/breaks
