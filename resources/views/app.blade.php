<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="light" style="color-scheme: only light; background-color: #ffffff;">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="color-scheme" content="only light">
        <meta name="supported-color-schemes" content="light">
        <meta name="theme-color" content="#ffffff">

        <style>
            html,
            body,
            #app {
                color-scheme: only light !important;
                background-color: #ffffff !important;
            }
        </style>

        <link rel="icon" type="image/jpeg" href="{{ asset('logo.jpeg') }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=cormorant-garamond:500,600|instrument-sans:400,500,600&display=swap" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="bg-white font-sans text-[#111111] antialiased" style="color-scheme: only light; background-color: #ffffff; color: #111111;">
        @inertia
    </body>
</html>
