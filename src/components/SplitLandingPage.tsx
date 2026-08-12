import React from 'react';
import BrandField from './BrandField';

interface SplitLandingPageProps {
    onSelect: (channel: 'red' | 'white') => void;
}

const SplitLandingPage: React.FC<SplitLandingPageProps> = ({ onSelect }) => {
    return (
        <div className="h-screen w-full overflow-hidden relative">
            <div className="flex flex-col md:flex-row h-full w-full">
                {/* Left: Image channel.
                    A gradient rather than a flat CI-navy slab — at half-screen
                    the pure value sits very heavy against the pale ground. */}
                <div
                    onClick={() => onSelect('red')}
                    role="button"
                    aria-label="이미지 채널"
                    className="sm-panel group w-full h-1/2 md:w-1/2 md:h-full cursor-pointer flex items-center justify-center relative overflow-hidden"
                    style={{ background: 'linear-gradient(160deg, #33406B 0%, #223055 55%, #1B2745 100%)' }}
                >
                    <BrandField tone="light" className="absolute inset-0 w-full h-full opacity-[0.22]" />
                    <div className="relative z-10 text-center">
                        <div className="text-[10px] md:text-[11px] tracking-[0.45em] uppercase text-white/50 group-hover:text-white transition-colors duration-300 select-none">
                            Image
                        </div>
                        <div className="mt-2 text-[9px] tracking-[0.2em] text-white/25 group-hover:text-white/60 transition-colors duration-300 select-none">
                            이미지 생성
                        </div>
                    </div>
                </div>

                {/* Right: Video channel */}
                <div
                    onClick={() => onSelect('white')}
                    role="button"
                    aria-label="영상 채널"
                    className="sm-panel group w-full h-1/2 md:w-1/2 md:h-full bg-[#FFE1E9] cursor-pointer flex items-center justify-center relative overflow-hidden"
                >
                    <BrandField className="absolute inset-0 w-full h-full opacity-70" />
                    <div className="relative z-10 text-center">
                        <div className="text-[10px] md:text-[11px] tracking-[0.45em] uppercase text-[#223055]/40 group-hover:text-[#223055] transition-colors duration-300 select-none">
                            Video
                        </div>
                        <div className="mt-2 text-[9px] tracking-[0.2em] text-[#223055]/25 group-hover:text-[#223055]/70 transition-colors duration-300 select-none">
                            영상 생성
                        </div>
                    </div>
                </div>
            </div>

            {/* Credit rail — sits above both halves, so it needs a colour that
                reads on navy and on pink alike. */}
            <div className="pointer-events-none absolute bottom-5 left-0 w-full px-6 flex items-center justify-between text-[9px] tracking-[0.25em] uppercase z-20">
                <span className="text-white/45">SM Entertainment Vision &amp; eXperience(VX) Center</span>
                <span className="text-[#223055]/45 normal-case tracking-[0.12em]">The Future of Culture Technology</span>
            </div>
        </div>
    );
};

export default SplitLandingPage;
