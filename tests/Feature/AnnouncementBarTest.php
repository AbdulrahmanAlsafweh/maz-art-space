<?php

use App\Models\AnnouncementBar;
use Inertia\Testing\AssertableInertia as Assert;

it('shares editable announcement bar settings with the storefront', function () {
    AnnouncementBar::query()->first()->update([
        'is_enabled' => true,
        'text_one' => 'Free delivery over Lebanon',
        'text_two' => 'Save $10 on the double kit',
        'background_color' => '#0f6b58',
        'text_color' => '#fff4df',
    ]);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('announcementBar.enabled', true)
            ->where('announcementBar.texts.0', 'Free delivery over Lebanon')
            ->where('announcementBar.texts.1', 'Save $10 on the double kit')
            ->where('announcementBar.backgroundColor', '#0f6b58')
            ->where('announcementBar.textColor', '#fff4df'));
});
