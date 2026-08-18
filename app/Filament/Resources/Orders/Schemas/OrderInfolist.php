<?php

namespace App\Filament\Resources\Orders\Schemas;

use App\Models\DeliverySetting;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class OrderInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Order summary')
                    ->schema([
                        Grid::make(4)
                            ->schema([
                                TextEntry::make('order_number')
                                    ->label('Order number')
                                    ->copyable(),
                                TextEntry::make('status')
                                    ->badge()
                                    ->color(fn (string $state): string => match ($state) {
                                        'pending' => 'warning',
                                        'processing' => 'info',
                                        'completed' => 'success',
                                        'cancelled' => 'gray',
                                        default => 'gray',
                                    }),
                                TextEntry::make('payment_method')
                                    ->label('Payment')
                                    ->formatStateUsing(fn (?string $state): string => str($state ?? '')->headline()->toString()),
                                TextEntry::make('created_at')
                                    ->dateTime('M j, Y g:i A'),
                                TextEntry::make('subtotal_cents')
                                    ->label('Subtotal')
                                    ->money('USD', divideBy: 100),
                                TextEntry::make('discount_cents')
                                    ->label('Discount')
                                    ->money('USD', divideBy: 100),
                                TextEntry::make('shipping_cents')
                                    ->label('Shipping')
                                    ->money('USD', divideBy: 100),
                                TextEntry::make('delivery_zone')
                                    ->label('Delivery zone')
                                    ->formatStateUsing(fn (?string $state): string => DeliverySetting::labelForZone($state)),
                                TextEntry::make('total_cents')
                                    ->label('Total')
                                    ->money('USD', divideBy: 100),
                            ]),
                    ])
                    ->columnSpanFull(),
                Section::make('Items')
                    ->schema([
                        RepeatableEntry::make('items')
                            ->hiddenLabel()
                            ->schema([
                                TextEntry::make('product_title')
                                    ->label('Product'),
                                TextEntry::make('quantity')
                                    ->numeric(),
                                TextEntry::make('unit_price_cents')
                                    ->label('Unit price')
                                    ->money('USD', divideBy: 100),
                                TextEntry::make('total_cents')
                                    ->label('Line total')
                                    ->money('USD', divideBy: 100),
                            ])
                            ->columns(4),
                    ])
                    ->columnSpanFull(),
                Section::make('Customer')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextEntry::make('customer_name'),
                                TextEntry::make('customer_email')
                                    ->copyable(),
                                TextEntry::make('customer_phone')
                                    ->copyable(),
                            ]),
                    ])
                    ->columnSpanFull(),
                Section::make('Shipping address')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('shipping_full_name'),
                                TextEntry::make('shipping_country'),
                                TextEntry::make('shipping_line_one')
                                    ->columnSpanFull(),
                                TextEntry::make('shipping_line_two')
                                    ->placeholder('-')
                                    ->columnSpanFull(),
                                TextEntry::make('shipping_city'),
                                TextEntry::make('shipping_region'),
                            ]),
                    ])
                    ->columnSpanFull(),
                Section::make('Billing address')
                    ->schema([
                        TextEntry::make('billing_same_as_shipping')
                            ->label('Billing same as shipping')
                            ->formatStateUsing(fn (mixed $state): string => $state ? 'Yes' : 'No'),
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('billing_full_name')
                                    ->placeholder('-'),
                                TextEntry::make('billing_country')
                                    ->placeholder('-'),
                                TextEntry::make('billing_line_one')
                                    ->placeholder('-')
                                    ->columnSpanFull(),
                                TextEntry::make('billing_line_two')
                                    ->placeholder('-')
                                    ->columnSpanFull(),
                                TextEntry::make('billing_city')
                                    ->placeholder('-'),
                                TextEntry::make('billing_region')
                                    ->placeholder('-'),
                            ]),
                    ])
                    ->columnSpanFull(),
                Section::make('Notes')
                    ->schema([
                        TextEntry::make('notes')
                            ->placeholder('No notes')
                            ->columnSpanFull(),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
