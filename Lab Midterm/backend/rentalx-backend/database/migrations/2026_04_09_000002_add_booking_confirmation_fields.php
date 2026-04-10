<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('bookings', function (Blueprint $table) {
            if (!Schema::hasColumn('bookings', 'confirmation_token')) {
                $table->string('confirmation_token', 64)->nullable()->unique()->after('emergency');
            }

            if (!Schema::hasColumn('bookings', 'confirmed_at')) {
                $table->timestamp('confirmed_at')->nullable()->after('confirmation_token');
            }
        });
    }

    public function down()
    {
        Schema::table('bookings', function (Blueprint $table) {
            if (Schema::hasColumn('bookings', 'confirmed_at')) {
                $table->dropColumn('confirmed_at');
            }
            if (Schema::hasColumn('bookings', 'confirmation_token')) {
                $table->dropColumn('confirmation_token');
            }
        });
    }
};
