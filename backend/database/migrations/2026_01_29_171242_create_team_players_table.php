<?php

use App\Enums\ActiveStatus;
use App\Models\Player;
use App\Models\Team;
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
        Schema::create('team_players', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Player::class)
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignIdFor(Team::class)
                ->constrained()
                ->cascadeOnDelete();
            $table->string('jersey_number')->nullable();
            $table->string('position')->nullable();
            $table->boolean('is_captain')->default(false);
            $table->string('status')->default(ActiveStatus::ACTIVE->value);
            $table->unique(['player_id', 'team_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_players');
    }
};
