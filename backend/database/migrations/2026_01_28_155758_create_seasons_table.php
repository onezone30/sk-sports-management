<?php

use App\Enums\ActiveStatus;
use App\Models\Sport;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('seasons', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Sport::class)
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignIdFor(User::class, 'handler_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->year('year')->unique();
            $table->string('status')->default(ActiveStatus::ACTIVE->value);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seasons');
    }
};
