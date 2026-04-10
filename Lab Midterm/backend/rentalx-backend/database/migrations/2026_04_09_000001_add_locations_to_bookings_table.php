<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('bookings', function (Blueprint $table) {
            if (!Schema::hasColumn('bookings', 'pickup_location')) {
                $table->string('pickup_location')->after('return_date');
            }
            if (!Schema::hasColumn('bookings', 'dropoff_location')) {
                $table->string('dropoff_location')->after('pickup_location');
            }
        });
    }

    public function down()
    {
        Schema::table('bookings', function (Blueprint $table) {
            if (Schema::hasColumn('bookings', 'dropoff_location')) {
                $table->dropColumn('dropoff_location');
            }
            if (Schema::hasColumn('bookings', 'pickup_location')) {
                $table->dropColumn('pickup_location');
            }
        });
    }
};
