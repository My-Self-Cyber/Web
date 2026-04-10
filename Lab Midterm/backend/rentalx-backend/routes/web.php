<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->file(public_path('index.html'));
});

// Serve the frontend files directly when requested from Laravel root
Route::get('/{path}', function ($path) {
    $file = public_path($path);
    if (file_exists($file)) {
        return response()->file($file);
    }
    return response()->file(public_path('index.html'));
})->where('path', '.*');
