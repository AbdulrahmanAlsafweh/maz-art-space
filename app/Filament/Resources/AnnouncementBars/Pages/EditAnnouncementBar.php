<?php

namespace App\Filament\Resources\AnnouncementBars\Pages;

use App\Filament\Resources\AnnouncementBars\AnnouncementBarResource;
use Filament\Resources\Pages\EditRecord;

class EditAnnouncementBar extends EditRecord
{
    protected static string $resource = AnnouncementBarResource::class;

    protected function getHeaderActions(): array
    {
        return [
        ];
    }
}
