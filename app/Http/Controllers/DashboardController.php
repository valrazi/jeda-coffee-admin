<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        ->selectRaw('YEAR(created_at) as year, SUM(total_price) as total')
        ->groupBy('year')
        ->orderBy('year')
        ->get();

    $transactionPerMonth = (clone $ordersQuery)
        ->selectRaw('MONTH(created_at) as month, SUM(total_price) as total')
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
        ->whereDate('created_at', Carbon::today()->subHours(7))
        ->sum('total_price');

    return Inertia::render('Dashboard', [
        'transactionPerYear' => $transactionPerYear,
        'transactionPerMonth' => $transactionPerMonth,
        'totalThisYear' => $totalThisYear,
        'totalThisMonth' => $totalThisMonth,
        'totalToday' => $totalToday,
    ]);
}

}
