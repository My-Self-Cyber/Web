<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_id',
        'pickup_date',
        'return_date',
        'pickup_location',
        'dropoff_location',
        'fullname',
        'phone',
        'license',
        'emergency',
        'confirmation_token',
        'confirmed_at',
        'status',
        'employee_id',
        'pickup_time',
        'returned_at',
        'late_fee',
    ];

    protected $casts = [
        'pickup_date' => 'date',
        'return_date' => 'date',
        'pickup_time' => 'datetime',
        'returned_at' => 'datetime',
        'confirmed_at' => 'datetime',
        'late_fee' => 'decimal:2',
    ];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
