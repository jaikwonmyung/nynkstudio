
import { GoogleGenAI } from "@google/genai";
import { ImageSize, AspectRatio } from "./types";
import { DEFAULT_POSITIVE_PROMPT, DEFAULT_NEGATIVE_PROMPT, APP_MODEL } from "./constants";

const resizeImage = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${base64Str}`;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      const MAX_SIZE = 1024;

      if (width > height) {
        if (width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(base64Str); // Fallback if context fails
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      // Compress to jpeg 0.8 for speed
      resolve(canvas.toDataURL("image/jpeg", 0.8).split(",")[1]);
    };
    img.onerror = () => {
      console.warn("Image resize failed, using original");
      resolve(base64Str); // Fail gracefully
    };
  });
};

export const generateImage = async (
  apiKey: string,
  userPrompt: string,
  images: { data: string; mimeType: string }[],
  config: { size: ImageSize; aspectRatio: AspectRatio; consistencyFixed: boolean }
) => {
  const ai = new GoogleGenAI({ apiKey });

  // Combine prompt logic
  let fullPrompt = "";
  if (config.consistencyFixed) {
    fullPrompt = `CONSISTENCY INSTRUCTION: You are in 'Architecture Consistency' mode.
    1. The FIRST image provided is the REFERENCE image.
    2. You MUST strictly maintain the architectural style, material palette, lighting, and composition of the REFERENCE image.
    3. Generate a NEW perspective or variation of the REFERENCE scene based on the user's prompt: "${userPrompt}".
    4. Do not deviate from the established visual language of the reference.
    5. If no specific change is requested, simply refine the reference image while keeping it visually identical.`;
  } else {
    fullPrompt = `Generate a high-quality architectural image based on this description: "${userPrompt}".
    Apply a minimalist, high-end, photorealistic aesthetic. Style Guide: ${DEFAULT_POSITIVE_PROMPT}. Avoid: ${DEFAULT_NEGATIVE_PROMPT}`;
  }

  // Prompt construction is handled above. Sending request...

  const parts = [
    ...await Promise.all(images.map(async (img) => ({
      inlineData: {
        data: await resizeImage(img.data),
        mimeType: "image/jpeg",
      },
    }))),
    { text: fullPrompt },
  ];

  try {
    const response = await ai.models.generateContent({
      model: APP_MODEL,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
          imageSize: config.size,
        },
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("No candidates returned from the model.");
    }

    // Find the image part as it may not be the first part.
    const imagePart = response.candidates[0].content.parts.find(p => p.inlineData);
    if (!imagePart || !imagePart.inlineData) {
      throw new Error("No image data found in the response.");
    }

    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
