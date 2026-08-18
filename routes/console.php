<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('admin:create', function () {
    $name = $this->ask('Name');
    $email = $this->ask('Email');
    $password = $this->secret('Password');

    if (! $name || ! $email || ! $password) {
        $this->error('Name, email, and password are required.');

        return self::FAILURE;
    }

    User::query()->updateOrCreate(
        ['email' => $email],
        [
            'name' => $name,
            'password' => Hash::make($password),
            'is_admin' => true,
        ],
    );

    $this->info("Admin user [{$email}] is ready.");

    return self::SUCCESS;
})->purpose('Create or promote a Filament admin user');
