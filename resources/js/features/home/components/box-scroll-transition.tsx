import gsap from 'gsap';
import { type RefObject, useLayoutEffect } from 'react';

interface BoxScrollTransitionProps {
    sourceRef: RefObject<HTMLImageElement | null>;
    targetRef: RefObject<HTMLElement | null>;
}

interface TransitionGeometry {
    endScroll: number;
    scaleX: number;
    scaleY: number;
    x: number;
    y: number;
}

interface SourceGeometry {
    coordinateScale: number;
    height: number;
    left: number;
    top: number;
    width: number;
}

function clamp(value: number, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
}

function interpolate(start: number, end: number, progress: number) {
    return start + (end - start) * progress;
}

export function BoxScrollTransition({ sourceRef, targetRef }: BoxScrollTransitionProps) {
    useLayoutEffect(() => {
        const sourceImage = sourceRef.current;
        const targetElement = targetRef.current;

        if (!sourceImage || !targetElement) {
            return;
        }

        let geometry: TransitionGeometry = { endScroll: 1, scaleX: 1, scaleY: 1, x: 0, y: 0 };
        let sourceGeometry: SourceGeometry = { coordinateScale: 1, height: 1, left: 0, top: 0, width: 1 };
        let frameId = 0;
        let isDisposed = false;
        const transitionEase = gsap.parseEase('power1.inOut');

        const refreshTargetGeometry = () => {
            const targetBounds = targetElement.getBoundingClientRect();
            const targetDocumentLeft = targetBounds.left + window.scrollX;
            const targetDocumentTop = targetBounds.top + window.scrollY;
            const landingViewportRatio = window.innerWidth >= 768 ? 0.72 : 0.68;

            geometry = {
                endScroll: Math.max(window.innerHeight * 0.52, targetDocumentTop - window.innerHeight * landingViewportRatio),
                scaleX: targetBounds.width / sourceGeometry.width,
                scaleY: targetBounds.height / sourceGeometry.height,
                x: (targetDocumentLeft - sourceGeometry.left) / sourceGeometry.coordinateScale,
                y: (targetDocumentTop - sourceGeometry.top) / sourceGeometry.coordinateScale,
            };
        };

        const render = () => {
            frameId = 0;
            refreshTargetGeometry();

            const rawProgress = clamp(window.scrollY / geometry.endScroll);
            const progress = transitionEase(rawProgress);

            gsap.set(sourceImage, {
                force3D: true,
                rotation: Math.sin(progress * Math.PI) * -0.45,
                scaleX: interpolate(1, geometry.scaleX, progress),
                scaleY: interpolate(1, geometry.scaleY, progress),
                transformOrigin: '0 0',
                x: geometry.x * progress,
                y: geometry.y * progress,
            });
        };

        const measure = () => {
            gsap.set(sourceImage, { rotation: 0, scaleX: 1, scaleY: 1, x: 0, y: 0 });

            const sourceBounds = sourceImage.getBoundingClientRect();
            sourceGeometry = {
                coordinateScale: sourceImage.offsetWidth > 0 ? sourceBounds.width / sourceImage.offsetWidth : 1,
                height: sourceBounds.height || 1,
                left: sourceBounds.left + window.scrollX,
                top: sourceBounds.top + window.scrollY,
                width: sourceBounds.width || 1,
            };

            render();
        };

        const scheduleRender = () => {
            if (frameId || isDisposed) {
                return;
            }

            frameId = window.requestAnimationFrame(render);
        };

        const scheduleMeasure = () => {
            if (isDisposed) {
                return;
            }

            window.cancelAnimationFrame(frameId);
            frameId = window.requestAnimationFrame(() => {
                frameId = 0;
                measure();
            });
        };

        gsap.set(sourceImage, { opacity: 1, willChange: 'transform' });
        measure();

        const resizeObserver = new ResizeObserver(scheduleMeasure);
        const delayedMeasureIds = [100, 500, 1500].map((delay) => window.setTimeout(scheduleMeasure, delay));
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                scheduleMeasure();
            }
        };

        window.addEventListener('scroll', scheduleRender, { passive: true });
        window.addEventListener('resize', scheduleMeasure);
        window.addEventListener('orientationchange', scheduleMeasure);
        window.addEventListener('pageshow', scheduleMeasure);
        window.addEventListener('load', scheduleMeasure);
        window.visualViewport?.addEventListener('resize', scheduleMeasure);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.fonts?.addEventListener('loadingdone', scheduleMeasure);
        sourceImage.addEventListener('load', scheduleMeasure);
        resizeObserver.observe(sourceImage);
        resizeObserver.observe(targetElement);
        if (sourceImage.parentElement) {
            resizeObserver.observe(sourceImage.parentElement);
        }
        if (targetElement.parentElement) {
            resizeObserver.observe(targetElement.parentElement);
        }
        void document.fonts?.ready.then(scheduleMeasure);

        return () => {
            isDisposed = true;
            window.cancelAnimationFrame(frameId);
            delayedMeasureIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
            window.removeEventListener('scroll', scheduleRender);
            window.removeEventListener('resize', scheduleMeasure);
            window.removeEventListener('orientationchange', scheduleMeasure);
            window.removeEventListener('pageshow', scheduleMeasure);
            window.removeEventListener('load', scheduleMeasure);
            window.visualViewport?.removeEventListener('resize', scheduleMeasure);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.fonts?.removeEventListener('loadingdone', scheduleMeasure);
            sourceImage.removeEventListener('load', scheduleMeasure);
            resizeObserver.disconnect();
            gsap.set(sourceImage, { clearProps: 'opacity,transform,willChange' });
        };
    }, [sourceRef, targetRef]);

    return null;
}
