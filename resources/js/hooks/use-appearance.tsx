import { useEffect } from 'react';

export type Appearance = 'light';

const applyLightTheme = () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.style.colorScheme = 'only light';
};

export function initializeTheme() {
    localStorage.setItem('appearance', 'light');
    applyLightTheme();
}

export function useAppearance() {
    const appearance: Appearance = 'light';

    const updateAppearance: (mode: Appearance) => void = () => {
        localStorage.setItem('appearance', 'light');
        applyLightTheme();
    };

    useEffect(() => {
        localStorage.setItem('appearance', 'light');
        applyLightTheme();
    }, []);

    return { appearance, updateAppearance };
}
