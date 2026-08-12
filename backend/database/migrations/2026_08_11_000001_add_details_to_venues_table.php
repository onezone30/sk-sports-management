<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('venues', function (Blueprint $table) {
            $table->dropColumn('address');
            $table->string('address_line')->nullable()->after('name');
            $table->string('city')->nullable()->after('address_line');
            $table->string('state')->nullable()->after('city');
            $table->string('zip')->nullable()->after('state');
            $table->unsignedInteger('capacity')->nullable()->after('zip');
            $table->string('status')->default('active')->after('capacity');
            $table->text('description')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('venues', function (Blueprint $table) {
            $table->dropColumn(['address_line', 'city', 'state', 'zip', 'capacity', 'status', 'description']);
            $table->string('address')->nullable();
        });
    }
};
