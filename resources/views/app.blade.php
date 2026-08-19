<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="light" style="color-scheme: only light; background-color: #ffffff;">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
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

            #maz-initial-loader {
                position: fixed;
                inset: 0;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #ffffff;
                color: #111111;
                transition: opacity 320ms ease, visibility 320ms ease;
            }

            #maz-initial-loader.maz-loading-screen--hide {
                visibility: hidden;
                opacity: 0;
            }

            .maz-initial-loader__logo {
                font-family: 'Cormorant Garamond', Georgia, serif;
                font-size: clamp(4rem, 14vw, 7rem);
                line-height: 1;
                font-weight: 600;
                letter-spacing: 0.03em;
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
        <div id="maz-initial-loader" role="status" aria-live="polite">
            <span class="maz-initial-loader__logo">MAZ</span>
            <span style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">Loading</span>
        </div>
        @inertia
    </body>
</html>
