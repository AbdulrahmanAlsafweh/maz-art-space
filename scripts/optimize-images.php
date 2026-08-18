<?php

declare(strict_types=1);

if (! function_exists('imagewebp')) {
    fwrite(STDERR, "The GD WebP encoder is not available.\n");
    exit(1);
}

$root = dirname(__DIR__);

$jobs = [
    ['public/what_inside/box.png', 'public/optimized/box-900.webp', 900, 82],
    ['public/what_inside/box.png', 'public/optimized/box-1400.webp', 1400, 82],
];

$whatInsideImages = [
    'box.png' => 1400,
    'colots.png' => 1600,
    'gold_clip.png' => 700,
    'water_brush_pen.png' => 700,
    'watercolor_paper_padi.png' => 900,
    'white_sponge.png' => 800,
    'wood_palette.png' => 1000,
];

foreach ($whatInsideImages as $file => $maxWidth) {
    $jobs[] = ["public/what_inside/{$file}", 'public/optimized/what_inside/'.pathinfo($file, PATHINFO_FILENAME).'.webp', $maxWidth, 82];
}

$productImages = glob($root.'/public/product/*.{png,jpg,jpeg}', GLOB_BRACE) ?: [];

foreach ($productImages as $source) {
    $file = basename($source);
    $jobs[] = ['public/product/'.$file, 'public/optimized/product/'.pathinfo($file, PATHINFO_FILENAME).'.webp', 1400, 82];
}

$galleryImages = glob($root.'/public/gallery/*.{png,jpg,jpeg}', GLOB_BRACE) ?: [];

foreach ($galleryImages as $source) {
    $file = basename($source);
    $jobs[] = ['public/gallery/'.$file, 'public/optimized/gallery/'.pathinfo($file, PATHINFO_FILENAME).'.webp', 1200, 82];
}

$colorFiles = glob($root.'/public/colors/*_{closed,opened}.png', GLOB_BRACE) ?: [];

foreach ($colorFiles as $source) {
    $file = basename($source);
    $jobs[] = ['public/colors/'.$file, 'public/optimized/colors/'.pathinfo($file, PATHINFO_FILENAME).'.webp', 420, 82];
}

foreach ($jobs as [$source, $destination, $maxWidth, $quality]) {
    convertToWebp($root.'/'.$source, $root.'/'.$destination, $maxWidth, $quality);
}

function convertToWebp(string $source, string $destination, int $maxWidth, int $quality): void
{
    if (! is_file($source)) {
        fwrite(STDERR, "Missing source: {$source}\n");

        return;
    }

    $imageData = file_get_contents($source);

    if ($imageData === false) {
        fwrite(STDERR, "Unable to read: {$source}\n");

        return;
    }

    $sourceImage = imagecreatefromstring($imageData);

    if (! $sourceImage instanceof GdImage) {
        fwrite(STDERR, "Unable to decode: {$source}\n");

        return;
    }

    $sourceWidth = imagesx($sourceImage);
    $sourceHeight = imagesy($sourceImage);
    $scale = min(1, $maxWidth / max($sourceWidth, 1));
    $targetWidth = max(1, (int) round($sourceWidth * $scale));
    $targetHeight = max(1, (int) round($sourceHeight * $scale));

    $targetImage = imagecreatetruecolor($targetWidth, $targetHeight);
    imagealphablending($targetImage, false);
    imagesavealpha($targetImage, true);

    $transparent = imagecolorallocatealpha($targetImage, 0, 0, 0, 127);
    imagefilledrectangle($targetImage, 0, 0, $targetWidth, $targetHeight, $transparent);

    imagecopyresampled($targetImage, $sourceImage, 0, 0, 0, 0, $targetWidth, $targetHeight, $sourceWidth, $sourceHeight);

    $directory = dirname($destination);

    if (! is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    imagewebp($targetImage, $destination, $quality);
    imagedestroy($sourceImage);
    imagedestroy($targetImage);

    $sourceSize = filesize($source) ?: 0;
    $destinationSize = filesize($destination) ?: 0;
    $savedPercent = $sourceSize > 0 ? round((1 - ($destinationSize / $sourceSize)) * 100) : 0;

    echo sprintf(
        "%s -> %s (%dx%d, %s%% smaller)\n",
        str_replace('\\', '/', $source),
        str_replace('\\', '/', $destination),
        $targetWidth,
        $targetHeight,
        $savedPercent,
    );
}
