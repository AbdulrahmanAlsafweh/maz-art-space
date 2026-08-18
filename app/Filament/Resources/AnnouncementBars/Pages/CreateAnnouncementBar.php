<?php

namespace App\Filament\Resources\AnnouncementBars\Pages;

use App\Filament\Resources\AnnouncementBars\AnnouncementBarResource;
use Filament\Resources\Pages\CreateRecord;

class CreateAnnouncementBar extends CreateRecord
{
    protected static string $resource = AnnouncementBarResource::class;

    protected function getRedirectUrl(): string
    {
        return static::getResource()::getUrl('edit', ['record' => $this->record]);
    }
}
