<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\OrderItem;


class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $start = $request->query('start_at');
        $end = $request->query('end_at');

        $ordersQuery = Orders::whereIn('order_status', ['ready', 'completed']);

        // Apply date filters if provided
        if ($start && $end) {
            $ordersQuery = $ordersQuery->whereBetween('created_at', [
                Carbon::parse($start)->startOfDay(),
                Carbon::parse($end)->endOfDay()
            ]);
        }

        $transactionPerYear = (clone $ordersQuery)
            ->selectRaw('YEAR(created_at) as year, SUM(total_price) as total, SUM(total_price / 1.11) as total_untaxed')
            ->groupBy('year')
            ->orderBy('year')
            ->get();

        $transactionPerMonth = (clone $ordersQuery)
            ->selectRaw('MONTH(created_at) as month, SUM(total_price) as total, SUM(total_price / 1.11) as total_untaxed')
            ->whereYear('created_at', Carbon::now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $totalThisYear = (clone $ordersQuery)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('total_price');

        $totalThisMonth = (clone $ordersQuery)
            ->whereMonth('created_at', Carbon::now()->month)
            ->sum('total_price');

        $totalToday = (clone $ordersQuery)
            ->whereDate('created_at', Carbon::today())
            ->sum('total_price');

        $totalTransferToday = (clone $ordersQuery)
            ->whereDate('created_at', Carbon::today())
            ->where('paid_at_cashier', 0)
            ->count();

        $totalCashToday = (clone $ordersQuery)
            ->whereDate('created_at', Carbon::today())
            ->where('paid_at_cashier', 1)
            ->count();

        $totalTransactionToday = (clone $ordersQuery)
            ->whereDate('created_at', Carbon::today())
            ->count();


        $topOrderItems = OrderItem::selectRaw('name, SUM(quantity) as total_quantity, SUM(total_price) as total_revenue')
            ->whereIn('order_id', function ($query) use ($ordersQuery) {
                $query->select('id')
                    ->fromSub($ordersQuery->select('id'), 'filtered_orders');
            })
            ->groupBy('name')
            ->orderByDesc('total_quantity') // or orderByDesc('total_revenue') for top revenue
            ->limit(3)
            ->get();

        return Inertia::render('Dashboard', [
            'transactionPerYear' => $transactionPerYear,
            'transactionPerMonth' => $transactionPerMonth,
            'totalThisYear' => $totalThisYear,
            'totalThisMonth' => $totalThisMonth,
            'totalToday' => $totalToday,
            'totalTransferToday' => $totalTransferToday,
            'totalCashToday' => $totalCashToday,
            'totalTransactionToday' => $totalTransactionToday,
            'topOrderItems' => $topOrderItems

        ]);
    }
}
