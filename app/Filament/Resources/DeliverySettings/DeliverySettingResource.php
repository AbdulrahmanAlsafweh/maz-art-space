<?php

namespace App\Filament\Resources\DeliverySettings;

use App\Filament\Resources\DeliverySettings\Pages\CreateDeliverySetting;
use App\Filament\Resources\DeliverySettings\Pages\EditDeliverySetting;
use App\Filament\Resources\DeliverySettings\Pages\ListDeliverySettings;
use App\Filament\Resources\DeliverySettings\Schemas\DeliverySettingForm;
use App\Filament\Resources\DeliverySettings\Tables\DeliverySettingsTable;
use App\Models\DeliverySetting;
use BackedEnum;
use Filament\Resources\Pages\PageRegistration;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use UnitEnum;

class DeliverySettingResource extends Resource
{
    protected static ?string $model = DeliverySetting::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTruck;

    protected static ?string $modelLabel = 'Delivery settings';

    protected static ?string $pluralModelLabel = 'Delivery settings';

    protected static ?string $navigationLabel = 'Delivery Costs';

    protected static string|UnitEnum|null $navigationGroup = 'Settings';

    protected static ?int $navigationSort = 3;

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
        return DeliverySettingForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DeliverySettingsTable::configure($table);
    }

    /**
     * @return array<string, PageRegistration>
     */
    public static function getPages(): array
    {
        return [
            'index' => ListDeliverySettings::route('/'),
            'create' => CreateDeliverySetting::route('/create'),
            'edit' => EditDeliverySetting::route('/{record}/edit'),
        ];
    }
}
