<?php

namespace App\Filament\Resources\DeliverySettings\Tables;

use App\Models\DeliverySetting;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class DeliverySettingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('pricing_mode')
                    ->label('Mode')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => DeliverySetting::pricingModeOptions()[$state] ?? 'Inside / outside Tripoli prices'),
                TextColumn::make('same_price_cents')
                    ->label('Same price')
                    ->money('USD', divideBy: 100),
                TextColumn::make('inside_tripoli_cents')
                    ->label('Inside Tripoli')
                    ->money('USD', divideBy: 100),
                TextColumn::make('outside_tripoli_cents')
                    ->label('Outside Tripoli')
                    ->money('USD', divideBy: 100),
                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->dateTime('M j, Y g:i A')
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
            ]);
    }
}
