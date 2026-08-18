<?php

namespace App\Filament\Resources\AnnouncementBars;

use App\Filament\Resources\AnnouncementBars\Pages\CreateAnnouncementBar;
use App\Filament\Resources\AnnouncementBars\Pages\EditAnnouncementBar;
use App\Filament\Resources\AnnouncementBars\Pages\ListAnnouncementBars;
use App\Filament\Resources\AnnouncementBars\Schemas\AnnouncementBarForm;
use App\Filament\Resources\AnnouncementBars\Tables\AnnouncementBarsTable;
use App\Models\AnnouncementBar;
use BackedEnum;
use Filament\Resources\Pages\PageRegistration;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use UnitEnum;

class AnnouncementBarResource extends Resource
{
    protected static ?string $model = AnnouncementBar::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMegaphone;

    protected static ?string $modelLabel = 'Announcement bar';

    protected static ?string $pluralModelLabel = 'Announcement bar';

    protected static ?string $navigationLabel = 'Top Bar';

    protected static string|UnitEnum|null $navigationGroup = 'Settings';

    protected static ?int $navigationSort = 2;

    public static function canCreate(): bool
    {
        try {
            return static::getModel()::query()->count() === 0;
        } catch (QueryException) {
            return false;
        }
    }

    public static function canDelete(Model $record): bool
    {
        return false;
    }

    public static function canDeleteAny(): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return AnnouncementBarForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AnnouncementBarsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    /**
     * @return array<string, PageRegistration>
     */
    public static function getPages(): array
    {
        return [
            'index' => ListAnnouncementBars::route('/'),
            'create' => CreateAnnouncementBar::route('/create'),
            'edit' => EditAnnouncementBar::route('/{record}/edit'),
        ];
    }
}
