import { useEffect, useRef, useState, type CSSProperties } from 'react';

interface ColorTube {
    name: string;
    slug: string;
}

interface StageSize {
    width: number;
    height: number;
}

const colorTubes: ColorTube[] = [
    { name: 'Titanium White', slug: 'titanium_white' },
    { name: 'Burnt Umber', slug: 'burnet_umber' },
    { name: 'Lamp Black', slug: 'lamp_black' },
    { name: 'Vermilion', slug: 'vermilion' },
    { name: 'Sap Green', slug: 'sap_green' },
    { name: 'Scarlet Lake', slug: 'scarlet_lake' },
    { name: 'Yellow Ochre', slug: 'yellow_ochre' },
    { name: 'Prussian Blue', slug: 'prussian_blue' },
    { name: 'Lemon Yellow', slug: 'lemon_yellow' },
    { name: 'Violet', slug: 'violet' },
    { name: 'Cerulean Blue', slug: 'cerulean_blue' },
    { name: 'Permanent Green', slug: 'permanent_green' },
];

function clamp(value: number, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
}

function easeInOut(value: number) {
    return value * value * value * (value * (value * 6 - 15) + 10);
}

function interpolate(start: number, end: number, progress: number) {
    return start + (end - start) * progress;
}

export function ColorScrollAnimation() {
    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);
    const targetProgressRef = useRef(0);
    const [progress, setProgress] = useState(0);
    const [stageSize, setStageSize] = useState<StageSize>({ width: 644, height: 357 });
    const [activeColorSlug, setActiveColorSlug] = useState<string | null>(null);
    const [hasInteractedWithColors, setHasInteractedWithColors] = useState(false);
    const [supportsHover, setSupportsHover] = useState(true);

    useEffect(() => {
        const stage = stageRef.current;

        if (!stage) {
            return;
        }

        const updateStageSize = () => {
            const rect = stage.getBoundingClientRect();

            setStageSize({
                width: stage.offsetWidth || rect.width || 644,
                height: stage.offsetHeight || rect.height || 357,
            });
        };

        updateStageSize();

        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', updateStageSize);

            return () => window.removeEventListener('resize', updateStageSize);
        }

        const observer = new ResizeObserver(updateStageSize);
        observer.observe(stage);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            setProgress(1);
            return;
        }

        let scrollFrameId = 0;
        let smoothingFrameId = 0;
        let lastFrameTime = performance.now();

        const setSmoothedProgress = (nextProgress: number) => {
            progressRef.current = nextProgress;
            setProgress(nextProgress);
        };

        const animateProgress = (time: number) => {
            const elapsed = Math.min(time - lastFrameTime, 64);
            lastFrameTime = time;

            const currentProgress = progressRef.current;
            const targetProgress = targetProgressRef.current;
            const smoothing = 1 - Math.pow(0.0008, elapsed / 1000);
            const nextProgress = currentProgress + (targetProgress - currentProgress) * smoothing;

            if (Math.abs(targetProgress - nextProgress) < 0.0008) {
                setSmoothedProgress(targetProgress);
                smoothingFrameId = 0;
                return;
            }

            setSmoothedProgress(nextProgress);
            smoothingFrameId = window.requestAnimationFrame(animateProgress);
        };

        const scheduleSmoothing = () => {
            if (smoothingFrameId) {
                return;
            }

            lastFrameTime = performance.now();
            smoothingFrameId = window.requestAnimationFrame(animateProgress);
        };

        const updateProgress = () => {
            const section = sectionRef.current;

            if (!section) {
                return;
            }

            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight || 1;
            const travel = Math.max(rect.height - viewportHeight * 0.42, 1);
            const nextProgress = clamp((viewportHeight * 0.72 - rect.top) / travel, 0, 1.25);

            targetProgressRef.current = nextProgress;
            scheduleSmoothing();
        };

        const scheduleUpdate = () => {
            window.cancelAnimationFrame(scrollFrameId);
            scrollFrameId = window.requestAnimationFrame(updateProgress);
        };

        updateProgress();
        window.addEventListener('scroll', scheduleUpdate, { passive: true });
        window.addEventListener('resize', scheduleUpdate);

        return () => {
            window.cancelAnimationFrame(scrollFrameId);
            window.cancelAnimationFrame(smoothingFrameId);
            window.removeEventListener('scroll', scheduleUpdate);
            window.removeEventListener('resize', scheduleUpdate);
        };
    }, []);

    useEffect(() => {
        const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

        const updatePointerMode = () => setSupportsHover(hoverQuery.matches);

        updatePointerMode();
        hoverQuery.addEventListener('change', updatePointerMode);

        return () => hoverQuery.removeEventListener('change', updatePointerMode);
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!section || supportsHover || hasInteractedWithColors || prefersReducedMotion) {
            return;
        }

        let previewTimeoutId = 0;
        let clearPreviewTimeoutId = 0;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    return;
                }

                previewTimeoutId = window.setTimeout(() => {
                    setActiveColorSlug(colorTubes[0].slug);
                    clearPreviewTimeoutId = window.setTimeout(() => setActiveColorSlug(null), 1100);
                }, 650);

                observer.disconnect();
            },
            { threshold: 0.42 },
        );

        observer.observe(section);

        return () => {
            observer.disconnect();
            window.clearTimeout(previewTimeoutId);
            window.clearTimeout(clearPreviewTimeoutId);
        };
    }, [hasInteractedWithColors, supportsHover]);

    const animationStart = 0.42;
    const animationEnd = 1.18;
    const easedProgress = easeInOut(clamp((progress - animationStart) / (animationEnd - animationStart)));
    const isCompactLayout = stageSize.width < 820;
    const baseItemWidth = isCompactLayout ? clamp(stageSize.width / 7.2, 42, 78) : clamp(stageSize.width / 6.45, 67, 117);
    const itemWidth = baseItemWidth * (isCompactLayout ? 1.1 : 1.05);
    const itemHeight = itemWidth * 1.67;
    const centerX = stageSize.width / 2;
    const centerY = stageSize.height * 0.5;
    const circleRadius = isCompactLayout ? clamp(stageSize.width * 0.2, 50, 86) : clamp(stageSize.width * 0.2, 75, 150);
    const rowLength = isCompactLayout ? 6 : colorTubes.length;
    const lineSpacing = Math.min(itemWidth * (isCompactLayout ? 1.2 : 1.16), (stageSize.width * (isCompactLayout ? 0.8 : 0.9)) / (rowLength - 1));
    const lineWidth = lineSpacing * (colorTubes.length - 1);
    const compactLineWidth = lineSpacing * (rowLength - 1);
    const lineY = isCompactLayout ? stageSize.height * 0.34 : stageSize.height * 0.62;
    const rowGap = itemHeight * (isCompactLayout ? 1.48 : 1.18);
    const activeColor = activeColorSlug ? colorTubes.find((tube) => tube.slug === activeColorSlug) : null;

    return (
        <section
            ref={sectionRef}
            className="relative h-[471px] overflow-x-hidden overflow-y-visible bg-white px-6 pt-24 pb-16 md:h-[598px] md:px-10 md:pt-32 md:pb-0"
        >
            <div className="relative z-10 mx-auto max-w-3xl text-center">
                <h2 className="font-['Cormorant_Garamond'] text-[29px] leading-none font-medium text-[#123b6d] md:text-[41px]">The Color Palette</h2>
                <p className="mt-7 text-[10px] leading-7 text-[#4c525c]">Twelve expressive pigments ready for every wash, blend, and detail.</p>
                <p className="mt-5 text-[9px] font-medium tracking-[0.12em] text-[#123b6d] uppercase md:hidden">Tap a tube to reveal its shade</p>
            </div>

            <div className="sticky top-[14vh] mx-auto mt-12 flex h-[288px] max-w-[1495px] items-start justify-center overflow-x-hidden overflow-y-visible md:top-[22vh] md:mt-28 md:h-[379px] md:items-center">
                <div ref={stageRef} className="relative h-[241px] w-full max-w-[1438px] md:h-[362px]">
                    {colorTubes.map((tube, index) => {
                        const angle = (index / colorTubes.length) * Math.PI * 2 - Math.PI / 2;
                        const angleDegrees = (angle * 180) / Math.PI + 90;
                        const circleX = centerX + Math.cos(angle) * circleRadius;
                        const circleY = centerY + Math.sin(angle) * circleRadius;
                        const compactRow = Math.floor(index / rowLength);
                        const compactColumn = index % rowLength;
                        const lineX = isCompactLayout
                            ? centerX - compactLineWidth / 2 + compactColumn * lineSpacing
                            : centerX - lineWidth / 2 + index * lineSpacing;
                        const finalLineY = isCompactLayout ? lineY + compactRow * rowGap : lineY;
                        const x = interpolate(circleX, lineX, easedProgress);
                        const y = interpolate(circleY, finalLineY, easedProgress);
                        const rotation = interpolate(angleDegrees, 0, easedProgress);
                        const scale = interpolate(0.9, 1, easedProgress);
                        const isActive = activeColorSlug === tube.slug;
                        const shouldShowTapCue = !supportsHover && !hasInteractedWithColors && index === 0;
                        const style: CSSProperties = {
                            height: itemHeight,
                            left: x,
                            top: y,
                            transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
                            willChange: 'transform',
                            width: itemWidth,
                            zIndex: 20 + index,
                        };

                        return (
                            <button
                                key={tube.slug}
                                type="button"
                                aria-label={`${tube.name} paint tube`}
                                aria-pressed={isActive}
                                className="group absolute rounded-full focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#123b6d]"
                                onClick={() => {
                                    if (supportsHover) {
                                        return;
                                    }

                                    setHasInteractedWithColors(true);
                                    setActiveColorSlug((currentSlug) => (currentSlug === tube.slug ? null : tube.slug));
                                }}
                                style={style}
                            >
                                <span
                                    className={[
                                        'relative block h-full w-full transition-transform duration-500 ease-out group-focus-visible:-translate-y-4 group-focus-visible:scale-110',
                                        supportsHover ? 'group-hover:-translate-y-4 group-hover:scale-110' : '',
                                        isActive ? '-translate-y-4 scale-110' : '',
                                    ].join(' ')}
                                >
                                    <img
                                        src={`/optimized/colors/${tube.slug}_closed.webp`}
                                        alt=""
                                        decoding="async"
                                        loading="lazy"
                                        className={[
                                            'absolute inset-0 h-full w-full object-contain drop-shadow-[0_10px_13px_rgba(18,59,109,0.16)] transition-opacity duration-500 ease-out group-focus-visible:opacity-0',
                                            supportsHover ? 'group-hover:opacity-0' : '',
                                            isActive ? 'opacity-0' : '',
                                        ].join(' ')}
                                    />
                                    <img
                                        src={`/optimized/colors/${tube.slug}_opened.webp`}
                                        alt=""
                                        decoding="async"
                                        loading="lazy"
                                        className={[
                                            'absolute inset-0 h-full w-full object-contain opacity-0 drop-shadow-[0_14px_16px_rgba(18,59,109,0.2)] transition-opacity duration-500 ease-out group-focus-visible:opacity-100',
                                            supportsHover ? 'group-hover:opacity-100' : '',
                                            isActive ? 'opacity-100' : '',
                                        ].join(' ')}
                                    />
                                </span>
                                {shouldShowTapCue ? (
                                    <span className="pointer-events-none absolute -top-2 -right-1 h-5 w-5 rounded-full bg-[#123b6d]/20 md:hidden">
                                        <span className="absolute inset-1 rounded-full bg-[#123b6d]" />
                                        <span className="absolute inset-0 animate-ping rounded-full bg-[#123b6d]/35" />
                                    </span>
                                ) : null}
                                <span
                                    className={[
                                        'pointer-events-none absolute top-[calc(100%+12px)] left-1/2 hidden w-max -translate-x-1/2 px-4 py-2 text-center font-["Instrument_Sans"] leading-tight font-medium tracking-[0.12em] text-[#123b6d] uppercase opacity-0 transition-all duration-300 ease-out group-focus-visible:translate-y-1 group-focus-visible:opacity-100 md:block md:max-w-none md:text-[15px]',
                                        supportsHover ? 'group-hover:translate-y-1 group-hover:opacity-100' : '',
                                        isActive ? 'translate-y-1 opacity-100' : '',
                                    ].join(' ')}
                                >
                                    {tube.name}
                                </span>
                            </button>
                        );
                    })}

                    <div
                        className={[
                            'pointer-events-none absolute left-1/2 z-[90] w-full max-w-[161px] -translate-x-1/2 text-center font-["Instrument_Sans"] text-[9px] leading-tight font-medium tracking-[0.12em] text-[#123b6d] uppercase transition-opacity duration-300 md:hidden',
                            activeColor ? 'opacity-100' : 'opacity-0',
                        ].join(' ')}
                        style={{ top: lineY + itemHeight * 0.64 }}
                        aria-hidden="true"
                    >
                        {activeColor?.name}
                    </div>
                </div>
            </div>
        </section>
    );
}
