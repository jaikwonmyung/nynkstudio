import { DEFAULT_POSITIVE_PROMPT, DEFAULT_NEGATIVE_PROMPT } from "./constants";

export const buildConsistencyPrompt = (userPrompt: string) => `TASK: visual_editing
    TARGET_IMAGE: Image 1 (Reference)
    EDIT_INSTRUCTION: "${userPrompt}"
    
    STRICT CONSTRAINTS:
    1. PRESERVE BACKGROUND: You must legacy-preserve the original background, floor, walls, ceiling, windows, and view outside strict pixel-for-pixel.
    2. LIGHTING LOCK: The time of day, color temperature, and shadow direction MUST mirror the reference image exactly. Do not make it brighter or change the mood.
    3. CAMERA LOCK: The camera angle, focal length, and perspective must remain 100% identical.
    4. PRESERVATION PRIORITY: It is better to have a slightly imperfect edit than to change the background.
    5. NON-DESTRUCTIVE: Treat this as a Photoshop layer edit. Do not re-render the underlying room.`;

export const buildNeutralPrompt = (userPrompt: string) => {
  const cleanPrompt = (userPrompt || "").trim();
  return `${cleanPrompt}

Rendering guidance: ${DEFAULT_POSITIVE_PROMPT}.
Follow the description above literally. Do not introduce any unrequested subjects, scenery, or architecture (no buildings, concrete, or brutalist structures unless the description explicitly asks for them).
Avoid: ${DEFAULT_NEGATIVE_PROMPT}.`;
};
