<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Booking;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    public const ROLE_CUSTOMER = 'customer';
    public const ROLE_EMPLOYEE = 'employee';
    public const ROLE_ADMIN = 'admin';

    protected $fillable = ['name', 'email', 'password', 'role'];

    protected $hidden = ['password'];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function assignedBookings()
    {
        return $this->hasMany(Booking::class, 'employee_id');
    }

    public function isAdmin()
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isEmployee()
    {
        return $this->role === self::ROLE_EMPLOYEE;
    }
}
