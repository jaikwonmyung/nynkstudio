import React from 'react';

interface SplitLandingPageProps {
    onSelect: (channel: 'red' | 'white') => void;
}

const SplitLandingPage: React.FC<SplitLandingPageProps> = ({ onSelect }) => {
    return (
        <div className="flex h-screen w-full">
            {/* Left: Red Channel */}
            <div
                onClick={() => onSelect('red')}
                className="w-1/2 h-full bg-[#ff0000] cursor-pointer hover:brightness-110 transition-all flex items-center justify-center group"
            >
                {/* Optional subtle indicator - keeping it empty/minimal per style */}
            </div>

            {/* Right: White Channel */}
            <div
                onClick={() => onSelect('white')}
                className="w-1/2 h-full bg-white cursor-pointer hover:bg-zinc-50 transition-all flex items-center justify-center group"
            >
                {/* Optional subtle indicator */}
            </div>
        </div>
    );
};

export default SplitLandingPage;
