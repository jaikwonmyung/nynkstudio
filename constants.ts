
// Neutral quality guidance — NO forced architecture/brutalism theme.
// Previously this injected an OMA/Rem Koolhaas concrete-building style into
// every generation, which is why buildings kept appearing regardless of prompt.
export const DEFAULT_POSITIVE_PROMPT =
  "photorealistic, high resolution, sharp focus, natural lighting, true-to-life color, fine detail, clean composition";

export const DEFAULT_NEGATIVE_PROMPT =
  "low quality, blurry, distorted, deformed, watermark, text, jpeg artifacts, oversaturated, unrequested background objects";

// Image engines
export const APP_MODEL = "gemini-3-pro-image-preview";
export const TURBO_MODEL = "gemini-3-flash-preview";

// Video engines (Google Veo)
export const VEO_MODELS = {
  VEO3: "veo-3.0-generate-preview",
  VEO3_FAST: "veo-3.0-fast-generate-preview",
  VEO2: "veo-2.0-generate-001",
} as const;

export const DEFAULT_VEO_MODEL = VEO_MODELS.VEO3;
