<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('users.index');
});

Route::resource('users', UserController::class);
Route::get('/users/search', [UserController::class, 'search'])->name('users.search');

Route::get('/ping', function() {
    return 'PONG! Server is working!';
});