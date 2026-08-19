<?php

namespace App\Filament\Resources\Orders\Actions;

use App\Models\Order;
use Filament\Actions\Action;
use Filament\Support\Icons\Heroicon;

class PrintOrderInvoiceAction
{
    public static function make(string $name = 'printInvoice'): Action
    {
        return Action::make($name)
            ->label('Print invoice')
            ->icon(Heroicon::OutlinedPrinter)
            ->url(fn (Order $record): string => route('admin.orders.invoice', ['order' => $record]))
            ->openUrlInNewTab();
    }
}
