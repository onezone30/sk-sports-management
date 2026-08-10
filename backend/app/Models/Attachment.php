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
