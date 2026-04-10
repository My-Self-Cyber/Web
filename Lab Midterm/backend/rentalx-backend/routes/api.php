<?php
// routes/api.php (template)

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\BookingController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/cars', [CarController::class, 'index']);
Route::get('/bookings/confirm/{token}', [BookingController::class, 'confirm']);

Route::middleware('auth:sanctum')->group(function() {
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);

    Route::post('/admin/users/employee', [AuthController::class, 'createEmployee']);

    // Admin-only booking management
    Route::post('/admin/bookings/{id}/accept', [BookingController::class, 'adminAccept']);
    Route::post('/admin/bookings/{id}/reject', [BookingController::class, 'adminReject']);
    Route::post('/admin/bookings/{id}/assign', [BookingController::class, 'adminAssignEmployee']);
    Route::put('/admin/bookings/{id}', [BookingController::class, 'adminUpdate']);
    Route::delete('/admin/bookings/{id}', [BookingController::class, 'adminDelete']);

    // Employee booking actions
    Route::get('/employee/bookings', [BookingController::class, 'index']);
    Route::post('/employee/bookings/{id}/pickup', [BookingController::class, 'employeePickup']);
    Route::post('/employee/bookings/{id}/return', [BookingController::class, 'employeeReturn']);
});