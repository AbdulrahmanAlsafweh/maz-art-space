<?php

namespace App\Filament\Resources\DeliverySettings\Pages;

use App\Filament\Resources\DeliverySettings\DeliverySettingResource;
use Filament\Resources\Pages\CreateRecord;

class CreateDeliverySetting extends CreateRecord
{
    protected static string $resource = DeliverySettingResource::class;

    protected function getRedirectUrl(): string
    {
        return static::getResource()::getUrl('edit', ['record' => $this->record]);
    }
}
