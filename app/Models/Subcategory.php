<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subcategory extends Model
{
    use HasFactory;

    public $incrementing = false; // important to disable auto-incrementing
    protected $keyType = 'string'; // because id is a string

    protected $table = "subcategory";

    protected $fillable = [
        "id",
        "name",
        "category",
    ];

    protected static function booted()
    {
        static::creating(function ($subcategory) {
            if (empty($subcategory->id)) {
                $latest = self::orderBy('id', 'desc')->first();
                if (!$latest) {
                    $nextNumber = 1;
                } else {
                    $number = (int) str_replace('SCT', '', $latest->id);
                    $nextNumber = $number + 1;
                }

                $subcategory->id = 'SCT' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
