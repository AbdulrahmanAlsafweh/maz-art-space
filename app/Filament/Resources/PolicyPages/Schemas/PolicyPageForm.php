<?php

namespace App\Filament\Resources\PolicyPages\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PolicyPageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Visibility')
                    ->description('Disabled policies are hidden from the footer and unavailable on the website.')
                    ->schema([
                        Toggle::make('is_enabled')
                            ->label('Show this policy')
                            ->default(true),
                    ])
                    ->columnSpanFull(),
                Section::make('Content')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('title')
                                    ->required()
                                    ->maxLength(120),
                                TextInput::make('slug')
                                    ->disabled()
                                    ->dehydrated(false),
                            ]),
                        Textarea::make('content')
                            ->label('Policy content')
                            ->required()
                            ->rows(14)
                            ->columnSpanFull(),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
