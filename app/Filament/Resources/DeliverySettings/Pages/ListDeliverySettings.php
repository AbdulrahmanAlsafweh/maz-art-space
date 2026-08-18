<?php

namespace App\Filament\Resources\DeliverySettings\Pages;

use App\Filament\Resources\DeliverySettings\DeliverySettingResource;
use App\Models\DeliverySetting;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListDeliverySettings extends ListRecords
{
    protected static string $resource = DeliverySettingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->visible(fn (): bool => DeliverySetting::query()->doesntExist()),
        ];
    }
}
