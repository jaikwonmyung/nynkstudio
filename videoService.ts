import { GoogleGenAI } from "@google/genai";
import { VideoAspectRatio, VideoResolution } from "./types";
import { DEFAULT_NEGATIVE_PROMPT } from "./constants";

export interface VideoGenConfig {
  model: string;
  aspectRatio: VideoAspectRatio;
  resolution: VideoResolution;
  negativePrompt?: string;
  startImage?: { data: string; mimeType: string } | null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Generate a video with Google Veo.
 * Veo is a long-running operation: we kick it off, poll until done, then
 * download the resulting file into an object URL for playback / download.
 */
export const generateVideo = async (
  apiKey: string,
  prompt: string,
  config: VideoGenConfig,
  onProgress?: (status: string) => void
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });

  const genConfig: any = {
    numberOfVideos: 1,
    aspectRatio: config.aspectRatio,
    // Allow people so ordinary prompts aren't blocked by the person filter.
    personGeneration: "allow_all",
    negativePrompt: config.negativePrompt?.trim()
      ? config.negativePrompt
      : DEFAULT_NEGATIVE_PROMPT,
    // 1080p is only valid for 16:9; everything else falls back to 720p.
    resolution: config.aspectRatio === "16:9" ? config.resolution : "720p",
  };

  const request: any = {
    model: config.model,
    prompt,
    config: genConfig,
  };

  if (config.startImage?.data) {
    request.image = {
      imageBytes: config.startImage.data,
      mimeType: config.startImage.mimeType,
    };
  }

  onProgress?.("Submitting to Veo…");

  let operation = await ai.models.generateVideos(request);

  onProgress?.("Rendering video…");

  let elapsed = 0;
  const POLL_MS = 8000;
  const MAX_MS = 6 * 60 * 1000; // 6 minute safety cap

  while (!operation.done) {
    if (elapsed > MAX_MS) {
      throw new Error("Video generation timed out. Please try again.");
    }
    await sleep(POLL_MS);
    elapsed += POLL_MS;
    onProgress?.(`Rendering video… ${Math.round(elapsed / 1000)}s`);
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const generated = (operation as any).response?.generatedVideos?.[0];
  if (!generated?.video) {
    const blocked = (operation as any).response?.raiMediaFilteredReasons?.[0];
    throw new Error(
      blocked
        ? `Blocked by safety filter: ${blocked}`
        : "No video was returned by the model."
    );
  }

  onProgress?.("Downloading…");

  // Prefer inline bytes if present, otherwise fetch the file URI with the key.
  const video = generated.video;
  if (video.videoBytes) {
    const byteChars = atob(video.videoBytes);
    const bytes = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
    const blob = new Blob([bytes], { type: "video/mp4" });
    return URL.createObjectURL(blob);
  }

  const uri: string | undefined = video.uri;
  if (!uri) throw new Error("Video file URI missing from response.");

  const sep = uri.includes("?") ? "&" : "?";
  const resp = await fetch(`${uri}${sep}key=${apiKey}`);
  if (!resp.ok) {
    throw new Error(`Failed to download video (${resp.status}).`);
  }
  const blob = await resp.blob();
  return URL.createObjectURL(blob);
};
