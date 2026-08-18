<?php

namespace App\Filament\Resources\Orders\Tables;

use App\Models\DeliverySetting;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order_number')
                    ->label('Order')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'processing' => 'info',
                        'completed' => 'success',
                        'cancelled' => 'gray',
                        default => 'gray',
                    })
                    ->sortable(),
                TextColumn::make('customer_name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('customer_phone')
                    ->label('Phone')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('items_count')
                    ->label('Items')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('total_cents')
                    ->label('Total')
                    ->money('USD', divideBy: 100)
                    ->sortable(),
                TextColumn::make('delivery_zone')
                    ->label('Delivery')
                    ->formatStateUsing(fn (?string $state): string => DeliverySetting::labelForZone($state))
                    ->toggleable(),
                TextColumn::make('created_at')
                    ->label('Received')
                    ->dateTime('M j, Y g:i A')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'processing' => 'Processing',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
            ]);
    }
}
