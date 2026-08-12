import React from 'react';

interface SplitLandingPageProps {
    onSelect: (channel: 'red' | 'white') => void;
}

const SplitLandingPage: React.FC<SplitLandingPageProps> = ({ onSelect }) => {
    return (
        <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
            {/* Left: Image channel.
                A gradient rather than a flat CI-navy slab — at half-screen the
                pure value sits very heavy against the pale ground. */}
            <div
                onClick={() => onSelect('red')}
                role="button"
                aria-label="Image channel"
                className="sm-panel group w-full h-1/2 md:w-1/2 md:h-full cursor-pointer flex items-center justify-center relative"
                style={{ background: 'linear-gradient(160deg, #33406B 0%, #223055 55%, #1B2745 100%)' }}
            >
                <span className="text-[10px] md:text-[11px] tracking-[0.45em] uppercase text-white/45 group-hover:text-white/90 transition-colors duration-500 select-none">
                    Image
                </span>
            </div>

            {/* Right: Video channel */}
            <div
                onClick={() => onSelect('white')}
                role="button"
                aria-label="Video channel"
                className="sm-panel group w-full h-1/2 md:w-1/2 md:h-full bg-[#FFE1E9] cursor-pointer flex items-center justify-center relative"
            >
                <span className="text-[10px] md:text-[11px] tracking-[0.45em] uppercase text-[#223055]/35 group-hover:text-[#223055] transition-colors duration-500 select-none">
                    Video
                </span>
            </div>
        </div>
    );
};

export default SplitLandingPage;
