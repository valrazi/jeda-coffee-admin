<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    public $incrementing = false; // Disable auto-increment
    protected $keyType = 'string'; // Set key type to string

    protected $fillable = [
        "id",
        "name",
        "price",
        "image",
        "description",
        "category",
        "stock",
        "subcategory_id",
    ];

    protected static function booted()
    {
        static::creating(function ($product) {
            if (empty($product->id)) {
                $latest = self::orderBy('id', 'desc')->first();
                if (!$latest) {
                    $nextNumber = 1;
                } else {
                    $number = (int) str_replace('PRD', '', $latest->id);
                    $nextNumber = $number + 1;
                }

                $product->id = 'PRD' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Subcategory::class);
    }
}
