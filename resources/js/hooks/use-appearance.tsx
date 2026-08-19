import { useEffect } from 'react';

export type Appearance = 'light';

const applyLightTheme = () => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.style.colorScheme = 'only light';
};

const persistLightTheme = () => {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.setItem('appearance', 'light');
    } catch {
        // iOS Safari can block localStorage in some browsing modes.
    }
};

export function initializeTheme() {
    persistLightTheme();
    applyLightTheme();
}

export function useAppearance() {
    const appearance: Appearance = 'light';

    const updateAppearance: (mode: Appearance) => void = () => {
        persistLightTheme();
        applyLightTheme();
    };

    useEffect(() => {
        persistLightTheme();
        applyLightTheme();
    }, []);

    return { appearance, updateAppearance };
}
