<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Car;

class CarController extends Controller
{
    public function index()
    {
        // Return all cars (in real app, paginate/filter)
        $cars = Car::all();
        return response()->json($cars);
    }
}
