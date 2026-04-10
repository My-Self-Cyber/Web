<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('customer')->after('password');
            }
        });

        Schema::table('bookings', function (Blueprint $table) {
            if (!Schema::hasColumn('bookings', 'status')) {
                $table->string('status')->default('pending_confirmation')->after('confirmation_token');
            }
            if (!Schema::hasColumn('bookings', 'employee_id')) {
                $table->foreignId('employee_id')->nullable()->constrained('users')->nullOnDelete()->after('status');
            }
            if (!Schema::hasColumn('bookings', 'pickup_time')) {
                $table->dateTime('pickup_time')->nullable()->after('dropoff_location');
            }
            if (!Schema::hasColumn('bookings', 'returned_at')) {
                $table->dateTime('returned_at')->nullable()->after('pickup_time');
            }
            if (!Schema::hasColumn('bookings', 'late_fee')) {
                $table->decimal('late_fee', 10, 2)->default(0)->after('returned_at');
            }
        });
    }

    public function down()
    {
        Schema::table('bookings', function (Blueprint $table) {
            if (Schema::hasColumn('bookings', 'late_fee')) {
                $table->dropColumn('late_fee');
            }
            if (Schema::hasColumn('bookings', 'returned_at')) {
                $table->dropColumn('returned_at');
            }
            if (Schema::hasColumn('bookings', 'pickup_time')) {
                $table->dropColumn('pickup_time');
            }
            if (Schema::hasColumn('bookings', 'employee_id')) {
                $table->dropForeign(['employee_id']);
                $table->dropColumn('employee_id');
            }
            if (Schema::hasColumn('bookings', 'status')) {
                $table->dropColumn('status');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
        });
    }
};
