

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
}from '@google-cloud/vertexai';

const project = process.env.GCP_PROJECT_ID;
const location = 'us-central1';
const textModel =  'gemini-2.5-pro';
const visionModel = 'gemini-2.5-pro';

const vertexAI = new VertexAI({project: project, location: location});

// Instantiate Gemini models
export const generativeModel = vertexAI.getGenerativeModel({
    model: textModel,
    // The following parameters are optional
    // They can also be passed to individual content generation requests
    safetySettings: [{category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}],
    generationConfig: {maxOutputTokens: 4192},
    systemInstruction: {
      role: 'system',
      parts: [{"text": `You are AI-Mall, a helpful and intelligent assistant. `}]
    },
});

const generativeVisionModel = vertexAI.getGenerativeModel({
    model: visionModel,
});

const generativeModelPreview = vertexAI.preview.getGenerativeModel({
    model: textModel,
});