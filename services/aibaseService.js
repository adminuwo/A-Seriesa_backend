import { generativeModel } from '../config/vertex.js';
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Initialize Gemini Chat Model using existing config
const model = generativeModel;

// Simple in-memory document store (for demo - replace with Atlas Vector Search when configured)
let documentStore = [];

// Helper: Split text into chunks
const splitText = (text, chunkSize = 1000, overlap = 200) => {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));
        start = end - overlap;
        if (start + overlap >= text.length) break;
    }
    return chunks;
};

// Store document
export const storeDocument = async (text) => {
    try {
        const chunks = splitText(text);
        console.log(`[AIBASE] Split into ${chunks.length} chunks.`);

        // Store chunks in memory (or MongoDB)
        chunks.forEach(chunk => {
            documentStore.push({
                content: chunk,
                timestamp: Date.now()
            });
        });

        console.log(`[AIBASE] Total documents in store: ${documentStore.length}`);
        return true;
    } catch (error) {
        console.error(`[AIBASE] Store Document Error: ${error.message}`);
        return false;
    }
};

// Simple keyword-based search (fallback for when vector search isn't configured)
const searchDocuments = (query, topK = 4) => {
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    const scored = documentStore.map(doc => {
        const content = doc.content.toLowerCase();
        let score = 0;
        queryWords.forEach(word => {
            if (content.includes(word)) score++;
        });
        return { ...doc, score };
    });

    return scored
        .filter(doc => doc.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
};

// RAG Chat
export const chat = async (message) => {
    try {
        if (!message || typeof message !== 'string') {
            message = String(message || "");
        }

        // Search for relevant documents
        const retrievedDocs = searchDocuments(message, 4);

        // Format context
        let contextText = "";
        if (retrievedDocs && retrievedDocs.length > 0) {
            contextText = retrievedDocs
                .map(doc => doc.content)
                .join("\n\n");
            console.log(`[AIBASE] Found ${retrievedDocs.length} relevant docs.`);
        } else {
            console.log(`[AIBASE] No documents found for query.`);
            contextText = "No relevant documents found.";
        }

        // Create prompt
        const prompt = `
        You are the AI-Base Knowledge Assistant.

        INSTRUCTIONS:
        1. PRIMARY SOURCE: You MUST search the provided <context> first.
           - If the answer is in the <context>, answer ONLY using that information.
           
        2. SECONDARY SOURCE: If <context> does not contain the answer:
           - You may use your general knowledge.
           - Say: "I couldn't find this in your documents, but generally speaking..."

        3. GREETINGS: For casual messages (e.g., "Hi", "Thanks"), be polite and friendly.

        <context>
        ${contextText}
        </context>

        Question: ${message}
        `;

        // Invoke model (Gemini / Vertex AI)
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.candidates[0].content.parts[0].text;

        return text;

    } catch (error) {
        console.error(`[AIBASE] RAG Chat Error: ${error.message}`);

        // Fallback to direct chat
        try {
            const result = await model.generateContent(message);
            const response = await result.response;
            return response.candidates[0].content.parts[0].text;
        } catch (fallbackError) {
            return "Sorry, I encountered an error. Please try again.";
        }
    }
};

// Initialize from DB - Load existing documents
export const initializeFromDB = async () => {
    try {
        console.log("[AIBASE] Service initialized.");
        // In a production setup, you would load documents from MongoDB here
    } catch (error) {
        console.error(`[AIBASE] Failed to initialize: ${error.message}`);
    }
};

// Reload (clear documents)
export const reloadVectorStore = async () => {
    documentStore = [];
    console.log("[AIBASE] Document store cleared.");
};
