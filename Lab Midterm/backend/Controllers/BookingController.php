<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        // Return bookings for authenticated user
        return $request->user()->bookings()->with('car')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'pickup_date' => 'required|date',
            'return_date' => 'required|date|after_or_equal:pickup_date',
            'fullname' => 'required|string',
            'phone' => 'required|string',
            'license' => 'required|string',
            'emergency' => 'required|string',
        ]);

        $booking = $request->user()->bookings()->create($data);
        return response()->json($booking, 201);
    }
}
