import fs from "fs";
import yaml from "js-yaml";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const loadYamlConfig = (filePath) => {
  try {
    const yamlPath = path.resolve(filePath);
    const fileContents = fs.readFileSync(yamlPath, "utf8");
    return yaml.load(fileContents);
  } catch (error) {
    console.error("Error loading YAML config:", error);
    return {};
  }
};

const yamlConfig = loadYamlConfig("config.yaml");

const settings = {
  projectId: process.env.GCP_PROJECT_ID || yamlConfig.project_id,
  location: process.env.GCP_LOCATION || yamlConfig.location,
  geminiModelName: process.env.GEMINI_MODEL_NAME || yamlConfig.gemini_model_name,
  embeddingModelName: process.env.EMBEDDING_MODEL_NAME || yamlConfig.embedding_model_name,
  imageGenerationModelName: process.env.IMAGE_GENERATION_MODEL_NAME || yamlConfig.image_generation_model_name,
  database: process.env.DATABASE || yamlConfig.database,
  collection: process.env.FIRESTORE_COLLECTION || yamlConfig.collection,
  testCollection: process.env.TEST_COLLECTION || yamlConfig.test_collection,
  topK: parseInt(process.env.TOP_K || yamlConfig.top_k || "5"),
  port: parseInt(process.env.PORT || yamlConfig.port || "8080"),
};

export default settings;