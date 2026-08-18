<?php

use App\Models\User;

test('admin users can access the Filament dashboard', function () {
    $admin = User::factory()->create([
        'is_admin' => true,
    ]);

    $this->actingAs($admin)
        ->get('/admin')
        ->assertOk();
});

test('admin users can access storefront settings pages', function () {
    $admin = User::factory()->create([
        'is_admin' => true,
    ]);

    $this->actingAs($admin)
        ->get('/admin/announcement-bars')
        ->assertOk();

    $this->actingAs($admin)
        ->get('/admin/delivery-settings')
        ->assertOk();
});

test('non admin users cannot access the Filament dashboard', function () {
    $user = User::factory()->create([
        'is_admin' => false,
    ]);

    $this->actingAs($user)
        ->get('/admin')
        ->assertForbidden();
});
