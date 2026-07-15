
import { GoogleGenAI } from "@google/genai";
import { ImageSize, AspectRatio, EngineType } from "./types";
import { DEFAULT_POSITIVE_PROMPT, DEFAULT_NEGATIVE_PROMPT, APP_MODEL, TURBO_MODEL } from "./constants";

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
    fullPrompt = `TASK: visual_editing
    TARGET_IMAGE: Image 1 (Reference)
    EDIT_INSTRUCTION: "${userPrompt}"
    
    STRICT CONSTRAINTS:
    1. PRESERVE BACKGROUND: You must legacy-preserve the original background, floor, walls, ceiling, windows, and view outside strict pixel-for-pixel.
    2. LIGHTING LOCK: The time of day, color temperature, and shadow direction MUST mirror the reference image exactly. Do not make it brighter or change the mood.
    3. CAMERA LOCK: The camera angle, focal length, and perspective must remain 100% identical.
    4. PRESERVATION PRIORITY: It is better to have a slightly imperfect edit than to change the background.
    5. NON-DESTRUCTIVE: Treat this as a Photoshop layer edit. Do not re-render the underlying room.`;
  } else {
    // Neutral generation: follow the user's description literally. Do NOT force
    // any architecture / building / brutalist theme — that was the cause of
    // buildings appearing in every output.
    const cleanPrompt = (userPrompt || "").trim();
    fullPrompt = `${cleanPrompt}

Rendering guidance: ${DEFAULT_POSITIVE_PROMPT}.
Follow the description above literally. Do not introduce any unrequested subjects, scenery, or architecture (no buildings, concrete, or brutalist structures unless the description explicitly asks for them).
Avoid: ${DEFAULT_NEGATIVE_PROMPT}.`;
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
