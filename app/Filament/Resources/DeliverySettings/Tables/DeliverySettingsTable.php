<?php

namespace App\Filament\Resources\DeliverySettings\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class DeliverySettingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
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
