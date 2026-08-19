<?php

use App\Models\PolicyPage;
use Inertia\Testing\AssertableInertia as Assert;

it('shares only enabled policy links with the storefront footer', function () {
    PolicyPage::query()
        ->where('slug', 'refund-policy')
        ->update(['is_enabled' => false]);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('policyPages', 3)
            ->where('policyPages.0.title', 'Delivery Policy')
            ->where('policyPages.1.title', 'Privacy Policy')
            ->where('policyPages.2.title', 'Terms & Conditions'));
});

it('serves enabled policy pages and blocks disabled policy pages', function () {
    PolicyPage::query()
        ->where('slug', 'delivery-policy')
        ->update([
            'title' => 'Delivery Details',
            'content' => 'Updated delivery content.',
        ]);

    $this->get('/policies/delivery-policy')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('policies/show')
            ->where('policy.title', 'Delivery Details')
            ->where('policy.content', 'Updated delivery content.'));

    PolicyPage::query()
        ->where('slug', 'delivery-policy')
        ->update(['is_enabled' => false]);

    $this->get('/policies/delivery-policy')->assertNotFound();
});
