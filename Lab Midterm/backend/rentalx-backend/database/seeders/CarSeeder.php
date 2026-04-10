<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CarSeeder extends Seeder
{
    public function run()
    {
        DB::table('cars')->insert([
            [
                'name' => 'Toyota Corolla',
                'daily_rate' => 8000,
                'transmission' => 'Automatic',
                'fuel' => 'Petrol',
                'seats' => 5,
                'description' => 'Reliable family sedan',
                'image' => 'corolla.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Honda Civic',
                'daily_rate' => 10000,
                'transmission' => 'Manual',
                'fuel' => 'Petrol',
                'seats' => 5,
                'description' => 'Stylish and comfortable',
                'image' => 'civic.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Hyundai Tucson',
                'daily_rate' => 15000,
                'transmission' => 'Automatic',
                'fuel' => 'Diesel',
                'seats' => 5,
                'description' => 'Spacious SUV',
                'image' => 'hyundai.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
