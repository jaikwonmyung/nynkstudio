
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
    fullPrompt = `CONSISTENCY INSTRUCTION: You are in 'Strict Editing' mode.
    1. The FIRST image provided is the MASTER REFERENCE.
    2. You MUST PRESERVE the content of the reference image EXACTLY, pixel-for-pixel where possible, including the background, spatial layout, lighting, camera angle, and composition.
    3. DO NOT generate a new perspective. DO NOT change the room structure, walls, floor, or windows.
    4. ONLY modify the specific objects or elements mentioned in the user's prompt: "${userPrompt}".
    5. If the user asks to replace an object, everything else in the scene MUST remain identical.
    6. Output must overlap perfectly with the reference image except for the requested changes.
    7. This is an IMAGE EDITING task, not a generation task.`;
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
    const generationConfig: any = {
      imageConfig: {
        aspectRatio: config.aspectRatio,
        imageSize: config.size,
      },
    };

    // Add low temperature for strict consistency
    if (config.consistencyFixed) {
      generationConfig.temperature = 0.0;
      generationConfig.topP = 0.1;
    }

    const response = await ai.models.generateContent({
      model: APP_MODEL,
      contents: { parts },
      config: generationConfig,
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
