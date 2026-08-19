<?php

namespace App\Filament\Resources\PolicyPages\Pages;

use App\Filament\Resources\PolicyPages\PolicyPageResource;
use Filament\Resources\Pages\EditRecord;

class EditPolicyPage extends EditRecord
{
    protected static string $resource = PolicyPageResource::class;

    protected function getHeaderActions(): array
    {
        return [
        ];
    }
}
