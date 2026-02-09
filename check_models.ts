
import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

async function main() {
    try {
        const envPath = path.resolve(process.cwd(), ".env.local");
        const envContent = fs.readFileSync(envPath, "utf-8");
        const apiKeyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);

        if (!apiKeyMatch) {
            console.error("Could not find VITE_GEMINI_API_KEY in .env.local");
            return;
        }

        const apiKey = apiKeyMatch[1];
        const ai = new GoogleGenAI({ apiKey });

        console.log("Listing available models...");
        // The SDK might not have a direct listModels on the client instance in some versions, 
        // but usually it's under valid methods. 
        // For @google/genai v1+, let's see if we can just try a simple generation to test a model
        // or if we can list models. 
        // It seems listModels is available on the `models` property or via a separate call.
        // Actually, looking at the docs, standard is `ai.models.list()`.

        // Using a typed approach might fail if types aren't perfect, so we use any.
        const models = await (ai as any).models.list();

        // In newer SDKs it might be an async iterator
        for await (const model of models) {
            console.log(`Model: ${model.name}`);
            console.log(`  DisplayName: ${model.displayName}`);
            console.log(`  SupportedGenerationMethods: ${model.supportedGenerationMethods}`);
            console.log("---");
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

main();
