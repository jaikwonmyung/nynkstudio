import { useState, useRef } from 'react';
import { generateVideo } from '../../videoService';
import { VEO_MODELS } from '../../constants';
import {
    ReferenceImage,
    VideoResult,
    VideoAspectRatio,
    VideoResolution,
    VeoModelKey,
} from '../../types';

interface UseVideoLogicProps {
    apiKey: string | null;
    setShowKeyModal: (show: boolean) => void;
}

export const useVideoGenerationLogic = ({ apiKey, setShowKeyModal }: UseVideoLogicProps) => {
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [startImage, setStartImage] = useState<ReferenceImage | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState('');
    const [result, setResult] = useState<VideoResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [modelKey, setModelKey] = useState<VeoModelKey>('VEO3');
    const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('16:9');
    const [resolution, setResolution] = useState<VideoResolution>('720p');

    const [history, setHistory] = useState<VideoResult[]>([]);
    const [draggingSlot, setDraggingSlot] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = (file: File) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            setStartImage({
                id: Math.random().toString(36).substring(2, 9),
                file,
                previewUrl: URL.createObjectURL(file),
                base64Data: base64String,
                mimeType: file.type,
            });
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleTriggerFile = () => fileInputRef.current?.click();

    const removeStartImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setStartImage(null);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDraggingSlot(true);
    };
    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDraggingSlot(false);
    };
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDraggingSlot(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleGenerate = async () => {
        if (isGenerating) return;
        if (!prompt.trim() && !startImage) {
            setError('Enter a prompt or add a start image.');
            return;
        }
        if (!apiKey) {
            setShowKeyModal(true);
            return;
        }

        setIsGenerating(true);
        setError(null);
        setProgress('Preparing…');

        const model = VEO_MODELS[modelKey];

        try {
            const videoUrl = await generateVideo(
                apiKey,
                prompt,
                {
                    model,
                    aspectRatio,
                    resolution,
                    negativePrompt,
                    startImage: startImage
                        ? { data: startImage.base64Data, mimeType: startImage.mimeType }
                        : null,
                },
                (s) => setProgress(s)
            );

            const newResult: VideoResult = {
                videoUrl,
                prompt,
                timestamp: Date.now(),
                aspectRatio,
                model,
            };
            setResult(newResult);
            setHistory((prev) => {
                const next = [newResult, ...prev];
                // Object URLs live until revoked; free the ones that fall out of
                // the 12-item window so long sessions don't leak blob memory.
                next.slice(12).forEach((v) => {
                    try { URL.revokeObjectURL(v.videoUrl); } catch {}
                });
                return next.slice(0, 12);
            });
        } catch (err: any) {
            console.error(err);
            const msg = err?.message || 'Video generation failed. Please try again.';
            setError(msg);
            // Only re-prompt for the key on genuine auth failures — NOT on
            // model-not-found or content errors (which used to bounce the user
            // back to the key screen for no reason).
            const authFail = /API key|invalid|unauthenticated|permission|401|403/i.test(msg);
            if (authFail) {
                setShowKeyModal(true);
            }
        } finally {
            setIsGenerating(false);
            setProgress('');
        }
    };

    const restoreHistoryItem = (item: VideoResult) => setResult(item);
    const reusePrompt = (p: string) => setPrompt(p);

    const handleDownload = () => {
        if (!result) return;
        const now = new Date();
        const dateStr = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1)
            .toString()
            .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
        const link = document.createElement('a');
        link.href = result.videoUrl;
        link.download = `nynk_${dateStr}_${result.timestamp}.mp4`;
        link.click();
    };

    return {
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
    };
};
