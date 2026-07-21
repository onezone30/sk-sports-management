<?php

use App\Enums\ActiveStatus;
use App\Models\Sport;
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
        Schema::create('divisions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Sport::class)
                ->constrained()
                ->cascadeOnDelete();
            $table->string('name');
            $table->integer('min_age');
            $table->integer('max_age');
            $table->string('gender_requirement')->nullable();
            $table->string('status')->default(ActiveStatus::ACTIVE->value);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('divisions');
    }
};
