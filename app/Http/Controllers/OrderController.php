<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use App\Models\OrderItem;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Orders::with('customer', 'orderItems')
            ->when($request->search, fn($query) =>
            $query->where('id', 'like', '%' . $request->search . '%'))
            ->when($request->status && in_array($request->status, ['pending', 'preparing', 'ready', 'completed', 'cancelled']), fn($query) =>
            $query->where('order_status', $request->status))
            ->orderBy('created_at', 'desc')
            ->paginate(10000);

        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function show($id)
    {
        $order = Orders::with('customer', 'orderItems')->findOrFail($id);
        return response()->json($order);
    }

    public function update(Request $request, $id)
    {
        $order = Orders::findOrFail($id);
        $request->validate([
            'status' => 'required|in:pending,preparing,ready,completed,cancelled'
        ]);
        $order->update(['order_status' => $request->status]);

        return redirect()->route('orders.index')->with('success', 'Order Status Update Success');
    }
}
