import '../css/app.css';

import { MazLoadingScreen } from '@/components/shared/maz-loading-screen';
import { ToastProvider } from '@/components/shared/toast-provider';
import { CartProvider } from '@/features/shop/components/cart-context';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');
document.documentElement.style.colorScheme = 'only light';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ToastProvider>
                <CartProvider>
                    <MazLoadingScreen />
                    <App {...props} />
                </CartProvider>
            </ToastProvider>,
        );

        window.requestAnimationFrame(() => {
            const initialLoader = document.getElementById('maz-initial-loader');

            if (!initialLoader) {
                return;
            }

            initialLoader.classList.add('maz-loading-screen--hide');
            window.setTimeout(() => initialLoader.remove(), 360);
        });
    },
    progress: {
        color: '#123b6d',
    },
});
