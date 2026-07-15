
export type ImageSize = "1K" | "2K" | "4K";
export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
export type EngineType = "4K" | "NANOBANANA2";

export interface ReferenceImage {
  id: string;
  file: File;
  previewUrl: string;
  base64Data: string;
  mimeType: string;
}

export interface GenerationResult {
  imageUrl: string;
  prompt: string;
  timestamp: number;
}

// ---- Video (Veo) ----
export type VideoAspectRatio = "16:9" | "9:16";
export type VideoResolution = "720p" | "1080p";
export type VeoModelKey = "VEO3" | "VEO3_FAST" | "VEO3_LITE";

export interface VideoResult {
  videoUrl: string; // object URL or data URL
  prompt: string;
  timestamp: number;
  aspectRatio: VideoAspectRatio;
  model: string;
}
