
import React from 'react';
import { ImageSize, AspectRatio } from '../../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSize: ImageSize;
    setImageSize: (size: ImageSize) => void;
    aspectRatio: AspectRatio;
    setAspectRatio: (ratio: AspectRatio) => void;
    onClearKey: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    imageSize,
    setImageSize,
    aspectRatio,
    setAspectRatio,
    onClearKey
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/5" onClick={onClose}>
            <div className="bg-white border border-zinc-200 shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold tracking-tight text-zinc-900">Settings</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Aspect Ratio */}
                    <div className="space-y-3">
                        <label className="text-xs font-medium text-zinc-500 block">Aspect Ratio</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setAspectRatio('1:1')}
                                className={`py-2 px-3 flex flex-col items-center gap-2 border transition-all ${aspectRatio === '1:1' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'}`}
                            >
                                <div className="w-4 h-4 border border-current"></div>
                                <span className="text-[10px]">Square</span>
                            </button>
                            <button
                                onClick={() => setAspectRatio('16:9')}
                                className={`py-2 px-3 flex flex-col items-center gap-2 border transition-all ${aspectRatio === '16:9' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'}`}
                            >
                                <div className="w-6 h-3.5 border border-current"></div>
                                <span className="text-[10px]">Landscape</span>
                            </button>
                            <button
                                onClick={() => setAspectRatio('9:16')}
                                className={`py-2 px-3 flex flex-col items-center gap-2 border transition-all ${aspectRatio === '9:16' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'}`}
                            >
                                <div className="w-3.5 h-6 border border-current"></div>
                                <span className="text-[10px]">Portrait</span>
                            </button>
                        </div>
                    </div>

                    {/* Quality / Size */}
                    <div className="space-y-3">
                        <label className="text-xs font-medium text-zinc-500 block">Output Quality</label>
                        <div className="flex border border-zinc-200 divide-x divide-zinc-200">
                            {['1K', '2K', '4K'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setImageSize(size as ImageSize)}
                                    className={`flex-1 py-2 text-xs font-medium transition-colors ${imageSize === size ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-500 hover:text-zinc-900'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* API Key */}
                    <div className="pt-4 border-t border-zinc-100">
                        <button
                            onClick={onClearKey}
                            className="w-full py-3 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-xs font-medium transition-colors"
                        >
                            Reset API Key
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
