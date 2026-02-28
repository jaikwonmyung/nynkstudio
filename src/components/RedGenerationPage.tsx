import React from 'react';
import { useGenerationLogic } from '../hooks/useGenerationLogic';
import SettingsModal from './SettingsModal';

interface RedGenerationPageProps {
    apiKey: string | null;
    setShowKeyModal: (show: boolean) => void;
    onBack: () => void;
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
    handleClearKey: () => void;
}

const RedGenerationPage: React.FC<RedGenerationPageProps> = ({
    apiKey, setShowKeyModal, onBack, showSettings, setShowSettings, handleClearKey
}) => {
    const {
        prompt, setPrompt,
        references,
        isGenerating,
        isConsistencyFixed, setIsConsistencyFixed,
        engineType, setEngineType,
        result, setResult,
        error,
        previewMode, setPreviewMode,
        imageSize, setImageSize,
        aspectRatio, setAspectRatio,
        draggingSlot,
        history,
        fileInputRef,
        handleFileChange,
        handleTriggerFile,
        removeReference,
        onDragOver,
        onDragLeave,
        onDrop,
        handleGenerate,
        restoreHistoryItem,
        reusePrompt,
        handleDownload
    } = useGenerationLogic({ apiKey, setShowKeyModal });

    return (
        <div className="min-h-screen bg-white text-zinc-900 pb-20">
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
            />

            {/* Header - Red Channel Style */}
            <header className="border-b border-zinc-200 py-3 px-4 md:py-4 md:px-6 flex justify-between items-center bg-white sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    {/* Back Button / Red Dot */}
                    <button
                        onClick={onBack}
                        className="w-3 h-3 rounded-full border transition-colors bg-[#ff0000] border-[#ff0000]"
                        title="Back to Selection"
                    ></button>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="group flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors p-2"
                        onClick={() => setShowSettings(true)}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    </button>
                </div>
            </header>

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                imageSize={imageSize}
                setImageSize={setImageSize}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                onClearKey={handleClearKey}
            />

            <main className="max-w-[1600px] mx-auto px-4 md:px-6 mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                {/* Left Column: Inputs */}
                <div className="lg:col-span-4 space-y-6 md:space-y-8">
                    {/* Prompt Section */}
                    <section className="space-y-3">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the space, materials, and atmosphere..."
                            className="w-full h-32 md:h-40 bg-white border p-4 text-zinc-900 outline-none resize-none transition-colors placeholder:text-zinc-300 text-xs leading-relaxed rounded-none border-zinc-200 focus:border-[#ff0000]"
                        />
                        <div className="flex items-center gap-2">
                            {/* Consistency Toggle */}
                            <button
                                onClick={() => setIsConsistencyFixed(!isConsistencyFixed)}
                                className={`w-auto inline-flex items-center gap-3 py-2 px-3 border text-xs transition-all ${isConsistencyFixed ? 'bg-zinc-50 border-zinc-600 text-zinc-900' : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300'}`}
                            >
                                <i className={`fa-solid ${isConsistencyFixed ? 'fa-lock' : 'fa-lock-open'} text-[10px]`}></i>
                                <div className={`w-1.5 h-1.5 rounded-full ${isConsistencyFixed ? 'bg-red-500' : 'bg-zinc-200'}`}></div>
                            </button>

                            {/* Engine Selection Toggle */}
                            <button
                                onClick={() => setEngineType(engineType === '4K' ? 'NANOBANANA2' : '4K')}
                                className="inline-flex items-center gap-2 py-2 px-4 border border-zinc-200 text-[10px] text-zinc-400 hover:text-zinc-900 hover:border-zinc-400 transition-all uppercase tracking-widest"
                            >
                                <span>{engineType === '4K' ? '4K ULTRA' : 'NANOBANANA 2'}</span>
                                <div className={`w-1 h-1 rounded-full ${engineType === 'NANOBANANA2' ? 'bg-red-500' : 'bg-zinc-200'}`}></div>
                            </button>
                        </div>
                    </section>

                    {/* Reference Images Section */}
                    <section className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            {references.map((ref, index) => (
                                <div
                                    key={ref.id}
                                    onClick={() => handleTriggerFile(index)}
                                    onDragOver={(e) => onDragOver(e, index)}
                                    onDragLeave={onDragLeave}
                                    onDrop={(e) => onDrop(e, index)}
                                    className={`group relative aspect-square border transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center border-zinc-200 bg-white
                        ${draggingSlot === index ? 'bg-zinc-50' : ''}`}
                                >
                                    <img src={ref.previewUrl} className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 transition-opacity" alt={`Ref ${index + 1}`} />
                                    <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="text-[10px] font-medium text-zinc-800">Replace</span>
                                    </div>
                                    <button
                                        onClick={(e) => removeReference(index, e)}
                                        className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-400 hover:text-zinc-900 transition-colors z-20"
                                    >
                                        <i className="fa-solid fa-xmark text-[10px]"></i>
                                    </button>
                                </div>
                            ))}

                            <div
                                onClick={() => handleTriggerFile(null)}
                                onDragOver={(e) => onDragOver(e, 'add')}
                                onDragLeave={onDragLeave}
                                onDrop={(e) => onDrop(e, 'add')}
                                className={`group relative aspect-square transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center dashed-border-tight hover:opacity-80
                    ${draggingSlot === 'add' ? 'bg-zinc-50' : 'bg-white'}
                    ${draggingSlot === 'add' ? 'border-[#ff0000]' : ''}`}
                            >
                            </div>
                        </div>
                        <p className="text-[10px] text-zinc-400">
                            Tap or drag images to guide the structure.
                        </p>
                    </section>

                    {/* Action Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className={`w-full py-4 flex items-center justify-center transition-all rounded-none border border-zinc-200
              ${isGenerating ? 'bg-zinc-50 border-zinc-200 cursor-not-allowed' : 'bg-white hover:bg-zinc-50 active:bg-zinc-100'}`}
                    >
                        <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${isGenerating ? 'bg-zinc-400 animate-pulse' : 'bg-red-500'}`}></div>
                    </button>

                    {error && (
                        <div className="flex items-center gap-2 mt-4 justify-center animate-in fade-in slide-in-from-top-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <span className="text-xs text-red-500 font-medium">{error.includes("quota") ? "Usage limit exceeded" : error}</span>
                            <button
                                onClick={() => setShowKeyModal(true)}
                                className="text-[10px] text-zinc-400 underline hover:text-zinc-600 ml-2"
                            >
                                Change Key
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Column: Results */}
                <div className="lg:col-span-8 flex flex-col h-full min-h-[50vh]">
                    <div className="flex-1 min-h-[400px] md:min-h-[600px] border border-zinc-200 bg-zinc-50 flex flex-col relative group">
                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                            <button
                                onClick={() => setPreviewMode('fill')}
                                className={`px-3 py-1.5 text-[10px] border transition-all ${previewMode === 'fill' ? 'bg-zinc-100 text-zinc-900 border-zinc-400' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'}`}
                            >
                                Full
                            </button>
                            <button
                                onClick={() => setPreviewMode('fit')}
                                className={`px-3 py-1.5 text-[10px] border transition-all ${previewMode === 'fit' ? 'bg-zinc-100 text-zinc-900 border-zinc-400' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'}`}
                            >
                                Fit
                            </button>
                        </div>

                        {result && !isGenerating ? (
                            <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-white">
                                <div className={`relative transition-all duration-300 bg-zinc-100 ${previewMode === 'fill' ? 'w-full aspect-video' : 'h-full aspect-square'}`}>
                                    <img
                                        id="generated-image"
                                        src={result.imageUrl.startsWith('data:') ? result.imageUrl : `data:image/jpeg;base64,${result.imageUrl}`}
                                        alt="Generated output"
                                        className={`w-full h-full object-contain max-h-[70vh] ${previewMode === 'fill' ? 'object-cover' : 'object-contain'}`}
                                    />
                                    <div className="absolute bottom-4 right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={handleDownload}
                                            className="px-4 py-2 bg-white text-zinc-900 text-xs font-medium border border-zinc-200 hover:border-zinc-400 transition-colors shadow-sm"
                                        >
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-zinc-300 space-y-4">
                            </div>
                        )}

                        {result && !isGenerating && (
                            <div className="p-4 border-t border-zinc-200 bg-white flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-medium text-zinc-900">Output</h4>
                                    <span className="text-[10px] text-zinc-300">·</span>
                                    <p className="text-[10px] text-zinc-400">{imageSize}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setResult(null)}
                                        className="text-zinc-400 hover:text-zinc-900 transition-colors text-xs"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => reusePrompt(result.prompt)}
                                        className="text-zinc-400 hover:text-zinc-900 transition-colors text-xs"
                                    >
                                        Reuse
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* History Section */}
            <section className="max-w-[1600px] mx-auto px-4 md:px-6 mt-12 md:mt-16 pb-20 border-t border-zinc-100 pt-8">
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 md:gap-4">
                    {history.map((item) => (
                        <div key={item.timestamp} className="group relative aspect-square bg-zinc-50 border border-zinc-100 overflow-hidden cursor-pointer hover:border-zinc-300 transition-colors"
                            onClick={() => restoreHistoryItem(item)}
                        >
                            <img src={item.imageUrl.startsWith('data:') ? item.imageUrl : `data:image/jpeg;base64,${item.imageUrl}`} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy" />
                        </div>
                    ))}
                </div>
                {history.length === 0 && (
                    <div className="text-center py-10 text-xs text-zinc-300">
                        No history yet.
                    </div>
                )}
            </section>
        </div >
    );
};

export default RedGenerationPage;
