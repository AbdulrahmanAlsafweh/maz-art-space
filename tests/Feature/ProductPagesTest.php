<?php

use Inertia\Testing\AssertableInertia as Assert;

it('serves separate product pages for the single and double kits', function () {
    $this->get('/products/maz-watercolor-kit')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('products/maz-watercolor-kit'));

    $this->get('/products/maz-watercolor-double-kit')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('products/maz-watercolor-double-kit'));
});
