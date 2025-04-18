<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'name',
        'quantity',
        'price',
        'total_price'
    ];

    public function order()
    {
        return $this->belongsTo(Orders::class, 'order_id');
    }
}
