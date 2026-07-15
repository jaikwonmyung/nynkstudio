import React, { useState } from 'react';
import { useVideoGenerationLogic } from '../hooks/useVideoGenerationLogic';
import { VeoModelKey } from '../../types';

interface WhiteGenerationPageProps {
    apiKey: string | null;
    setShowKeyModal: (show: boolean) => void;
    onBack: () => void;
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
    handleClearKey: () => void;
}

const MODEL_LABELS: Record<VeoModelKey, string> = {
    VEO3: 'VEO 3.1',
    VEO3_FAST: 'VEO 3.1 FAST',
    VEO3_LITE: 'VEO 3.1 LITE',
};

const WhiteGenerationPage: React.FC<WhiteGenerationPageProps> = ({
    apiKey, setShowKeyModal, onBack, showSettings, setShowSettings, handleClearKey
}) => {
    const {
        prompt, setPrompt,
        negativePrompt, setNegativePrompt,
        startImage,
        isGenerating, progress,
        result, setResult,
        error,
        modelKey, setModelKey,
        aspectRatio, setAspectRatio,
        resolution, setResolution,
        history,
        draggingSlot,
        fileInputRef,
        handleFileChange,
        handleTriggerFile,
        removeStartImage,
        onDragOver, onDragLeave, onDrop,
        handleGenerate,
        restoreHistoryItem,
        reusePrompt,
        handleDownload,
    } = useVideoGenerationLogic({ apiKey, setShowKeyModal });

    const [showAdvanced, setShowAdvanced] = useState(false);
    const canDoHD = aspectRatio === '16:9';

    const cycleModel = () => {
        const order: VeoModelKey[] = ['VEO3', 'VEO3_FAST', 'VEO3_LITE'];
        setModelKey(order[(order.indexOf(modelKey) + 1) % order.length]);
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 pb-20">
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
            />

            {/* Header - White / Video Channel */}
            <header className="border-b border-zinc-200 py-3 px-4 md:py-4 md:px-6 flex justify-between items-center bg-white sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="w-3 h-3 rounded-full border transition-colors bg-white border-zinc-200 hover:border-zinc-400"
                        title="Back to Selection"
                    ></button>
                    <span className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase">Video</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="group flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors p-2"
                        onClick={() => setShowSettings(true)}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-zinc-400 transition-colors"></div>
                    </button>
                </div>
            </header>

            {/* Minimal settings popover (reset key) */}
            {showSettings && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/5" onClick={() => setShowSettings(false)}>
                    <div className="bg-white border border-zinc-200 shadow-xl w-full max-w-xs p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-sm font-bold tracking-tight text-zinc-900">Settings</h2>
                            <button onClick={() => setShowSettings(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <button
                            onClick={() => { handleClearKey(); setShowSettings(false); }}
                            className="w-full py-3 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-xs font-medium transition-colors"
                        >
                            Reset API Key
                        </button>
                    </div>
                </div>
            )}

            <main className="max-w-[1600px] mx-auto px-4 md:px-6 mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                {/* Left Column: Inputs */}
                <div className="lg:col-span-4 space-y-6 md:space-y-8">
                    {/* Prompt */}
                    <section className="space-y-3">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the shot: subject, motion, camera movement, lighting, mood..."
                            className="w-full h-32 md:h-40 bg-white border p-4 text-zinc-900 outline-none resize-none transition-colors placeholder:text-zinc-300 text-xs leading-relaxed rounded-none border-zinc-200 focus:border-zinc-600"
                        />

                        {/* Model + Aspect toggles */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={cycleModel}
                                className="inline-flex items-center gap-2 py-2 px-4 border border-zinc-200 text-[10px] text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-all uppercase tracking-widest"
                            >
                                <span>{MODEL_LABELS[modelKey]}</span>
                                <div className="w-1 h-1 rounded-full bg-zinc-900"></div>
                            </button>

                            <button
                                onClick={() => setAspectRatio(aspectRatio === '16:9' ? '9:16' : '16:9')}
                                className="inline-flex items-center gap-2 py-2 px-4 border border-zinc-200 text-[10px] text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-all uppercase tracking-widest"
                            >
                                <div className={`border border-current ${aspectRatio === '16:9' ? 'w-4 h-2.5' : 'w-2.5 h-4'}`}></div>
                                <span>{aspectRatio}</span>
                            </button>

                            {canDoHD && (
                                <button
                                    onClick={() => setResolution(resolution === '720p' ? '1080p' : '720p')}
                                    className="inline-flex items-center gap-2 py-2 px-4 border border-zinc-200 text-[10px] text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-all uppercase tracking-widest"
                                >
                                    <span>{resolution}</span>
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Start image (image-to-video) */}
                    <section className="space-y-3">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-widest block">Start Frame (optional)</label>
                        {startImage ? (
                            <div
                                onClick={handleTriggerFile}
                                className="group relative aspect-video border border-zinc-200 bg-white overflow-hidden cursor-pointer"
                            >
                                <img src={startImage.previewUrl} className="w-full h-full object-cover" alt="Start frame" />
                                <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-[10px] font-medium text-zinc-800">Replace</span>
                                </div>
                                <button
                                    onClick={removeStartImage}
                                    className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-400 hover:text-zinc-900 transition-colors z-20"
                                >
                                    <i className="fa-solid fa-xmark text-[10px]"></i>
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={handleTriggerFile}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                className={`group relative aspect-video transition-all cursor-pointer flex items-center justify-center dashed-border-tight hover:opacity-80 ${draggingSlot ? 'bg-zinc-50' : 'bg-white'}`}
                            >
                                <span className="text-[10px] text-zinc-300">Tap or drag an image to animate</span>
                            </div>
                        )}
                    </section>

                    {/* Advanced: negative prompt */}
                    <section className="space-y-3">
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="text-[10px] text-zinc-400 hover:text-zinc-900 uppercase tracking-widest flex items-center gap-2 transition-colors"
                        >
                            <i className={`fa-solid ${showAdvanced ? 'fa-chevron-down' : 'fa-chevron-right'} text-[8px]`}></i>
                            Advanced
                        </button>
                        {showAdvanced && (
                            <textarea
                                value={negativePrompt}
                                onChange={(e) => setNegativePrompt(e.target.value)}
                                placeholder="Negative prompt — what to avoid..."
                                className="w-full h-20 bg-white border p-3 text-zinc-900 outline-none resize-none transition-colors placeholder:text-zinc-300 text-xs leading-relaxed rounded-none border-zinc-200 focus:border-zinc-600"
                            />
                        )}
                    </section>

                    {/* Generate */}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className={`w-full py-4 flex items-center justify-center gap-3 transition-all rounded-none border
              ${isGenerating
                                ? 'bg-zinc-100 border-zinc-200 text-zinc-500 cursor-not-allowed'
                                : 'bg-zinc-900 border-zinc-900 text-white hover:bg-zinc-800 active:bg-black'}`}
                    >
                        <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${isGenerating ? 'bg-zinc-400 animate-pulse' : 'bg-white'}`}></div>
                        <span className="text-xs font-medium tracking-widest uppercase">
                            {isGenerating ? (progress || 'Working…') : 'Generate Video'}
                        </span>
                    </button>
                    {isGenerating && (
                        <p className="text-[10px] text-zinc-400 text-center -mt-3">Veo usually takes 60–90 seconds. Keep this tab open.</p>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 mt-4 justify-center animate-in fade-in slide-in-from-top-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <span className="text-xs text-red-500 font-medium">{error.includes('quota') ? 'Usage limit exceeded' : error}</span>
                            <button
                                onClick={() => setShowKeyModal(true)}
                                className="text-[10px] text-zinc-400 underline hover:text-zinc-600 ml-2"
                            >
                                Change Key
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Column: Output */}
                <div className="lg:col-span-8 flex flex-col h-full min-h-[50vh]">
                    <div className="flex-1 min-h-[400px] md:min-h-[600px] border border-zinc-200 bg-zinc-50 flex flex-col relative group">
                        {result && !isGenerating ? (
                            <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-white">
                                <div className="relative w-full max-w-3xl">
                                    <video
                                        src={result.videoUrl}
                                        controls
                                        autoPlay
                                        loop
                                        playsInline
                                        className="w-full max-h-[70vh] bg-black"
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
                        ) : isGenerating ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 space-y-4">
                                <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse"></div>
                                <span className="text-[10px] tracking-[0.3em] uppercase">{progress || 'Rendering'}</span>
                                <span className="text-[10px] text-zinc-300">Veo can take 1–3 minutes.</span>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-zinc-300 space-y-4"></div>
                        )}

                        {result && !isGenerating && (
                            <div className="p-4 border-t border-zinc-200 bg-white flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-medium text-zinc-900">Output</h4>
                                    <span className="text-[10px] text-zinc-300">·</span>
                                    <p className="text-[10px] text-zinc-400">{result.aspectRatio}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setResult(null)} className="text-zinc-400 hover:text-zinc-900 transition-colors text-xs">Reset</button>
                                    <button onClick={() => reusePrompt(result.prompt)} className="text-zinc-400 hover:text-zinc-900 transition-colors text-xs">Reuse</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* History */}
            <section className="max-w-[1600px] mx-auto px-4 md:px-6 mt-12 md:mt-16 pb-20 border-t border-zinc-100 pt-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
                    {history.map((item) => (
                        <div
                            key={item.timestamp}
                            className="group relative aspect-video bg-zinc-50 border border-zinc-100 overflow-hidden cursor-pointer hover:border-zinc-300 transition-colors"
                            onClick={() => restoreHistoryItem(item)}
                        >
                            <video src={item.videoUrl} muted loop playsInline className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                                onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                            />
                        </div>
                    ))}
                </div>
                {history.length === 0 && (
                    <div className="text-center py-10 text-xs text-zinc-300">No videos yet.</div>
                )}
            </section>
        </div>
    );
};

export default WhiteGenerationPage;
