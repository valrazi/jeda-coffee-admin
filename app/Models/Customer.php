<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'full_name',
        'phone_number',
        'email'
    ];

    public function orders()
    {
        return $this->hasMany(Orders::class);
    }
}
