import { VertexAI } from "@google-cloud/vertexai";
import dotenv from "dotenv";

dotenv.config();

const vertexAI = new VertexAI({
  projectId: process.env.GCP_PROJECT_ID,
  location: process.env.GCP_LOCATION,
  modelName: process.env.GEMINI_MODEL_NAME,
});

const invokeGemini = async (query) => {
  try {
    console.log("Initializing Vertex AI SDK");
    const response = await vertexAI.predict({ instances: [{ prompt: query }] });
    return response?.predictions?.[0] || "No response";
  } catch (error) {
    console.error("Error invoking Gemini:", error);
    return null;
  }
};

if (require.main === module) {
  (async () => {
    console.log(await invokeGemini("Tell me something about Yoga"));
  })();
}

export { invokeGemini };