# Venue CRUD + Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build full CRUD for `Venue` (backend + frontend) mirroring the existing `User` feature, plus a venue image gallery (up to 8 images, one primary) reusing the dormant polymorphic `attachments` table.

**Architecture:** Backend follows `Controller → Service → Repository → Model` (single-domain, per `backend/CLAUDE.md`). Frontend follows Feature-Sliced Design mirroring `entities/user` + `features/users` + `pages/users`. Images upload to the local `public` disk; `Attachment` rows track them via polymorphic `attachable`.

**Tech Stack:** Laravel 12 / PHP 8.2, Sanctum, SQLite (test), PHPUnit 11. React 19 + TS, TanStack Query/Table, shadcn/ui, Axios.

## Global Constraints

- Player model: **out of scope**. Do not touch `app/Models/Player.php`, its controller, or any player-related code in this plan.
- Image cap: **8 images per venue**, enforced in `VenueService`, not the DB or FormRequest.
- Exactly one image may have `is_primary = true` per venue at a time.
- Images stored on the local `public` disk (`Storage::disk('public')`). `FILESYSTEM_DISK` env stays `local`; disk is targeted explicitly per call.
- Mutating venue/image routes (`store`/`update`/`destroy`, all image endpoints) are gated `role:Admin`, identical to `users`. `index`/`show` are open to any signed-in user.
- Design source: `docs/superpowers/specs/2026-08-11-venue-crud-design.md`.
- No new npm dependency for the image dropzone — build it with a plain `<input type="file">`, no drag-and-drop library.

---

## Task 1: Venue schema, models, factory, seeder

**Files:**
- Create: `backend/database/migrations/2026_08_11_000001_add_details_to_venues_table.php`
- Create: `backend/database/migrations/2026_08_11_000002_add_is_primary_to_attachments_table.php`
- Modify: `backend/app/Models/Venue.php`
- Modify: `backend/app/Models/Attachment.php`
- Modify: `backend/database/factories/VenueFactory.php`
- Modify: `backend/database/seeders/VenueSeeder.php`

**Interfaces:**
- Produces: `Venue::$fillable = ['name','address_line','city','state','zip','capacity','status','description']`, `Venue::casts()` → `status` cast to `App\Enums\Status`, `capacity` cast to `integer`, `Venue::images(): MorphMany` (ordered primary-first then by `id`, filtered to `type = 'image'`). `Attachment::$fillable` adds `'is_primary'`, `Attachment::casts()` → `is_primary` cast to `boolean`. Later tasks depend on these exact method/property names.

- [ ] **Step 1: Create the venues-alter migration**

```php
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
```

Save as `backend/database/migrations/2026_08_11_000001_add_details_to_venues_table.php`.

- [ ] **Step 2: Create the attachments is_primary migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attachments', function (Blueprint $table) {
            $table->boolean('is_primary')->default(false)->after('url');
        });
    }

    public function down(): void
    {
        Schema::table('attachments', function (Blueprint $table) {
            $table->dropColumn('is_primary');
        });
    }
};
```

Save as `backend/database/migrations/2026_08_11_000002_add_is_primary_to_attachments_table.php`.

- [ ] **Step 3: Run migrations and verify they apply cleanly**

Run (from `backend/`): `php artisan migrate`
Expected: both new migrations run with no errors.

- [ ] **Step 4: Update the Venue model**

Replace the full contents of `backend/app/Models/Venue.php`:

```php
<?php

namespace App\Models;

use App\Enums\Status;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address_line',
        'city',
        'state',
        'zip',
        'capacity',
        'status',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'status' => Status::class,
            'capacity' => 'integer',
        ];
    }

    public function games(): HasMany
    {
        return $this->hasMany(Game::class);
    }

    public function images(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable')
            ->where('type', 'image')
            ->orderByDesc('is_primary')
            ->orderBy('id');
    }
}
```

- [ ] **Step 5: Update the Attachment model**

Replace the full contents of `backend/app/Models/Attachment.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $fillable = [
        'name',
        'attachable_id',
        'attachable_type',
        'type',
        'size',
        'extension',
        'url',
        'uploaded_by',
        'is_primary',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    public function attachable()
    {
        return $this->morphTo();
    }
}
```

- [ ] **Step 6: Update VenueFactory**

Replace the full contents of `backend/database/factories/VenueFactory.php`:

```php
<?php

namespace Database\Factories;

use App\Enums\Status;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Venue>
 */
class VenueFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->company(),
            'address_line' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'state' => $this->faker->state(),
            'zip' => $this->faker->postcode(),
            'capacity' => $this->faker->numberBetween(100, 20000),
            'status' => Status::ACTIVE,
            'description' => $this->faker->optional()->sentence(),
        ];
    }
}
```

- [ ] **Step 7: Update VenueSeeder**

Replace the full contents of `backend/database/seeders/VenueSeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Enums\Status;
use App\Models\Venue;
use Illuminate\Database\Seeder;

class VenueSeeder extends Seeder
{
    public function run(): void
    {
        Venue::create(['name' => 'Central Stadium', 'address_line' => '123 Main St', 'city' => 'Springfield', 'state' => 'IL', 'zip' => '62701', 'capacity' => 15000, 'status' => Status::ACTIVE]);
        Venue::create(['name' => 'North Arena', 'address_line' => '45 North Ave', 'city' => 'Springfield', 'state' => 'IL', 'zip' => '62702', 'capacity' => 8000, 'status' => Status::ACTIVE]);
        Venue::create(['name' => 'South Park Sports Complex', 'address_line' => '789 South Park Rd', 'city' => 'Springfield', 'state' => 'IL', 'zip' => '62703', 'capacity' => 5000, 'status' => Status::ACTIVE]);
        Venue::create(['name' => 'City Basketball Hall', 'address_line' => '10 Hall St', 'city' => 'Springfield', 'state' => 'IL', 'zip' => '62704', 'capacity' => 3000, 'status' => Status::ACTIVE]);
        Venue::create(['name' => 'Olympic Venue', 'address_line' => '1 Olympic Way', 'city' => 'Springfield', 'state' => 'IL', 'zip' => '62705', 'capacity' => 40000, 'status' => Status::ACTIVE]);
    }
}
```

- [ ] **Step 8: Verify with a fresh migrate+seed**

Run: `php artisan migrate:fresh --seed`
Expected: no errors; `venues` table has 5 rows with the new columns populated.

- [ ] **Step 9: Commit**

```bash
git add backend/database/migrations/2026_08_11_000001_add_details_to_venues_table.php backend/database/migrations/2026_08_11_000002_add_is_primary_to_attachments_table.php backend/app/Models/Venue.php backend/app/Models/Attachment.php backend/database/factories/VenueFactory.php backend/database/seeders/VenueSeeder.php
git commit -m "feat: extend venue schema with address/capacity/status/description and image support"
```

---

## Task 2: Venue CRUD + image backend (Repository, Service, Requests, Resources, Controllers, Routes)

**Files:**
- Create: `backend/app/Exceptions/VenueImageLimitExceededException.php`
- Modify: `backend/bootstrap/app.php`
- Create: `backend/app/Repositories/Interfaces/VenueRepositoryInterface.php`
- Create: `backend/app/Repositories/Eloquent/EloquentVenueRepository.php`
- Modify: `backend/app/Providers/RepositoryServiceProvider.php`
- Create: `backend/app/Services/VenueService.php`
- Create: `backend/app/Http/Requests/StoreVenueRequest.php`
- Create: `backend/app/Http/Requests/UpdateVenueRequest.php`
- Create: `backend/app/Http/Requests/StoreVenueImageRequest.php`
- Create: `backend/app/Http/Resources/VenueResource.php`
- Create: `backend/app/Http/Resources/VenueImageResource.php`
- Create: `backend/app/Http/Controllers/VenueController.php`
- Create: `backend/app/Http/Controllers/VenueImageController.php`
- Modify: `backend/routes/api.php`
- Test: `backend/tests/Feature/VenueControllerTest.php`
- Test: `backend/tests/Feature/VenueImageControllerTest.php`

**Interfaces:**
- Consumes: `Venue` model/casts and `Attachment` model/casts from Task 1.
- Produces: `VenueService::getAll(int $perPage = 25)`, `::create(array $data, array $images = [], ?int $uploadedBy = null): Venue`, `::update(Venue $venue, array $data): Venue`, `::delete(Venue $venue): void`, `::addImage(Venue $venue, UploadedFile $file, ?int $uploadedBy = null): Attachment`, `::removeImage(Venue $venue, int $imageId): void`, `::setPrimaryImage(Venue $venue, int $imageId): Attachment`. Routes: `GET/POST /venues`, `GET/PUT/DELETE /venues/{venue}`, `POST /venues/{venue}/images`, `DELETE /venues/{venue}/images/{image}`, `PATCH /venues/{venue}/images/{image}/primary`. Frontend tasks (3-6) depend on these exact routes and the JSON shape from `VenueResource`/`VenueImageResource` below.

- [ ] **Step 1: Write VenueControllerTest.php**

```php
<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VenueControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $actingUser;

    protected function setUp(): void
    {
        parent::setUp();

        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $this->actingUser = User::factory()->create(['role_id' => $adminRole->id]);

        Storage::fake('public');
    }

    // --- index ---

    public function test_index_returns_list_of_venues(): void
    {
        Venue::factory()->count(3)->create();

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->getJson('/api/venues');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'address_line', 'city', 'state', 'zip', 'capacity', 'status' => ['value', 'label', 'variant'], 'description', 'images', 'created_at'],
                ],
                'links',
                'meta',
            ]);
    }

    public function test_index_returns_401_for_unauthenticated_request(): void
    {
        $this->getJson('/api/venues')->assertStatus(401);
    }

    // --- store ---

    public function test_store_creates_venue_and_returns_201(): void
    {
        $payload = [
            'name' => 'Central Stadium',
            'address_line' => '123 Main St',
            'city' => 'Springfield',
            'state' => 'IL',
            'zip' => '62701',
            'capacity' => 15000,
        ];

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/venues', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Central Stadium')
            ->assertJsonPath('data.city', 'Springfield');

        $this->assertDatabaseHas('venues', ['name' => 'Central Stadium', 'city' => 'Springfield']);
    }

    public function test_store_creates_venue_with_images(): void
    {
        $payload = [
            'name' => 'Central Stadium',
            'images' => [
                UploadedFile::fake()->image('cover.jpg'),
                UploadedFile::fake()->image('side.jpg'),
            ],
        ];

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/venues', $payload);

        $response->assertStatus(201)
            ->assertJsonCount(2, 'data.images')
            ->assertJsonPath('data.images.0.is_primary', true)
            ->assertJsonPath('data.images.1.is_primary', false);

        $this->assertDatabaseCount('attachments', 2);
    }

    public function test_store_fails_validation_with_missing_name(): void
    {
        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/venues', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_fails_validation_with_more_than_eight_images(): void
    {
        $images = collect(range(1, 9))->map(fn ($i) => UploadedFile::fake()->image("img{$i}.jpg"))->all();

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/venues', ['name' => 'Big Venue', 'images' => $images]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['images']);
    }

    public function test_store_fails_validation_with_non_image_file(): void
    {
        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/venues', [
                'name' => 'Central Stadium',
                'images' => [UploadedFile::fake()->create('doc.pdf', 100)],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['images.0']);
    }

    // --- show ---

    public function test_show_returns_venue_with_images(): void
    {
        $venue = Venue::factory()->create();

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->getJson("/api/venues/{$venue->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $venue->id);
    }

    public function test_show_returns_404_for_nonexistent_venue(): void
    {
        $this->actingAs($this->actingUser, 'sanctum')
            ->getJson('/api/venues/99999')
            ->assertStatus(404);
    }

    // --- update ---

    public function test_update_patches_venue_name(): void
    {
        $venue = Venue::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->patchJson("/api/venues/{$venue->id}", ['name' => 'New Name']);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'New Name');

        $this->assertDatabaseHas('venues', ['id' => $venue->id, 'name' => 'New Name']);
    }

    public function test_update_returns_404_for_nonexistent_venue(): void
    {
        $this->actingAs($this->actingUser, 'sanctum')
            ->patchJson('/api/venues/99999', ['name' => 'Whatever'])
            ->assertStatus(404);
    }

    // --- destroy ---

    public function test_destroy_deletes_venue_and_its_image_files(): void
    {
        $venue = Venue::factory()->create();
        $path = UploadedFile::fake()->image('cover.jpg')->store('venues', 'public');
        $venue->images()->create([
            'name' => 'cover.jpg',
            'type' => 'image',
            'extension' => 'jpg',
            'size' => '1000',
            'url' => $path,
            'is_primary' => true,
        ]);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->deleteJson("/api/venues/{$venue->id}");

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Venue deleted successfully');

        $this->assertDatabaseMissing('venues', ['id' => $venue->id]);
        $this->assertDatabaseMissing('attachments', ['attachable_id' => $venue->id, 'attachable_type' => Venue::class]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_destroy_returns_404_for_nonexistent_venue(): void
    {
        $this->actingAs($this->actingUser, 'sanctum')
            ->deleteJson('/api/venues/99999')
            ->assertStatus(404);
    }

    // --- authorization ---

    public function test_non_admin_cannot_create_a_venue(): void
    {
        $spectatorRole = Role::factory()->create(['name' => 'Spectator']);
        $nonAdmin = User::factory()->create(['role_id' => $spectatorRole->id]);

        $this->actingAs($nonAdmin, 'sanctum')
            ->postJson('/api/venues', ['name' => 'Central Stadium'])
            ->assertStatus(403);

        $this->assertDatabaseMissing('venues', ['name' => 'Central Stadium']);
    }

    public function test_non_admin_cannot_delete_a_venue(): void
    {
        $spectatorRole = Role::factory()->create(['name' => 'Spectator']);
        $nonAdmin = User::factory()->create(['role_id' => $spectatorRole->id]);
        $venue = Venue::factory()->create();

        $this->actingAs($nonAdmin, 'sanctum')
            ->deleteJson("/api/venues/{$venue->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('venues', ['id' => $venue->id]);
    }
}
```

- [ ] **Step 2: Write VenueImageControllerTest.php**

```php
<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VenueImageControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $actingUser;

    protected function setUp(): void
    {
        parent::setUp();

        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $this->actingUser = User::factory()->create(['role_id' => $adminRole->id]);

        Storage::fake('public');
    }

    public function test_store_uploads_image_and_marks_it_primary_when_first(): void
    {
        $venue = Venue::factory()->create();

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson("/api/venues/{$venue->id}/images", [
                'image' => UploadedFile::fake()->image('cover.jpg'),
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.is_primary', true);

        $this->assertDatabaseCount('attachments', 1);
    }

    public function test_store_does_not_mark_second_image_primary(): void
    {
        $venue = Venue::factory()->create();
        $venue->images()->create([
            'name' => 'first.jpg', 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
            'url' => 'venues/first.jpg', 'is_primary' => true,
        ]);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson("/api/venues/{$venue->id}/images", [
                'image' => UploadedFile::fake()->image('second.jpg'),
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.is_primary', false);
    }

    public function test_store_rejects_ninth_image(): void
    {
        $venue = Venue::factory()->create();
        for ($i = 0; $i < 8; $i++) {
            $venue->images()->create([
                'name' => "img{$i}.jpg", 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
                'url' => "venues/img{$i}.jpg", 'is_primary' => $i === 0,
            ]);
        }

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson("/api/venues/{$venue->id}/images", [
                'image' => UploadedFile::fake()->image('one_too_many.jpg'),
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'Maximum of 8 images per venue.');

        $this->assertDatabaseCount('attachments', 8);
    }

    public function test_destroy_deletes_image_and_file(): void
    {
        $venue = Venue::factory()->create();
        $path = UploadedFile::fake()->image('cover.jpg')->store('venues', 'public');
        $image = $venue->images()->create([
            'name' => 'cover.jpg', 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
            'url' => $path, 'is_primary' => true,
        ]);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->deleteJson("/api/venues/{$venue->id}/images/{$image->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('attachments', ['id' => $image->id]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_destroy_promotes_next_image_to_primary(): void
    {
        $venue = Venue::factory()->create();
        $first = $venue->images()->create([
            'name' => 'first.jpg', 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
            'url' => 'venues/first.jpg', 'is_primary' => true,
        ]);
        $second = $venue->images()->create([
            'name' => 'second.jpg', 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
            'url' => 'venues/second.jpg', 'is_primary' => false,
        ]);

        $this->actingAs($this->actingUser, 'sanctum')
            ->deleteJson("/api/venues/{$venue->id}/images/{$first->id}")
            ->assertStatus(200);

        $this->assertDatabaseHas('attachments', ['id' => $second->id, 'is_primary' => true]);
    }

    public function test_destroy_returns_404_for_image_belonging_to_another_venue(): void
    {
        $venue = Venue::factory()->create();
        $otherVenue = Venue::factory()->create();
        $image = $otherVenue->images()->create([
            'name' => 'cover.jpg', 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
            'url' => 'venues/cover.jpg', 'is_primary' => true,
        ]);

        $this->actingAs($this->actingUser, 'sanctum')
            ->deleteJson("/api/venues/{$venue->id}/images/{$image->id}")
            ->assertStatus(404);

        $this->assertDatabaseHas('attachments', ['id' => $image->id]);
    }

    public function test_set_primary_swaps_primary_flag(): void
    {
        $venue = Venue::factory()->create();
        $first = $venue->images()->create([
            'name' => 'first.jpg', 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
            'url' => 'venues/first.jpg', 'is_primary' => true,
        ]);
        $second = $venue->images()->create([
            'name' => 'second.jpg', 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
            'url' => 'venues/second.jpg', 'is_primary' => false,
        ]);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->patchJson("/api/venues/{$venue->id}/images/{$second->id}/primary");

        $response->assertStatus(200)
            ->assertJsonPath('data.is_primary', true);

        $this->assertDatabaseHas('attachments', ['id' => $first->id, 'is_primary' => false]);
        $this->assertDatabaseHas('attachments', ['id' => $second->id, 'is_primary' => true]);
    }
}
```

- [ ] **Step 3: Run both test files, confirm they fail**

Run: `php artisan test --filter=VenueControllerTest` and `php artisan test --filter=VenueImageControllerTest`
Expected: FAIL — routes `/api/venues*` don't exist yet (404s / class-not-found).

- [ ] **Step 4: Create the domain exception**

```php
<?php

namespace App\Exceptions;

use Exception;

class VenueImageLimitExceededException extends Exception
{
    public function __construct()
    {
        parent::__construct('Maximum of 8 images per venue.');
    }
}
```

Save as `backend/app/Exceptions/VenueImageLimitExceededException.php`.

- [ ] **Step 5: Map the exception to a 422 in bootstrap/app.php**

In `backend/app/Http/Requests/../../bootstrap/app.php`, inside the existing `->withExceptions(function (Exceptions $exceptions): void { ... })` closure, add a new `render` call alongside the existing three (`RoleInUseException`, `InactiveAccountException`, `InvalidCredentialsException`):

```php
        $exceptions->render(function (\App\Exceptions\VenueImageLimitExceededException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        });
```

- [ ] **Step 6: Create the repository interface**

```php
<?php

namespace App\Repositories\Interfaces;

use App\Models\Attachment;
use App\Models\Venue;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface VenueRepositoryInterface
{
    public function findAll(int $perPage = 25): LengthAwarePaginator;

    public function findById(int $id): ?Venue;

    public function create(array $data): Venue;

    public function update(int $id, array $data): Venue;

    public function delete(int $id): void;

    public function countImages(Venue $venue): int;

    public function createImage(Venue $venue, array $attributes): Attachment;

    public function findImageOrFail(Venue $venue, int $imageId): Attachment;

    public function deleteImageRecord(Attachment $image): void;

    public function clearPrimaryFlag(Venue $venue): void;

    public function markPrimary(Attachment $image): Attachment;
}
```

Save as `backend/app/Repositories/Interfaces/VenueRepositoryInterface.php`.

- [ ] **Step 7: Create the Eloquent repository**

```php
<?php

namespace App\Repositories\Eloquent;

use App\Models\Attachment;
use App\Models\Venue;
use App\Repositories\Interfaces\VenueRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentVenueRepository implements VenueRepositoryInterface
{
    public function findAll(int $perPage = 25): LengthAwarePaginator
    {
        return Venue::with('images')->paginate($perPage);
    }

    public function findById(int $id): ?Venue
    {
        return Venue::with('images')->find($id);
    }

    public function create(array $data): Venue
    {
        return Venue::create($data)->refresh();
    }

    public function update(int $id, array $data): Venue
    {
        $venue = Venue::findOrFail($id);
        $venue->update($data);

        return $venue->load('images');
    }

    public function delete(int $id): void
    {
        Venue::findOrFail($id)->delete();
    }

    public function countImages(Venue $venue): int
    {
        return $venue->images()->count();
    }

    public function createImage(Venue $venue, array $attributes): Attachment
    {
        return $venue->images()->create($attributes);
    }

    public function findImageOrFail(Venue $venue, int $imageId): Attachment
    {
        return $venue->images()->findOrFail($imageId);
    }

    public function deleteImageRecord(Attachment $image): void
    {
        $image->delete();
    }

    public function clearPrimaryFlag(Venue $venue): void
    {
        $venue->images()->where('is_primary', true)->update(['is_primary' => false]);
    }

    public function markPrimary(Attachment $image): Attachment
    {
        $image->update(['is_primary' => true]);

        return $image->refresh();
    }
}
```

Save as `backend/app/Repositories/Eloquent/EloquentVenueRepository.php`.

- [ ] **Step 8: Bind the repository in RepositoryServiceProvider**

In `backend/app/Providers/RepositoryServiceProvider.php`, add the import and binding:

```php
use App\Repositories\Eloquent\EloquentVenueRepository;
use App\Repositories\Interfaces\VenueRepositoryInterface;
```

Inside `register()`, alongside the existing two bindings:

```php
        $this->app->bind(VenueRepositoryInterface::class, EloquentVenueRepository::class);
```

- [ ] **Step 9: Create VenueService**

```php
<?php

namespace App\Services;

use App\Exceptions\VenueImageLimitExceededException;
use App\Models\Attachment;
use App\Models\Venue;
use App\Repositories\Interfaces\VenueRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class VenueService
{
    private const MAX_IMAGES = 8;

    public function __construct(private readonly VenueRepositoryInterface $venueRepo) {}

    public function getAll(int $perPage = 25): LengthAwarePaginator
    {
        return $this->venueRepo->findAll($perPage);
    }

    /** @param UploadedFile[] $images */
    public function create(array $data, array $images = [], ?int $uploadedBy = null): Venue
    {
        $venue = $this->venueRepo->create($data);

        foreach ($images as $index => $file) {
            $this->storeImage($venue, $file, isPrimary: $index === 0, uploadedBy: $uploadedBy);
        }

        return $this->venueRepo->findById($venue->id);
    }

    public function update(Venue $venue, array $data): Venue
    {
        return $this->venueRepo->update($venue->id, $data);
    }

    public function delete(Venue $venue): void
    {
        foreach ($venue->images as $image) {
            $this->deleteImageFile($image);
        }

        $this->venueRepo->delete($venue->id);
    }

    public function addImage(Venue $venue, UploadedFile $file, ?int $uploadedBy = null): Attachment
    {
        $count = $this->venueRepo->countImages($venue);

        if ($count >= self::MAX_IMAGES) {
            throw new VenueImageLimitExceededException();
        }

        return $this->storeImage($venue, $file, isPrimary: $count === 0, uploadedBy: $uploadedBy);
    }

    public function removeImage(Venue $venue, int $imageId): void
    {
        $image = $this->venueRepo->findImageOrFail($venue, $imageId);
        $wasPrimary = $image->is_primary;

        $this->deleteImageFile($image);
        $this->venueRepo->deleteImageRecord($image);

        if ($wasPrimary) {
            $next = $venue->images()->first();
            if ($next) {
                $this->venueRepo->markPrimary($next);
            }
        }
    }

    public function setPrimaryImage(Venue $venue, int $imageId): Attachment
    {
        $image = $this->venueRepo->findImageOrFail($venue, $imageId);

        $this->venueRepo->clearPrimaryFlag($venue);

        return $this->venueRepo->markPrimary($image);
    }

    private function storeImage(Venue $venue, UploadedFile $file, bool $isPrimary, ?int $uploadedBy): Attachment
    {
        $path = $file->store('venues', 'public');

        return $this->venueRepo->createImage($venue, [
            'name' => $file->getClientOriginalName(),
            'type' => 'image',
            'extension' => $file->getClientOriginalExtension(),
            'size' => (string) $file->getSize(),
            'url' => $path,
            'uploaded_by' => $uploadedBy,
            'is_primary' => $isPrimary,
        ]);
    }

    private function deleteImageFile(Attachment $image): void
    {
        Storage::disk('public')->delete($image->url);
    }
}
```

Save as `backend/app/Services/VenueService.php`. Note: `url` on `Attachment` stores the **relative path on the `public` disk** (e.g. `venues/abc123.jpg`), not an absolute URL — `VenueImageResource` (Step 11) converts it to an absolute URL for the frontend.

- [ ] **Step 10: Create the three Form Requests**

`backend/app/Http/Requests/StoreVenueRequest.php`:

```php
<?php

namespace App\Http\Requests;

use App\Enums\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVenueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'address_line' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'zip' => ['nullable', 'string', 'max:20'],
            'capacity' => ['nullable', 'integer', 'min:0'],
            'status' => ['sometimes', 'required', Rule::enum(Status::class)],
            'description' => ['nullable', 'string', 'max:2000'],
            'images' => ['sometimes', 'array', 'max:8'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
```

`backend/app/Http/Requests/UpdateVenueRequest.php`:

```php
<?php

namespace App\Http\Requests;

use App\Enums\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVenueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'address_line' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'zip' => ['nullable', 'string', 'max:20'],
            'capacity' => ['nullable', 'integer', 'min:0'],
            'status' => ['sometimes', 'required', Rule::enum(Status::class)],
            'description' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
```

`backend/app/Http/Requests/StoreVenueImageRequest.php`:

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVenueImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
```

- [ ] **Step 11: Create the two API Resources**

`backend/app/Http/Resources/VenueImageResource.php`:

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class VenueImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url' => Storage::disk('public')->url($this->url),
            'is_primary' => $this->is_primary,
        ];
    }
}
```

`backend/app/Http/Resources/VenueResource.php`:

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VenueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address_line' => $this->address_line,
            'city' => $this->city,
            'state' => $this->state,
            'zip' => $this->zip,
            'capacity' => $this->capacity,
            'status' => $this->status?->toArray(),
            'description' => $this->description,
            'images' => VenueImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
```

- [ ] **Step 12: Create the two Controllers**

`backend/app/Http/Controllers/VenueController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVenueRequest;
use App\Http\Requests\UpdateVenueRequest;
use App\Http\Resources\VenueResource;
use App\Models\Venue;
use App\Services\VenueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VenueController extends Controller
{
    public function __construct(private readonly VenueService $venueService) {}

    public function index(): AnonymousResourceCollection
    {
        return VenueResource::collection($this->venueService->getAll());
    }

    public function store(StoreVenueRequest $request): JsonResponse
    {
        $venue = $this->venueService->create(
            $request->safe()->except('images'),
            $request->file('images', []),
            $request->user()->id,
        );

        return (new VenueResource($venue))->response()->setStatusCode(201);
    }

    public function show(Venue $venue): VenueResource
    {
        return new VenueResource($venue->loadMissing('images'));
    }

    public function update(UpdateVenueRequest $request, Venue $venue): VenueResource
    {
        return new VenueResource($this->venueService->update($venue, $request->validated()));
    }

    public function destroy(Venue $venue): JsonResponse
    {
        $this->venueService->delete($venue);

        return response()->json(['message' => 'Venue deleted successfully']);
    }
}
```

`backend/app/Http/Controllers/VenueImageController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVenueImageRequest;
use App\Http\Resources\VenueImageResource;
use App\Models\Venue;
use App\Services\VenueService;
use Illuminate\Http\JsonResponse;

class VenueImageController extends Controller
{
    public function __construct(private readonly VenueService $venueService) {}

    public function store(StoreVenueImageRequest $request, Venue $venue): JsonResponse
    {
        $image = $this->venueService->addImage($venue, $request->file('image'), $request->user()->id);

        return (new VenueImageResource($image))->response()->setStatusCode(201);
    }

    public function destroy(Venue $venue, int $image): JsonResponse
    {
        $this->venueService->removeImage($venue, $image);

        return response()->json(['message' => 'Image deleted successfully']);
    }

    public function setPrimary(Venue $venue, int $image): VenueImageResource
    {
        return new VenueImageResource($this->venueService->setPrimaryImage($venue, $image));
    }
}
```

Note: `destroy`/`setPrimary` take a plain `int $image`, not an implicitly-bound `Attachment $image` — the venue-scoped lookup happens through `VenueService`/`VenueRepository::findImageOrFail($venue, $imageId)`, which 404s if the image doesn't belong to `$venue`. Using implicit model binding here would resolve any `Attachment` by global ID regardless of venue, which would let one venue's image be deleted/promoted via another venue's URL.

- [ ] **Step 13: Register routes**

In `backend/routes/api.php`, add the imports:

```php
use App\Http\Controllers\VenueController;
use App\Http\Controllers\VenueImageController;
```

Inside the existing `Route::middleware(['auth:sanctum', 'active'])->group(function () { ... })` block, after the `roles` routes and before the `Route::apiResources([...])` block, add:

```php
    Route::apiResource('venues', VenueController::class)->only(['index', 'show']);
    Route::apiResource('venues', VenueController::class)
        ->only(['store', 'update', 'destroy'])
        ->middleware('role:Admin');

    Route::post('venues/{venue}/images', [VenueImageController::class, 'store'])->middleware('role:Admin');
    Route::delete('venues/{venue}/images/{image}', [VenueImageController::class, 'destroy'])->middleware('role:Admin');
    Route::patch('venues/{venue}/images/{image}/primary', [VenueImageController::class, 'setPrimary'])->middleware('role:Admin');
```

- [ ] **Step 14: Run storage:link**

Run (from `backend/`): `php artisan storage:link`
Expected: `The [public\storage] link has been connected to [storage\app\public].` (Tests use `Storage::fake('public')` so this isn't required for Step 15, but it's required before any real manual upload will be servable.)

- [ ] **Step 15: Run both test files, confirm they pass**

Run: `php artisan test --filter=VenueControllerTest` and `php artisan test --filter=VenueImageControllerTest`
Expected: PASS, all tests green.

- [ ] **Step 16: Run the full backend suite to check for regressions**

Run: `php artisan test`
Expected: PASS, no regressions in `UserControllerTest`, `RoleControllerTest`, `AuthControllerTest`.

- [ ] **Step 17: Commit**

```bash
git add backend/app/Exceptions/VenueImageLimitExceededException.php backend/bootstrap/app.php backend/app/Repositories/Interfaces/VenueRepositoryInterface.php backend/app/Repositories/Eloquent/EloquentVenueRepository.php backend/app/Providers/RepositoryServiceProvider.php backend/app/Services/VenueService.php backend/app/Http/Requests/StoreVenueRequest.php backend/app/Http/Requests/UpdateVenueRequest.php backend/app/Http/Requests/StoreVenueImageRequest.php backend/app/Http/Resources/VenueResource.php backend/app/Http/Resources/VenueImageResource.php backend/app/Http/Controllers/VenueController.php backend/app/Http/Controllers/VenueImageController.php backend/routes/api.php backend/tests/Feature/VenueControllerTest.php backend/tests/Feature/VenueImageControllerTest.php
git commit -m "feat: add Venue CRUD API with image gallery endpoints"
```

---

## Task 3: Frontend — entities/venue

**Files:**
- Create: `frontend/src/entities/venue/model/types.ts`
- Create: `frontend/src/entities/venue/api/useVenues.ts`
- Create: `frontend/src/entities/venue/api/useVenue.ts`
- Create: `frontend/src/entities/venue/index.ts`

**Interfaces:**
- Consumes: `VenueResource`/`VenueImageResource` JSON shape from Task 2 (`{id, name, address_line, city, state, zip, capacity, status, description, images: [{id, url, is_primary}], created_at}`).
- Produces: `export interface Venue`, `export interface VenueImage`, `useVenues()` (query key `["venues"]`), `useVenue(id: number, options？: {enabled?: boolean})` (query key `["venues", id]`). Tasks 4-6 import these from `@/entities/venue`.

- [ ] **Step 1: Create the types file**

```ts
import type { Status } from "@/shared/components/StatusBadge";

export interface VenueImage {
    id: number;
    url: string;
    is_primary: boolean;
}

export interface Venue {
    id: number;
    name: string;
    address_line?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    capacity?: number | null;
    status?: Status | null;
    description?: string | null;
    images: VenueImage[];
    created_at?: string;
}
```

Save as `frontend/src/entities/venue/model/types.ts`.

- [ ] **Step 2: Create the list query hook**

```ts
import { useQuery } from "@tanstack/react-query";
import api from "@/shared/api/client";
import type { Venue } from "../model/types";

export function useVenues() {
    return useQuery({
        queryKey: ["venues"],
        queryFn: async () => {
            const { data } = await api.get<{ data: Venue[] }>("/venues");
            return data.data;
        },
    });
}
```

Save as `frontend/src/entities/venue/api/useVenues.ts`.

- [ ] **Step 3: Create the single-venue query hook**

```ts
import { useQuery } from "@tanstack/react-query";
import api from "@/shared/api/client";
import type { Venue } from "../model/types";

export function useVenue(id: number, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ["venues", id],
        queryFn: async () => {
            const { data } = await api.get<{ data: Venue }>(`/venues/${id}`);
            return data.data;
        },
        enabled: options?.enabled ?? true,
    });
}
```

Save as `frontend/src/entities/venue/api/useVenue.ts`. This exists so the edit modal's image gallery (Task 5) can re-fetch live after an image is added/removed/re-primaried, instead of relying on the stale `Venue` object the list page captured when the modal was opened.

- [ ] **Step 4: Create the public API**

```ts
export type { Venue, VenueImage } from "./model/types";
export { useVenues } from "./api/useVenues";
export { useVenue } from "./api/useVenue";
```

Save as `frontend/src/entities/venue/index.ts`.

- [ ] **Step 5: Verify the build**

Run (from `frontend/`): `npm run build`
Expected: no TypeScript errors (these files aren't consumed anywhere yet, so no other files should be affected).

- [ ] **Step 6: Commit**

```bash
git add frontend/src/entities/venue
git commit -m "feat: add venue entity types and query hooks"
```

---

## Task 4: Frontend — Dropzone component + shadcn Textarea

**Files:**
- Create: `frontend/src/shared/components/Dropzone.tsx`
- Create (via shadcn CLI): `frontend/src/shared/ui/textarea.tsx`

**Interfaces:**
- Produces: `Dropzone({ files, onChange, maxFiles?, accept?, disabled? })` — a controlled multi-file picker with drag-and-drop and image previews; `onChange(files: File[])` fires with the full new file list (already capped at `maxFiles`) on every add/remove. `Textarea` — standard shadcn component. Task 5 (`VenueFormModal`) consumes both.

- [ ] **Step 1: Add the shadcn Textarea component**

Run (from `frontend/`): `npx shadcn@latest add textarea`
Expected: creates `frontend/src/shared/ui/textarea.tsx` (per `components.json` aliases).

- [ ] **Step 2: Create the Dropzone component**

```tsx
import { useRef, useState } from "react";
import type { DragEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface DropzoneProps {
    files: File[];
    onChange: (files: File[]) => void;
    maxFiles?: number;
    accept?: string;
    disabled?: boolean;
}

export function Dropzone({ files, onChange, maxFiles = 8, accept = "image/jpeg,image/png,image/webp", disabled }: DropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const addFiles = (incoming: FileList | null) => {
        if (!incoming) return;
        const combined = [...files, ...Array.from(incoming)].slice(0, maxFiles);
        onChange(combined);
    };

    const removeFile = (index: number) => {
        onChange(files.filter((_, i) => i !== index));
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        addFiles(event.dataTransfer.files);
    };

    return (
        <div className="space-y-3">
            <div
                onClick={() => !disabled && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground transition",
                    isDragging && "border-primary bg-primary/5",
                    disabled && "cursor-not-allowed opacity-50"
                )}
            >
                <ImagePlus className="size-6" />
                <span>Drag images here, or click to browse</span>
                <span className="text-xs">Up to {maxFiles} images — JPG, PNG, or WEBP</span>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={accept}
                    className="hidden"
                    disabled={disabled}
                    onChange={(e) => addFiles(e.target.files)}
                />
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                    {files.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="group relative aspect-square overflow-hidden rounded-md border">
                            <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                                aria-label={`Remove ${file.name}`}
                            >
                                <X className="size-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
```

Save as `frontend/src/shared/components/Dropzone.tsx`.

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/shared/components/Dropzone.tsx frontend/src/shared/ui/textarea.tsx frontend/components.json
git commit -m "feat: add reusable Dropzone component and shadcn Textarea"
```

(If `npx shadcn add` also touched `package.json`/`package-lock.json` — e.g. adding a Radix dependency the Textarea primitive needs — include those in the `git add` too; check `git status` before committing.)

---

## Task 5: Frontend — features/venues

**Files:**
- Create: `frontend/src/features/venues/model/useVenueMutations.ts`
- Create: `frontend/src/features/venues/ui/VenueFormModal.tsx`
- Create: `frontend/src/features/venues/ui/DeleteVenueDialog.tsx`
- Create: `frontend/src/features/venues/index.ts`

**Interfaces:**
- Consumes: `Venue`, `VenueImage`, `useVenue` from `@/entities/venue` (Task 3); `Dropzone` from `@/shared/components/Dropzone` and `Textarea` from `@/shared/ui/textarea` (Task 4); `Modal`, `FormField`, `Alert`, `ConfirmDialog`, `useFormErrors`, `notify` (all pre-existing, same as `features/users`).
- Produces: `VenueFormModal({open, onOpenChange, venue?, onSuccess})`, `DeleteVenueDialog({open, onOpenChange, venue, onSuccess})`, `useCreateVenue`, `useUpdateVenue`, `useDeleteVenue`, `useAddVenueImage`, `useDeleteVenueImage`, `useSetPrimaryVenueImage`. Task 6 (`pages/venues`) imports `VenueFormModal`/`DeleteVenueDialog` from `@/features/venues`.

- [ ] **Step 1: Create the mutation hooks**

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/api/client";
import type { VenueImage } from "@/entities/venue";

export interface VenuePayload {
    name: string;
    address_line?: string;
    city?: string;
    state?: string;
    zip?: string;
    capacity?: number;
    status?: string;
    description?: string;
    images?: File[];
}

function toFormData(payload: VenuePayload): FormData {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (key === "images") return;
        if (value !== undefined && value !== null && value !== "") {
            formData.append(key, String(value));
        }
    });

    payload.images?.forEach((file) => formData.append("images[]", file));

    return formData;
}

export function useCreateVenue() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: VenuePayload) => api.post("/venues", toFormData(payload)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
        meta: { skipGlobalError: true },
    });
}

export function useUpdateVenue() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Omit<VenuePayload, "images"> }) =>
            api.put(`/venues/${id}`, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
        meta: { skipGlobalError: true },
    });
}

export function useDeleteVenue() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/venues/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
    });
}

export function useAddVenueImage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ venueId, file }: { venueId: number; file: File }) => {
            const formData = new FormData();
            formData.append("image", file);
            return api.post<{ data: VenueImage }>(`/venues/${venueId}/images`, formData);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
        meta: { skipGlobalError: true },
    });
}

export function useDeleteVenueImage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ venueId, imageId }: { venueId: number; imageId: number }) =>
            api.delete(`/venues/${venueId}/images/${imageId}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
    });
}

export function useSetPrimaryVenueImage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ venueId, imageId }: { venueId: number; imageId: number }) =>
            api.patch(`/venues/${venueId}/images/${imageId}/primary`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
    });
}
```

Save as `frontend/src/features/venues/model/useVenueMutations.ts`. Note: `queryClient.invalidateQueries({queryKey: ["venues"]})` also invalidates `["venues", id]` — TanStack Query's default matching is prefix-based, so the single-venue query from Task 3 refetches too without a second explicit call.

Multipart note: `useCreateVenue` and `useAddVenueImage` pass a `FormData` body straight to `api.post()` with no manual `Content-Type` override. Axios 1.x's default `transformRequest` detects `FormData` and unsets any preset `Content-Type` header so the browser can set its own multipart boundary — this should override `shared/api/client.ts`'s instance-level `Content-Type: application/json` default automatically. Verify this in Task 7's manual click-through (check the browser Network tab: the `POST /venues` request's `Content-Type` must read `multipart/form-data; boundary=...`, not `application/json`). If it doesn't, the fix is to explicitly pass `headers: { "Content-Type": undefined }` in the two `mutationFn` calls above that send `FormData`.

- [ ] **Step 2: Create VenueFormModal**

```tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { Star, Trash2 } from "lucide-react";
import { Modal } from "@/shared/components/Modal";
import { FormField } from "@/shared/components/FormField";
import { Alert } from "@/shared/components/Alert";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Spinner } from "@/shared/ui/spinner";
import { Dropzone } from "@/shared/components/Dropzone";
import { useFormErrors } from "@/shared/hooks/useFormErrors";
import { notify } from "@/shared/lib/alerts";
import {
    useCreateVenue,
    useUpdateVenue,
    useAddVenueImage,
    useDeleteVenueImage,
    useSetPrimaryVenueImage,
} from "../model/useVenueMutations";
import { useVenue, type Venue } from "@/entities/venue";

interface VenueFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    venue?: Venue | null;
    onSuccess: () => void;
}

const FORM_ID = "venue-form";
const STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "archived", label: "Archived" },
];

export function VenueFormModal({ open, onOpenChange, venue, onSuccess }: VenueFormModalProps) {
    const isEditMode = Boolean(venue);

    const [name, setName] = useState(venue?.name ?? "");
    const [addressLine, setAddressLine] = useState(venue?.address_line ?? "");
    const [city, setCity] = useState(venue?.city ?? "");
    const [state, setState] = useState(venue?.state ?? "");
    const [zip, setZip] = useState(venue?.zip ?? "");
    const [capacity, setCapacity] = useState(venue?.capacity ? String(venue.capacity) : "");
    const [status, setStatus] = useState(venue?.status?.value ?? "active");
    const [description, setDescription] = useState(venue?.description ?? "");
    const [newImages, setNewImages] = useState<File[]>([]);

    const { formError, fieldError, handleError, reset } = useFormErrors();

    const { data: liveVenue } = useVenue(venue?.id ?? 0, { enabled: isEditMode });
    const galleryImages = liveVenue?.images ?? venue?.images ?? [];

    const createVenue = useCreateVenue();
    const updateVenue = useUpdateVenue();
    const addImage = useAddVenueImage();
    const deleteImage = useDeleteVenueImage();
    const setPrimaryImage = useSetPrimaryVenueImage();
    const isSubmitting = createVenue.isPending || updateVenue.isPending;

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        reset();

        const fields = {
            name,
            address_line: addressLine,
            city,
            state,
            zip,
            capacity: capacity ? Number(capacity) : undefined,
            status,
            description,
        };

        try {
            if (isEditMode && venue) {
                await updateVenue.mutateAsync({ id: venue.id, payload: fields });
            } else {
                await createVenue.mutateAsync({ ...fields, images: newImages });
            }

            onSuccess();
            notify.success(isEditMode ? "Venue updated" : "Venue created");
        } catch (err) {
            handleError(err);
        }
    };

    const handleAddExistingImage = async (files: File[]) => {
        if (!venue) return;

        for (const file of files) {
            try {
                await addImage.mutateAsync({ venueId: venue.id, file });
            } catch (err) {
                handleError(err);
                break;
            }
        }
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditMode ? "Edit Venue" : "Add Venue"}
            description={isEditMode ? "Update this venue's details." : "Create a new venue."}
            footer={
                <>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
                        {isSubmitting && <Spinner className="size-4" />}
                        {isEditMode ? "Save Changes" : "Create Venue"}
                    </Button>
                </>
            }
        >
            <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
                {formError && <Alert>{formError}</Alert>}

                <FormField id="name" label="Name" error={fieldError("name")}>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </FormField>

                <FormField id="address_line" label="Address" error={fieldError("address_line")}>
                    <Input id="address_line" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
                </FormField>

                <div className="grid grid-cols-3 gap-3">
                    <FormField id="city" label="City" error={fieldError("city")}>
                        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                    </FormField>
                    <FormField id="state" label="State" error={fieldError("state")}>
                        <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
                    </FormField>
                    <FormField id="zip" label="Zip" error={fieldError("zip")}>
                        <Input id="zip" value={zip} onChange={(e) => setZip(e.target.value)} />
                    </FormField>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <FormField id="capacity" label="Capacity" error={fieldError("capacity")}>
                        <Input id="capacity" type="number" min="0" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                    </FormField>
                    <FormField id="status" label="Status" error={fieldError("status")}>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>
                </div>

                <FormField id="description" label="Description" error={fieldError("description")}>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </FormField>

                <FormField id="images" label="Images" error={fieldError("images")}>
                    {isEditMode && venue ? (
                        <div className="space-y-3">
                            {galleryImages.length > 0 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {galleryImages.map((image) => (
                                        <div key={image.id} className="group relative aspect-square overflow-hidden rounded-md border">
                                            <img src={image.url} alt="" className="h-full w-full object-cover" />
                                            {image.is_primary && (
                                                <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                                                    Primary
                                                </span>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-black/50 p-1 opacity-0 transition group-hover:opacity-100">
                                                {!image.is_primary && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setPrimaryImage.mutate({ venueId: venue.id, imageId: image.id })}
                                                        className="rounded p-1 text-white hover:bg-white/20"
                                                        aria-label="Set as primary"
                                                    >
                                                        <Star className="size-3" />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => deleteImage.mutate({ venueId: venue.id, imageId: image.id })}
                                                    className="rounded p-1 text-white hover:bg-white/20"
                                                    aria-label="Delete image"
                                                >
                                                    <Trash2 className="size-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Dropzone
                                files={[]}
                                onChange={handleAddExistingImage}
                                maxFiles={Math.max(0, 8 - galleryImages.length)}
                                disabled={galleryImages.length >= 8 || addImage.isPending}
                            />
                        </div>
                    ) : (
                        <Dropzone files={newImages} onChange={setNewImages} maxFiles={8} />
                    )}
                </FormField>
            </form>
        </Modal>
    );
}
```

Save as `frontend/src/features/venues/ui/VenueFormModal.tsx`.

- [ ] **Step 3: Create DeleteVenueDialog**

```tsx
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { notify } from "@/shared/lib/alerts";
import { useDeleteVenue } from "../model/useVenueMutations";
import type { Venue } from "@/entities/venue";

interface DeleteVenueDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    venue: Venue | null;
    onSuccess: () => void;
}

export function DeleteVenueDialog({ open, onOpenChange, venue, onSuccess }: DeleteVenueDialogProps) {
    const deleteVenue = useDeleteVenue();

    const handleConfirm = () => {
        if (!venue) return;

        deleteVenue.mutate(venue.id, {
            onSuccess: () => {
                onSuccess();
                notify.success("Venue deleted");
            },
        });
    };

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete Venue"
            description={venue ? `Are you sure you want to delete "${venue.name}"? This cannot be undone.` : undefined}
            confirmLabel="Delete"
            variant="destructive"
            isLoading={deleteVenue.isPending}
            onConfirm={handleConfirm}
        />
    );
}
```

Save as `frontend/src/features/venues/ui/DeleteVenueDialog.tsx`.

- [ ] **Step 4: Create the public API**

```ts
export { VenueFormModal } from "./ui/VenueFormModal";
export { DeleteVenueDialog } from "./ui/DeleteVenueDialog";
export {
    useCreateVenue,
    useUpdateVenue,
    useDeleteVenue,
    useAddVenueImage,
    useDeleteVenueImage,
    useSetPrimaryVenueImage,
} from "./model/useVenueMutations";
```

Save as `frontend/src/features/venues/index.ts`.

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/features/venues
git commit -m "feat: add venue create/edit/delete UI with image gallery management"
```

---

## Task 6: Frontend — pages/venues + routing

**Files:**
- Create: `frontend/src/pages/venues/index.tsx`
- Create: `frontend/src/pages/venues/columns.tsx`
- Modify: `frontend/src/app/routes/AppRoutes.tsx`
- Modify: `frontend/src/widgets/app-sidebar/ui/AppSidebar.tsx`

**Interfaces:**
- Consumes: `useVenues`, `Venue` from `@/entities/venue` (Task 3); `VenueFormModal`, `DeleteVenueDialog` from `@/features/venues` (Task 5).
- Produces: route `/venues` rendering the `Venues` page; a `Venues` nav link in the sidebar.

- [ ] **Step 1: Create columns.tsx**

```tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import StatusBadge from "@/shared/components/StatusBadge";
import type { Venue } from "@/entities/venue";

export const createColumns = (
    onEdit: (venue: Venue) => void,
    onDelete: (venue: Venue) => void,
): ColumnDef<Venue>[] => [
    {
        id: "thumbnail",
        header: "",
        cell: ({ row }) => {
            const primary = row.original.images[0];
            return primary ? (
                <img src={primary.url} alt="" className="size-10 rounded object-cover" />
            ) : (
                <div className="size-10 rounded bg-muted" />
            );
        },
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        id: "location",
        accessorFn: (row) => [row.city, row.state].filter(Boolean).join(", ") || "—",
        header: "Location",
    },
    {
        accessorKey: "capacity",
        header: "Capacity",
        cell: ({ row }) => row.original.capacity ?? "—",
    },
    {
        id: "status",
        header: "Status",
        cell: ({ row }) => row.original.status ? <StatusBadge status={row.original.status} /> : "—",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(row.original)} aria-label={`Edit ${row.original.name}`}>
                    Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(row.original)} aria-label={`Delete ${row.original.name}`}>
                    Delete
                </Button>
            </div>
        ),
    },
];
```

Save as `frontend/src/pages/venues/columns.tsx`.

- [ ] **Step 2: Create index.tsx**

```tsx
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/components/DataTable";
import { Alert } from "@/shared/components/Alert";
import { createColumns } from "./columns";
import { VenueFormModal, DeleteVenueDialog } from "@/features/venues";
import { useVenues, type Venue as VenueType } from "@/entities/venue";
import { Spinner } from "@/shared/ui/spinner";

import PageHeader from "@/shared/components/PageHeader";

type ModalState =
    | { type: "create" }
    | { type: "edit"; venue: VenueType }
    | { type: "delete"; venue: VenueType }
    | null;

export default function Venues() {
    const { data: venues = [], isLoading, error, refetch } = useVenues();
    const [modal, setModal] = useState<ModalState>(null);

    const openCreateModal = useCallback(() => setModal({ type: "create" }), []);
    const openEditModal = useCallback((venue: VenueType) => setModal({ type: "edit", venue }), []);
    const openDeleteDialog = useCallback((venue: VenueType) => setModal({ type: "delete", venue }), []);
    const closeModal = useCallback(() => setModal(null), []);

    const columns = useMemo(() => createColumns(openEditModal, openDeleteDialog), [openEditModal, openDeleteDialog]);

    const isFormOpen = modal?.type === "create" || modal?.type === "edit";
    const isDeleteOpen = modal?.type === "delete";

    return (
        <div className="flex-1 space-y-6">
            <PageHeader title="Venues" description="Manage all sports venues">
                <Button size="lg" onClick={openCreateModal}>Add Venue</Button>
            </PageHeader>

            {isLoading ? (
                <div className="flex h-48 items-center justify-center rounded-md border">
                    <Spinner className="size-8" />
                </div>
            ) : error ? (
                <Alert className="flex flex-col items-start gap-2">
                    <span>Failed to load venues.</span>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
                </Alert>
            ) : (
                <DataTable columns={columns} data={venues} />
            )}

            {isFormOpen && (
                <VenueFormModal
                    key={modal?.type === "edit" ? modal.venue.id : "new"}
                    open={isFormOpen}
                    onOpenChange={(open) => !open && closeModal()}
                    venue={modal?.type === "edit" ? modal.venue : null}
                    onSuccess={closeModal}
                />
            )}

            {isDeleteOpen && (
                <DeleteVenueDialog
                    open={isDeleteOpen}
                    onOpenChange={(open) => !open && closeModal()}
                    venue={modal?.type === "delete" ? modal.venue : null}
                    onSuccess={closeModal}
                />
            )}
        </div>
    );
}
```

Save as `frontend/src/pages/venues/index.tsx`.

- [ ] **Step 3: Register the route**

In `frontend/src/app/routes/AppRoutes.tsx`, add the import:

```tsx
import Venues from "@/pages/venues";
```

Inside the `<Route element={<ProtectedLayout />}>` group, after the existing `/users` route:

```tsx
        <Route path="/venues" element={<Venues />} />
```

- [ ] **Step 4: Add the sidebar nav entry**

In `frontend/src/widgets/app-sidebar/ui/AppSidebar.tsx`, add `Building2` to the `lucide-react` import:

```tsx
import { User, LayoutDashboard, LogOut, Menu, X, LogIn, Building2 } from "lucide-react";
```

Add a new entry to the `links` array, after `/users`:

```tsx
    { to: "/venues", label: "Venues", icon: Building2 },
```

- [ ] **Step 5: Verify the build and architecture lint**

Run: `npm run build` — expected: no TypeScript errors.
Run: `npm run lint:arch` — expected: no Steiger violations (venue slices only import from `shared`/`entities`/`features` per FSD rules, same direction as `users`).

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/venues frontend/src/app/routes/AppRoutes.tsx frontend/src/widgets/app-sidebar/ui/AppSidebar.tsx
git commit -m "feat: add /venues page and register route + nav entry"
```

---

## Task 7: End-to-end verification and status docs

**Files:**
- Modify: `backend/CLAUDE.md`
- Modify: `frontend/CLAUDE.md`

**Interfaces:**
- Consumes: everything from Tasks 1-6.
- Produces: nothing new — this task is verification plus keeping the two "Implementation Status" tables (which this project actively maintains) accurate.

- [ ] **Step 1: Run the full backend test suite**

Run (from `backend/`): `php artisan test`
Expected: all tests pass, including the new `VenueControllerTest` and `VenueImageControllerTest`.

- [ ] **Step 2: Run the full frontend build + lint**

Run (from `frontend/`): `npm run build && npm run lint`
Expected: no errors.

- [ ] **Step 3: Start both servers for a manual click-through**

Run (from `backend/`): `php artisan serve`
Run (from `frontend/`, separate terminal): `npm run dev`

Manually verify in the browser (sign in as an Admin-role user first, since mutations are Admin-gated):
1. Navigate to `/venues` — the 5 seeded venues appear in the table with placeholder thumbnails.
2. Click "Add Venue", fill in name + a couple of images, submit — new row appears with a real thumbnail. Before submitting, open DevTools Network tab and confirm the `POST /venues` request's `Content-Type` header is `multipart/form-data; boundary=...` (see the multipart note in Task 5, Step 1 — fix `useVenueMutations.ts` if it instead shows `application/json`).
3. Edit that venue — gallery shows the uploaded images; add one more image; delete one; click the star to change the primary image; confirm the "Primary" badge moves and the table thumbnail updates after closing the modal.
4. Try uploading a 9th image on a venue that already has 8 — confirm the inline error "Maximum of 8 images per venue."
5. Delete a venue — confirm it disappears from the table and (via `backend/storage/app/public/venues/`) its image files are gone from disk.

- [ ] **Step 4: Update backend/CLAUDE.md's Implementation Status table**

In `backend/CLAUDE.md`, in the `## Implementation Status` table, change the row:

```
| Players | Controller is empty — **not implemented** |
```

to add a new row directly above it:

```
| Venues | Complete, layered — includes image gallery via the `attachments` table |
| Players | Controller is empty — **not implemented** |
```

- [ ] **Step 5: Update frontend/CLAUDE.md's Implementation Status table and current-slices list**

In `frontend/CLAUDE.md`, in the `## Implementation Status` table, add a row after `Users`:

```
| Venues | Complete, on React Query (`useVenues`/`useVenue`), includes image gallery |
```

In the `**Current slices:**` list, update:

```
- `entities`: `user` (includes `api/useUsers` — the plain read), `role` (includes `api/useRoles`) — read-only data fetching for a business object lives here; create/update/delete actions and their UI stay in the matching `features` slice
- `features`: `auth`, `users`
- `pages`: `landing`, `login`, `dashboard`, `users`, `errors`
```

to:

```
- `entities`: `user` (includes `api/useUsers` — the plain read), `role` (includes `api/useRoles`), `venue` (includes `api/useVenues`, `api/useVenue`) — read-only data fetching for a business object lives here; create/update/delete actions and their UI stay in the matching `features` slice
- `features`: `auth`, `users`, `venues`
- `pages`: `landing`, `login`, `dashboard`, `users`, `venues`, `errors`
```

- [ ] **Step 6: Commit**

```bash
git add backend/CLAUDE.md frontend/CLAUDE.md
git commit -m "docs: mark Venues complete in implementation status tables"
```
