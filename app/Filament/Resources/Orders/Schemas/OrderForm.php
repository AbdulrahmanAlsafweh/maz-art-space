<?php

namespace App\Filament\Resources\Orders\Schemas;

use App\Models\DeliverySetting;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class OrderForm
{
    /**
     * @return array<string, string>
     */
    public static function statusOptions(): array
    {
        return [
            'pending' => 'Pending',
            'processing' => 'Processing',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
        ];
    }

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Order')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextInput::make('order_number')
                                    ->label('Order number')
                                    ->disabled(),
                                Select::make('status')
                                    ->options(self::statusOptions())
                                    ->required()
                                    ->native(false),
                                TextInput::make('payment_method')
                                    ->label('Payment')
                                    ->formatStateUsing(fn (?string $state): string => str($state ?? '')->headline()->toString())
                                    ->disabled(),
                                TextInput::make('subtotal_cents')
                                    ->label('Subtotal')
                                    ->formatStateUsing(fn (?int $state): string => '$'.number_format(($state ?? 0) / 100, 2))
                                    ->disabled(),
                                TextInput::make('discount_cents')
                                    ->label('Discount')
                                    ->formatStateUsing(fn (?int $state): string => '$'.number_format(($state ?? 0) / 100, 2))
                                    ->disabled(),
                                TextInput::make('shipping_cents')
                                    ->label('Shipping')
                                    ->formatStateUsing(fn (?int $state): string => '$'.number_format(($state ?? 0) / 100, 2))
                                    ->disabled(),
                                Select::make('delivery_zone')
                                    ->label('Delivery zone')
                                    ->options(DeliverySetting::zoneOptions())
                                    ->disabled(),
                                TextInput::make('total_cents')
                                    ->label('Total')
                                    ->formatStateUsing(fn (?int $state): string => '$'.number_format(($state ?? 0) / 100, 2))
                                    ->disabled(),
                            ]),
                    ])
                    ->columnSpanFull(),
                Section::make('Customer')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextInput::make('customer_name')
                                    ->required()
                                    ->maxLength(255),
                                TextInput::make('customer_email')
                                    ->email()
                                    ->maxLength(255),
                                TextInput::make('customer_phone')
                                    ->required()
                                    ->maxLength(40),
                            ]),
                    ])
                    ->columnSpanFull(),
                Section::make('Shipping address')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('shipping_full_name')
                                    ->required()
                                    ->maxLength(255),
                                TextInput::make('shipping_country')
                                    ->required()
                                    ->maxLength(120),
                                TextInput::make('shipping_line_one')
                                    ->required()
                                    ->maxLength(255)
                                    ->columnSpanFull(),
                                TextInput::make('shipping_line_two')
                                    ->maxLength(255)
                                    ->columnSpanFull(),
                                TextInput::make('shipping_city')
                                    ->required()
                                    ->maxLength(120),
                                TextInput::make('shipping_region')
                                    ->required()
                                    ->maxLength(120),
                            ]),
                    ])
                    ->columnSpanFull(),
                Section::make('Billing address')
                    ->schema([
                        Toggle::make('billing_same_as_shipping')
                            ->label('Billing address same as shipping'),
                        Grid::make(2)
                            ->schema([
                                TextInput::make('billing_full_name')
                                    ->maxLength(255),
                                TextInput::make('billing_country')
                                    ->maxLength(120),
                                TextInput::make('billing_line_one')
                                    ->maxLength(255)
                                    ->columnSpanFull(),
                                TextInput::make('billing_line_two')
                                    ->maxLength(255)
                                    ->columnSpanFull(),
                                TextInput::make('billing_city')
                                    ->maxLength(120),
                                TextInput::make('billing_region')
                                    ->maxLength(120),
                            ]),
                    ])
                    ->columnSpanFull(),
                Section::make('Notes')
                    ->schema([
                        Textarea::make('notes')
                            ->rows(4)
                            ->maxLength(1000)
                            ->columnSpanFull(),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
