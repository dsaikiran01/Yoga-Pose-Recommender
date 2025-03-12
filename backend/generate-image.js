import { VertexAI } from "@google-cloud/vertexai";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const vertexAI = new VertexAI({
  projectId: process.env.GCP_PROJECT_ID,
  location: process.env.GCP_LOCATION,
  modelName: process.env.IMAGE_GENERATION_MODEL_NAME,
});

const generateImage = async (prompt) => {
  try {
    console.log("Generating image for prompt:", prompt);
    const response = await vertexAI.predict({ instances: [{ prompt, number_of_images: 1, aspect_ratio: "1:1" }] });
    if (!response.predictions || response.predictions.length === 0) {
      console.error("No images generated");
      return null;
    }

    const imageBuffer = Buffer.from(response.predictions[0]._image_bytes, "base64");
    const outputDir = path.resolve("./images");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    const outputFile = path.join(outputDir, `${uuidv4()}.png`);
    
    fs.writeFileSync(outputFile, imageBuffer);
    console.log(`Created output image: ${outputFile}`);
  } catch (error) {
    console.error("Error generating image:", error);
  }
};

if (require.main === module) {
  generateImage("Generate photo of Indian flag being unfurled");
}

export { generateImage };