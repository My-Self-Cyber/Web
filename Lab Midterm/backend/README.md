Laravel Backend Scaffold for RentalX

This folder contains a minimal Laravel scaffold (templates) and instructions to set up a proper Laravel backend locally. It provides API endpoints for:
- User registration & login (token-based via Laravel Sanctum)
- List cars
- Create bookings

Requirements (local machine):
- PHP 8.0+
- Composer
- MySQL or SQLite
- Node (optional for frontend build)

Quick setup (recommended):
1. Open terminal in this folder and run:

```bash
# from project root
cd backend
composer create-project laravel/laravel rentalx-backend
cd rentalx-backend
```

2. Configure `.env` for DB (MySQL or use `DB_CONNECTION=sqlite` and create `database/database.sqlite`).
3. Require Sanctum for API tokens:

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

4. Copy the provided `routes/api.php`, controllers and migrations from this scaffold into your Laravel app (or use the files as reference).
5. Run migrations:

```bash
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

6. Use the API endpoints (examples below) from frontend `fetch` calls.

API Endpoints (example):
- POST /api/register {name,email,password}
- POST /api/login {email,password} -> returns token
- GET /api/cars -> list cars
- POST /api/bookings (authenticated) {car_id,pickup_date,return_date,fullname,phone,license,emergency}

Frontend example (use in `main.js` or auth flow):
```js
// login example
fetch('/api/login', {
  method: 'POST',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({email, password})
}).then(r=>r.json()).then(data => {
  localStorage.setItem('rentalx_token', data.token);
});

// auth fetch with token
const token = localStorage.getItem('rentalx_token');
fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify(bookingData)
});
```

Notes:
- The code in this folder are templates. To run a production-ready backend follow Laravel docs and secure the app (HTTPS, validation, rate-limits).
- If you want, I can attempt to run `composer create-project` and install a Laravel app locally, but that requires Composer/PHP on this machine. I can instead generate the full file tree for you to paste into a Laravel project.
