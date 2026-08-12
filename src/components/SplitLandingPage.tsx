import React from 'react';

interface SplitLandingPageProps {
    onSelect: (channel: 'red' | 'white') => void;
}

const SplitLandingPage: React.FC<SplitLandingPageProps> = ({ onSelect }) => {
    return (
        <div className="flex flex-col md:flex-row h-screen w-full">
            {/* Left: Red Channel */}
            <div
                onClick={() => onSelect('red')}
                className="w-full h-1/2 md:w-1/2 md:h-full bg-[#223055] cursor-pointer hover:brightness-110 transition-all flex items-center justify-center group active:brightness-90"
            >
                {/* Optional subtle indicator - keeping it empty/minimal per style */}
            </div>

            {/* Right: White Channel */}
            <div
                onClick={() => onSelect('white')}
                className="w-full h-1/2 md:w-1/2 md:h-full bg-[#FFE1E9] cursor-pointer hover:brightness-[0.98] transition-all flex items-center justify-center group active:brightness-95"
            >
                {/* Optional subtle indicator */}
            </div>
        </div>
    );
};

export default SplitLandingPage;
