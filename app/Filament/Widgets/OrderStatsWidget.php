<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Database\QueryException;

class OrderStatsWidget extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    /**
     * @return array<Stat>
     */
    protected function getStats(): array
    {
        [$totalOrders, $pendingOrders, $revenueCents] = $this->getOrderStats();

        return [
            Stat::make('Total orders', number_format($totalOrders))
                ->description('All checkout submissions')
                ->icon(Heroicon::OutlinedShoppingBag)
                ->color('primary'),
            Stat::make('Pending orders', number_format($pendingOrders))
                ->description('Need review or processing')
                ->icon(Heroicon::OutlinedClock)
                ->color($pendingOrders > 0 ? 'warning' : 'gray'),
            Stat::make('Order revenue', '$'.number_format($revenueCents / 100, 2))
                ->description('Excludes cancelled orders')
                ->icon(Heroicon::OutlinedBanknotes)
                ->color('success'),
        ];
    }

    /**
     * @return array{0: int, 1: int, 2: int}
     */
    private function getOrderStats(): array
    {
        try {
            $orders = Order::query();

            return [
                (clone $orders)->count(),
                (clone $orders)->where('status', 'pending')->count(),
                (int) (clone $orders)
                    ->where('status', '!=', 'cancelled')
                    ->sum('total_cents'),
            ];
        } catch (QueryException) {
            return [0, 0, 0];
        }
    }
}
