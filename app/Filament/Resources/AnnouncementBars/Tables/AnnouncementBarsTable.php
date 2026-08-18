<?php

namespace App\Filament\Resources\AnnouncementBars\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\ColorColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AnnouncementBarsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                IconColumn::make('is_enabled')
                    ->label('Visible')
                    ->boolean(),
                TextColumn::make('text_one')
                    ->label('First text')
                    ->searchable()
                    ->wrap(),
                TextColumn::make('text_two')
                    ->label('Second text')
                    ->searchable()
                    ->placeholder('Not set')
                    ->wrap(),
                ColorColumn::make('background_color')
                    ->label('Bar color'),
                ColorColumn::make('text_color')
                    ->label('Text color'),
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
