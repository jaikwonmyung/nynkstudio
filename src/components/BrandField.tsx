import React from 'react';

/**
 * The SM Group key visual, rebuilt as inline SVG: stadium/capsule forms set on
 * a 45° grid, some outlined and some filled with a halftone dot screen, tied
 * together by a thin ribbon that weaves between them — the same geometry the
 * SM mark is drawn from.
 *
 * It is a single static SVG behind `pointer-events: none`. Nothing animates, so
 * it costs one paint at mount and nothing thereafter.
 */
interface BrandFieldProps {
    className?: string;
    /** ink = navy linework for the pink ground, light = white for the navy half */
    tone?: 'ink' | 'light';
}

const BrandField: React.FC<BrandFieldProps> = ({ className = '', tone = 'ink' }) => {
    const c = tone === 'light' ? '#ffffff' : '#223055';
    const uid = `sm-halftone-${tone}`;
    return (
        <svg
            className={`pointer-events-none select-none ${className}`}
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <pattern id={uid} width="6" height="6" patternUnits="userSpaceOnUse">
                    <circle cx="1.6" cy="1.6" r="1.05" fill={c} fillOpacity="0.5" />
                </pattern>
                {/* capsule = stadium: a rect whose radius is half its height */}
                <g id={`sm-cap-${tone}`}>
                    <rect x="0" y="0" width="300" height="132" rx="66" ry="66" />
                </g>
            </defs>

            <g stroke={c} strokeOpacity="0.28" strokeWidth="1" fill="none">
                {/* ribbon — one continuous weaving path, echoing the mark's stroke */}
                <path d="M -40 250
               C 120 250, 150 96, 300 96
               C 450 96, 470 250, 620 250
               C 770 250, 800 96, 950 96
               C 1100 96, 1130 250, 1280 250
               C 1400 250, 1440 180, 1500 150" />
                <path d="M -40 700
               C 140 700, 170 540, 330 540
               C 490 540, 520 700, 680 700
               C 840 700, 870 540, 1030 540
               C 1190 540, 1220 700, 1380 700" />
            </g>

            {/* outlined capsules */}
            <g stroke={c} strokeOpacity="0.3" strokeWidth="1" fill="none">
                <use href={`#sm-cap-${tone}`} transform="translate(300 40) rotate(-45)" />
                <use href={`#sm-cap-${tone}`} transform="translate(1010 470) rotate(-45)" />
                <use href={`#sm-cap-${tone}`} transform="translate(120 640) rotate(45)" />
            </g>

            {/* halftone-filled capsules */}
            <g fill={`url(#${uid})`} stroke={c} strokeOpacity="0.22" strokeWidth="1">
                <use href={`#sm-cap-${tone}`} transform="translate(1140 90) rotate(-45)" />
                <use href={`#sm-cap-${tone}`} transform="translate(-90 330) rotate(-45)" />
                <use href={`#sm-cap-${tone}`} transform="translate(560 760) rotate(45)" />
            </g>
        </svg>
    );
};

export default BrandField;
