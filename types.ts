
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
