<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Orders\OrderResource;
use App\Models\Order;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class LatestOrdersWidget extends TableWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('Latest orders')
            ->description('Newest checkout submissions from the storefront.')
            ->query(fn (): Builder => Order::query()->withCount('items')->latest())
            ->columns([
                TextColumn::make('order_number')
                    ->label('Order')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'processing' => 'info',
                        'completed' => 'success',
                        'cancelled' => 'gray',
                        default => 'gray',
                    }),
                TextColumn::make('customer_name')
                    ->label('Customer')
                    ->searchable(),
                TextColumn::make('items_count')
                    ->label('Items')
                    ->numeric(),
                TextColumn::make('total_cents')
                    ->label('Total')
                    ->money('USD', divideBy: 100),
                TextColumn::make('created_at')
                    ->label('Received')
                    ->dateTime('M j, Y g:i A'),
            ])
            ->recordActions([
                ViewAction::make(),
            ])
            ->recordUrl(fn (Order $record): string => OrderResource::getUrl('view', ['record' => $record]))
            ->paginated([5, 10])
            ->defaultPaginationPageOption(5);
    }
}
