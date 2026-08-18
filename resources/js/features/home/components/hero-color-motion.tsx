import type { CSSProperties } from 'react';

interface HeroMotionShape {
    className: string;
    color: string;
    delay: string;
    duration: string;
    endRotation: string;
    endX: string;
    endY: string;
    startRotation: string;
    startX: string;
    startY: string;
    tone?: 'bold' | 'light';
}

type HeroMotionStyle = CSSProperties & Record<`--shape-${string}`, string>;

const pigmentStrokes: HeroMotionShape[] = [
    {
        className: 'top-[8%] -left-[12%] h-20 w-[70vw] md:top-[7%] md:h-32 md:w-[46vw]',
        color: '#d8efff',
        delay: '-2s',
        duration: '13s',
        endRotation: '-3deg',
        endX: '4vw',
        endY: '18px',
        startRotation: '-8deg',
        startX: '-2vw',
        startY: '-10px',
        tone: 'light',
    },
    {
        className: 'top-[18%] right-[-24%] h-24 w-[78vw] md:top-[17%] md:right-[-10%] md:h-36 md:w-[48vw]',
        color: '#ffe1b8',
        delay: '-6s',
        duration: '15s',
        endRotation: '-11deg',
        endX: '-4vw',
        endY: '14px',
        startRotation: '-5deg',
        startX: '1vw',
        startY: '-16px',
        tone: 'light',
    },
    {
        className: 'bottom-[17%] left-[10%] h-16 w-[66vw] md:bottom-[13%] md:left-[15%] md:h-28 md:w-[42vw]',
        color: '#ffe9f0',
        delay: '-4s',
        duration: '14s',
        endRotation: '6deg',
        endX: '5vw',
        endY: '-12px',
        startRotation: '1deg',
        startX: '-3vw',
        startY: '14px',
        tone: 'light',
    },
    {
        className: 'right-[4%] bottom-[29%] h-14 w-[42vw] md:right-[7%] md:bottom-[31%] md:h-24 md:w-[24vw]',
        color: '#dff4d8',
        delay: '-8s',
        duration: '12s',
        endRotation: '15deg',
        endX: '-2vw',
        endY: '-22px',
        startRotation: '9deg',
        startX: '3vw',
        startY: '8px',
        tone: 'light',
    },
    {
        className: 'hidden md:block md:top-[48%] md:left-[43%] md:h-16 md:w-[21vw]',
        color: '#f7d70a',
        delay: '-3s',
        duration: '11s',
        endRotation: '-18deg',
        endX: '2vw',
        endY: '-18px',
        startRotation: '-10deg',
        startX: '-1vw',
        startY: '12px',
        tone: 'bold',
    },
];

const pigmentSwatches: HeroMotionShape[] = [
    {
        className: 'top-[18%] left-[13%] h-6 w-24',
        color: '#1d9ee8',
        delay: '-1s',
        duration: '8s',
        endRotation: '-16deg',
        endX: '18px',
        endY: '-10px',
        startRotation: '-23deg',
        startX: '-10px',
        startY: '8px',
    },
    {
        className: 'top-[30%] right-[18%] h-7 w-28',
        color: '#f43b2f',
        delay: '-5s',
        duration: '9s',
        endRotation: '14deg',
        endX: '-16px',
        endY: '14px',
        startRotation: '7deg',
        startX: '12px',
        startY: '-8px',
    },
    {
        className: 'right-[8%] bottom-[24%] h-6 w-24',
        color: '#119d54',
        delay: '-3s',
        duration: '8.5s',
        endRotation: '-28deg',
        endX: '-22px',
        endY: '-6px',
        startRotation: '-19deg',
        startX: '14px',
        startY: '12px',
    },
    {
        className: 'bottom-[18%] left-[24%] h-6 w-24',
        color: '#6f2dcf',
        delay: '-7s',
        duration: '9.5s',
        endRotation: '24deg',
        endX: '16px',
        endY: '12px',
        startRotation: '14deg',
        startX: '-12px',
        startY: '-10px',
    },
    {
        className: 'top-[43%] left-[6%] h-5 w-20',
        color: '#8c4b2d',
        delay: '-4s',
        duration: '10s',
        endRotation: '8deg',
        endX: '20px',
        endY: '10px',
        startRotation: '2deg',
        startX: '-14px',
        startY: '-12px',
    },
];

function motionStyle(shape: HeroMotionShape): HeroMotionStyle {
    return {
        '--shape-color': shape.color,
        '--shape-delay': shape.delay,
        '--shape-duration': shape.duration,
        '--shape-end-rotation': shape.endRotation,
        '--shape-end-x': shape.endX,
        '--shape-end-y': shape.endY,
        '--shape-start-rotation': shape.startRotation,
        '--shape-start-x': shape.startX,
        '--shape-start-y': shape.startY,
    };
}

export function HeroColorMotion() {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            {pigmentStrokes.map((shape, index) => (
                <span
                    key={`hero-stroke-${index}`}
                    className={['maz-hero-paint-shape absolute', shape.className].join(' ')}
                    data-tone={shape.tone}
                    style={motionStyle(shape)}
                />
            ))}

            <div className="absolute inset-y-[8%] right-[3%] hidden w-[52vw] max-w-[900px] md:block">
                {pigmentSwatches.map((shape, index) => (
                    <span
                        key={`hero-swatch-${index}`}
                        className={['maz-hero-color-chip absolute', shape.className].join(' ')}
                        style={motionStyle(shape)}
                    />
                ))}
            </div>
        </div>
    );
}
