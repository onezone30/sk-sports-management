<?php

use App\Enums\ActiveStatus;
use App\Models\Player;
use App\Models\Season;
use App\Models\Sport;
use App\Models\Team;
use App\Models\Venue;
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
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Season::class)
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignIdFor(Team::class, 'home_team_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignIdFor(Team::class, 'away_team_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignIdFor(Venue::class)
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignIdFor(Player::class, 'player_of_the_game_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();
            $table->integer('home_score')->default(0);
            $table->integer('away_score')->default(0);
            $table->string('status')->default(ActiveStatus::INACTIVE->value);
            $table->dateTime('scheduled_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
