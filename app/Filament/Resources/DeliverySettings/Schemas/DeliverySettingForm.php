<?php

namespace App\Filament\Resources\DeliverySettings\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
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
                        Grid::make(2)
                            ->schema([
                                self::moneyInput('inside_tripoli_cents', 'Inside Tripoli'),
                                self::moneyInput('outside_tripoli_cents', 'Outside Tripoli'),
                            ]),
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
            ->required()
            ->formatStateUsing(fn (?int $state): string => number_format(($state ?? 0) / 100, 2, '.', ''))
            ->dehydrateStateUsing(fn (mixed $state): int => (int) round(((float) $state) * 100));
    }
}
