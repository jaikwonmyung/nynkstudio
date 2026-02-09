# GM AI Core Logic & Upgrade Specification (v2.5)

This document contains the complete source logic for the **Gentle Monster AI** project, including the original implementation structure and the **Gemini 1.5 Flash** performance upgrade. Use this file to port the logic to another Antigravity instance or codebase.

---

## 1. System Overview
*   **Project Name:** Gentle Monster AI Studio
*   **Core Function:** Artificial Intelligence Spatial Visualization Program (AIVP)
*   **Tech Stack:** React (Frontend), Google Generative AI SDK (Logic), Vercel (Deployment)

---

## 2. AI Model Configuration

### A. Legacy Logic (Optimization Target)
*   **Model:** `gemini-pro` (Gemini 1.0)
*   **Performance:** ~2-4s Latency, Standard Context Window
*   **Limitation:** Slower reasoning, less capable of holding complex brand persona over long conversations.

### B. Upgraded Logic (v2.5)
*   **Model:** `gemini-1.5-flash`
*   **Performance:** **<1s Latency**, **1M+ Token Context**
*   **Capability:** High-velocity spatial synthesis, highly detailed architectural descriptions.

---

## 3. Core Implementation Code

### A. JavaScript / TypeScript Integration (React)

```javascript
import { GoogleGenerativeAI } from "@google/genai";

// 1. Configuration
const API_KEY = process.env.GEMINI_API_KEY; // "AIzaSy..."
const SYSTEM_INSTRUCTION = `
    ROLE: AI Architect for GENTLE MONSTER.
    TONE: Avant-garde, surreal, minimalist, high-fashion.
    TASK: Generate conceptual spatial descriptions.
    OUTPUT RULES:
    - No markdown formatting.
    - Focus on materials (concrete, metal, glass), lighting, and strange juxtapositions.
    - Be poetic but concise.
`;

// 2. Initialization
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
        temperature: 0.7, // Creativity balance
        maxOutputTokens: 500, // Concise output
    }
});

// 3. Execution Function
async function generateSpatialConcept(userInput) {
    try {
        const result = await model.generateContent(userInput);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("GM AI Error:", error);
        return "SYSTEM_HALTED: Neural link unstable.";
    }
}
```

### B. Python Integration (Backend Option)

```python
import google.generativeai as genai
import os

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction="You are the AI Architect for GENTLE MONSTER. Create avant-garde spatial concepts."
)

def generate_concept(prompt):
    response = model.generate_content(prompt)
    print(response.text)
```

---

## 4. Frontend Logic (Auth & Security)

### A. Password Protection (Client-Side)
The site uses a lightweight loader (`gm-loader.js`) to block access until a password is verified.

```javascript
const CONFIG = {
    password: 'spicymama', // Upgraded Password
    storageKey: 'gm_auth'
};

function checkAuth() {
    if (sessionStorage.getItem(CONFIG.storageKey) !== 'true') {
        // Block UI
        document.getElementById('app').style.filter = "blur(20px)";
        showLoginOverlay();
    }
}
```

---

## 5. Deployment Checklist
1.  **Environment Variables:** Set `GEMINI_API_KEY` in Vercel/Netlify.
2.  **SDK Version:** Ensure `@google/genai` is `^0.1.0` or newer for Flash support.
3.  **CORS:** If running exclusively on client-side, ensure Firebase/Google Cloud Console allows requests from your domain (`gentlemonster.studio`).
