import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function MazLoadingScreen() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let showTimer = 0;

        const showLoader = () => {
            window.clearTimeout(showTimer);
            showTimer = window.setTimeout(() => setIsLoading(true), 120);
        };

        const hideLoader = () => {
            window.clearTimeout(showTimer);
            setIsLoading(false);
        };

        const removeStartListener = router.on('start', showLoader);
        const removeFinishListener = router.on('finish', hideLoader);

        return () => {
            window.clearTimeout(showTimer);
            removeStartListener();
            removeFinishListener();
        };
    }, []);

    return (
        <div className={['maz-loading-screen', isLoading ? 'maz-loading-screen--visible' : ''].join(' ')} aria-hidden={!isLoading}>
            <div className="maz-loading-card" role="status" aria-live="polite">
                <div className="maz-loading-logo">MAZ</div>
                <div className="maz-loading-line" aria-hidden="true" />
                <span className="sr-only">Loading</span>
            </div>
        </div>
    );
}
