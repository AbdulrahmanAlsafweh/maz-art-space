<?php

namespace App\Http\Controllers;

use App\Models\PolicyPage;
use Inertia\Inertia;
use Inertia\Response;

class PolicyPageController extends Controller
{
    public function __invoke(string $slug): Response
    {
        $policy = PolicyPage::query()
            ->where('slug', $slug)
            ->where('is_enabled', true)
            ->firstOrFail();

        return Inertia::render('policies/show', [
            'policy' => [
                'title' => $policy->title,
                'slug' => $policy->slug,
                'content' => $policy->content,
                'updatedAt' => $policy->updated_at?->format('F j, Y'),
            ],
        ]);
    }
}
