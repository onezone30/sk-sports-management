<?php

use App\Models\Division;
use App\Models\Season;
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
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class, 'handler_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignIdFor(Season::class)
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignIdFor(Division::class)
                ->constrained()
                ->cascadeOnDelete();
            $table->string('name');
            $table->string('street')->nullable();
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
