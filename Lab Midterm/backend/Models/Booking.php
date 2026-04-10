<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = ['car_id','pickup_date','return_date','fullname','phone','license','emergency'];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }
}
