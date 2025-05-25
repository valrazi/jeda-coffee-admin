<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use App\Models\OrderItem;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = Customer
            ::when($request->search, fn($query) =>
            $query->where('full_name', 'like', '%' . $request->search . '%'))
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Customers/Index', [
            'customers' => $customers
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
