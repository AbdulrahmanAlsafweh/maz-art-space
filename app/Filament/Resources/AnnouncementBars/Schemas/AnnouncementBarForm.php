<?php

namespace App\Filament\Resources\AnnouncementBars\Schemas;

use App\Models\AnnouncementBar;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AnnouncementBarForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Content')
                    ->description('These messages appear in the narrow bar above the navigation.')
                    ->schema([
                        Toggle::make('is_enabled')
                            ->label('Show announcement bar')
                            ->default(true),
                        TextInput::make('text_one')
                            ->label('First text')
                            ->required()
                            ->maxLength(160)
                            ->default(AnnouncementBar::DEFAULT_TEXT_ONE),
                        TextInput::make('text_two')
                            ->label('Second text')
                            ->maxLength(160)
                            ->helperText('Optional. When filled, the website rotates between both texts smoothly.'),
                    ])
                    ->columnSpanFull(),
                Section::make('Appearance')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                ColorPicker::make('background_color')
                                    ->label('Bar color')
                                    ->hex()
                                    ->required()
                                    ->default(AnnouncementBar::DEFAULT_BACKGROUND_COLOR),
                                ColorPicker::make('text_color')
                                    ->label('Text color')
                                    ->hex()
                                    ->required()
                                    ->default(AnnouncementBar::DEFAULT_TEXT_COLOR),
                            ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
