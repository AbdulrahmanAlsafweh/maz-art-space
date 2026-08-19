<?php

namespace App\Filament\Resources\PolicyPages;

use App\Filament\Resources\PolicyPages\Pages\EditPolicyPage;
use App\Filament\Resources\PolicyPages\Pages\ListPolicyPages;
use App\Filament\Resources\PolicyPages\Schemas\PolicyPageForm;
use App\Filament\Resources\PolicyPages\Tables\PolicyPagesTable;
use App\Models\PolicyPage;
use BackedEnum;
use Filament\Resources\Pages\PageRegistration;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;
use UnitEnum;

class PolicyPageResource extends Resource
{
    protected static ?string $model = PolicyPage::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static ?string $modelLabel = 'Policy page';

    protected static ?string $pluralModelLabel = 'Policy pages';

    protected static ?string $navigationLabel = 'Policies';

    protected static string|UnitEnum|null $navigationGroup = 'Settings';

    protected static ?int $navigationSort = 4;

    public static function canCreate(): bool
    {
        return false;
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
        return PolicyPageForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PolicyPagesTable::configure($table);
    }

    /**
     * @return array<string, PageRegistration>
     */
    public static function getPages(): array
    {
        return [
            'index' => ListPolicyPages::route('/'),
            'edit' => EditPolicyPage::route('/{record}/edit'),
        ];
    }
}
