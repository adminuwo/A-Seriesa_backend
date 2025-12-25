

import fs from "fs";

if (process.env.GOOGLE_CREDENTIALS_BASE64) {
  const decodedKey = Buffer.from(
    process.env.GOOGLE_CREDENTIALS_BASE64,
    "base64"
  ).toString("utf-8");

  fs.writeFileSync("/tmp/gcp-key.json", decodedKey);

  process.env.GOOGLE_APPLICATION_CREDENTIALS = "/tmp/gcp-key.json";
}


import {
  FunctionDeclarationSchemaType,
  HarmBlockThreshold,
  HarmCategory,
  VertexAI
} from '@google-cloud/vertexai';

const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
let project = process.env.GCP_PROJECT_ID;

if (keyFilePath && fs.existsSync(keyFilePath)) {
  try {
    const fileContent = fs.readFileSync(keyFilePath, 'utf8');
    const keyData = JSON.parse(fileContent);
    if (keyData.project_id) {
      project = keyData.project_id;
      console.log(`[VertexConfig] Loaded Project ID '${project}' from credentials file.`);
    }
  } catch (error) {
    console.error('[VertexConfig] Failed to read project_id from credentials file:', error.message);
  }
}

if (!project) {
  console.warn('[VertexConfig] GCP_PROJECT_ID is not set. Vertex AI may fail.');
}

const location = process.env.GCP_LOCATION || 'us-central1';
const textModel = 'gemini-2.5-pro';
const visionModel = 'gemini-2.5-pro';

console.log(`[VertexConfig] Initiating Vertex AI with Project: ${project}, Location: ${location}, Model: ${textModel}`);

const vertexAI = new VertexAI({
  project: project,
  location: location,
  googleAuthOptions: {
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  }
});

// Instantiate Gemini models
export const generativeModel = vertexAI.getGenerativeModel({
  model: textModel,
  safetySettings: [{ category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }],
  generationConfig: { maxOutputTokens: 4192 },
  systemInstruction: {
    role: 'system',
    parts: [{
      text: `You are AISA™, the internal intelligent assistant developed and trained under
Unified Web Options & Services (UWO) for the AI Mall™ ecosystem.
Development and implementation are led by Sanskar Sahu.

Do NOT introduce yourself unless explicitly asked.
Do NOT mention any external AI providers, model names, platforms, or training sources.
Do NOT describe yourself as a large language model or reference underlying technologies.

Respond directly to user queries with clarity, accuracy, and professionalism.

Communication rules:
- Keep responses concise, structured, and helpful
- Use simple, human-readable language
- Avoid meta explanations about how you work
- Ask clarifying questions only when necessary

Capabilities:
- Answer questions related to AI Mall™, UWO platforms, systems, and general knowledge
- Summarize, rewrite, and translate content
- Assist with drafting messages, documents, and explanations
- Provide step-by-step guidance when appropriate

Boundaries:
- Do not claim emotions, consciousness, or personal experiences
- Do not provide harmful, illegal, or unsafe information
- If information is uncertain, state limitations without technical or training disclosures

Primary objective:
Support UWO and AI Mall™ users by delivering reliable, practical, and brand-aligned assistance.
`}]
  },
});

const generativeVisionModel = vertexAI.getGenerativeModel({
  model: visionModel,
});

const generativeModelPreview = vertexAI.preview.getGenerativeModel({
  model: textModel,
});