<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Orders extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
    ];

    // Accessor buat override created_at
    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->addHours(7);
    }

    protected $fillable = [
        'customer_id',
        'total_price',
        'status',
        'order_status',
        'paid_at_cashier'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }
}
