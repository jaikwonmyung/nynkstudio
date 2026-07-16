import { useState, useRef, useEffect } from 'react';
import { generateImage } from '../../geminiService';
import { ReferenceImage, GenerationResult, ImageSize, AspectRatio, EngineType } from '../../types';

interface UseGenerationLogicProps {
    apiKey: string | null;
    setShowKeyModal: (show: boolean) => void;
}

export const useGenerationLogic = ({ apiKey, setShowKeyModal }: UseGenerationLogicProps) => {
    const [prompt, setPrompt] = useState<string>('');
    const [references, setReferences] = useState<ReferenceImage[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isConsistencyFixed, setIsConsistencyFixed] = useState(false);
    const [engineType, setEngineType] = useState<EngineType>('4K');
    const [result, setResult] = useState<GenerationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState<'fit' | 'fill'>('fill');
    const [imageSize, setImageSize] = useState<ImageSize>('1K');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [draggingSlot, setDraggingSlot] = useState<number | 'add' | null>(null);
    const [history, setHistory] = useState<GenerationResult[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const activeIndexRef = useRef<number | null>(null);

    // Load History
    useEffect(() => {
        try {
            const saved = localStorage.getItem('nynk_history');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setHistory(parsed);
                }
            }
        } catch (e) {
            console.error("History corrupted, resetting", e);
            localStorage.removeItem('nynk_history');
            setHistory([]);
        }
    }, []);

    const addToHistory = (newResult: GenerationResult) => {
        setHistory(prev => {
            const updated = [newResult, ...prev].slice(0, 20);
            // 4K images are large base64 blobs; localStorage caps at ~5MB. If the
            // write overflows the quota, drop the oldest entries until it fits so
            // history saving never fails silently.
            let toStore = updated;
            while (toStore.length > 0) {
                try {
                    localStorage.setItem('nynk_history', JSON.stringify(toStore));
                    break;
                } catch (e) {
                    toStore = toStore.slice(0, -1); // drop the oldest and retry
                    if (toStore.length === 0) {
                        try { localStorage.removeItem('nynk_history'); } catch {}
                    }
                }
            }
            return updated;
        });
    };

    const processFile = (file: File, index: number | null) => {
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            const newRef: ReferenceImage = {
                id: Math.random().toString(36).substring(2, 9),
                file,
                previewUrl: URL.createObjectURL(file),
                base64Data: base64String,
                mimeType: file.type,
            };

            setReferences(prev => {
                if (index === null) {
                    return [...prev, newRef];
                } else {
                    const newRefs = [...prev];
                    newRefs[index] = newRef;
                    return newRefs;
                }
            });
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file, activeIndexRef.current);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleTriggerFile = (index: number | null) => {
        activeIndexRef.current = index;
        fileInputRef.current?.click();
    };

    const removeReference = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setReferences(prev => prev.filter((_, i) => i !== index));
    };

    const onDragOver = (e: React.DragEvent, index: number | 'add') => {
        e.preventDefault();
        setDraggingSlot(index);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDraggingSlot(null);
    };

    const onDrop = (e: React.DragEvent, index: number | 'add') => {
        e.preventDefault();
        setDraggingSlot(null);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file, index === 'add' ? null : index);
    };

    const handleGenerate = async () => {
        if (isGenerating) return;
        if (!prompt.trim() && references.length === 0) {
            setError('Enter a prompt or add a reference image.');
            return;
        }
        if (!apiKey) {
            setShowKeyModal(true);
            return;
        }

        setIsGenerating(true);
        setError(null);

        const imagesToPass = references.map(ref => ({
            data: ref.base64Data,
            mimeType: ref.mimeType
        }));

        try {
            const imageUrl = await generateImage(apiKey, prompt, imagesToPass, {
                size: imageSize,
                aspectRatio: aspectRatio,
                consistencyFixed: isConsistencyFixed,
                engineType: engineType
            });

            const newResult = {
                imageUrl,
                prompt,
                timestamp: Date.now(),
            };

            setResult(newResult);
            addToHistory(newResult);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Generation failed. Please try again.');
            if (err.message?.includes("Requested entity was not found")) {
                setShowKeyModal(true);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const restoreHistoryItem = (item: GenerationResult) => {
        setResult(item);
    };

    const reusePrompt = (itemPrompt: string) => {
        setPrompt(itemPrompt);
    };

    const handleDownload = () => {
        if (!result) return;
        const now = new Date();
        const dateStr = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
        const storageKey = `download_seq_${dateStr}`;
        const savedSeq = localStorage.getItem(storageKey);
        let seq = savedSeq ? parseInt(savedSeq, 10) : 0;
        seq++;
        localStorage.setItem(storageKey, seq.toString());

        const link = document.createElement('a');
        link.href = result.imageUrl.startsWith('data:') ? result.imageUrl : `data:image/jpeg;base64,${result.imageUrl}`;
        link.download = `${dateStr}_${seq.toString().padStart(3, '0')}.png`;
        link.click();
    };

    return {
        prompt, setPrompt,
        references, setReferences,
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
    };
};
