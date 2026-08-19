<?php

namespace App\Filament\Resources\DeliverySettings\Schemas;

use App\Models\DeliverySetting;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class DeliverySettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Delivery prices')
                    ->description('Set the delivery charge shown during checkout. Values are stored in USD.')
                    ->schema([
                        Select::make('pricing_mode')
                            ->label('Pricing mode')
                            ->options(DeliverySetting::pricingModeOptions())
                            ->default(DeliverySetting::PRICING_MODE_BY_ZONE)
                            ->native(false)
                            ->live()
                            ->required()
                            ->columnSpanFull(),
                        self::moneyInput('same_price_cents', 'Same delivery price')
                            ->helperText('Shown to customers without asking them to choose inside or outside Tripoli.')
                            ->required(fn (Get $get): bool => $get('pricing_mode') === DeliverySetting::PRICING_MODE_SAME_PRICE)
                            ->visible(fn (Get $get): bool => $get('pricing_mode') === DeliverySetting::PRICING_MODE_SAME_PRICE)
                            ->columnSpanFull(),
                        Grid::make(2)
                            ->schema([
                                self::moneyInput('inside_tripoli_cents', 'Inside Tripoli')
                                    ->required(fn (Get $get): bool => $get('pricing_mode') !== DeliverySetting::PRICING_MODE_SAME_PRICE),
                                self::moneyInput('outside_tripoli_cents', 'Outside Tripoli')
                                    ->required(fn (Get $get): bool => $get('pricing_mode') !== DeliverySetting::PRICING_MODE_SAME_PRICE),
                            ])
                            ->visible(fn (Get $get): bool => $get('pricing_mode') !== DeliverySetting::PRICING_MODE_SAME_PRICE),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    private static function moneyInput(string $name, string $label): TextInput
    {
        return TextInput::make($name)
            ->label($label)
            ->prefix('$')
            ->numeric()
            ->minValue(0)
            ->step(0.01)
            ->formatStateUsing(fn (?int $state): string => number_format(($state ?? 0) / 100, 2, '.', ''))
            ->dehydrateStateUsing(fn (mixed $state): int => (int) round(((float) $state) * 100));
    }
}
