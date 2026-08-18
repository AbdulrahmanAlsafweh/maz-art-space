<?php

namespace App\Filament\Resources\DeliverySettings\Pages;

use App\Filament\Resources\DeliverySettings\DeliverySettingResource;
use Filament\Resources\Pages\EditRecord;

class EditDeliverySetting extends EditRecord
{
    protected static string $resource = DeliverySettingResource::class;

    protected function getHeaderActions(): array
    {
        return [
        ];
    }
}
