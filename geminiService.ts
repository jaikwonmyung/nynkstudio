
import { GoogleGenAI } from "@google/genai";
import { ImageSize, AspectRatio, EngineType } from "./types";
import { APP_MODEL, TURBO_MODEL } from "./constants";
import { buildConsistencyPrompt, buildNeutralPrompt } from "./prompts";

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
  config: { size: ImageSize; aspectRatio: AspectRatio; consistencyFixed: boolean; engineType: EngineType }
) => {
  const ai = new GoogleGenAI({ apiKey });
  const selectedModel = config.engineType === "NANOBANANA2" ? TURBO_MODEL : APP_MODEL;

  // Combine prompt logic
  let fullPrompt = "";
  if (config.consistencyFixed) {
    fullPrompt = buildConsistencyPrompt(userPrompt);
  } else {
    fullPrompt = buildNeutralPrompt(userPrompt);
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
      model: selectedModel,
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
