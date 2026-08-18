<?php

namespace App\Filament\Resources\AnnouncementBars\Pages;

use App\Filament\Resources\AnnouncementBars\AnnouncementBarResource;
use App\Models\AnnouncementBar;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListAnnouncementBars extends ListRecords
{
    protected static string $resource = AnnouncementBarResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->visible(fn (): bool => AnnouncementBar::query()->doesntExist()),
        ];
    }
}
