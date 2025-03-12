import fs from "fs";
import path from "path";
import { VertexAI } from "@google-cloud/vertexai";
import dotenv from "dotenv";
import { setTimeout } from "timers/promises";

dotenv.config();

const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID,
  location: process.env.GCP_LOCATION,
  modelName: process.env.GEMINI_MODEL_NAME,
});

const generateDescription = async (poseName, sanskritName, expertiseLevel, poseTypes) => {
  const prompt = `
    Generate a concise description (max 50 words) for the yoga pose: ${poseName}
    Also known as: ${sanskritName}
    Expertise Level: ${expertiseLevel}
    Pose Type: ${poseTypes.join(", ")}

    Include key benefits and any important alignment cues.
  `;
  try {
    const response = await vertexAI.predict({ instances: [{ prompt }] });
    return response?.predictions?.[0] || "";
  } catch (error) {
    console.error(`Error generating description for ${poseName}:`, error);
    return "";
  }
};

const addDescriptionsToJson = async (inputFile, outputFile) => {
  const filePath = path.resolve(inputFile);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  
  for (let i = 0; i < data.length; i++) {
    const pose = data[i];
    if (pose.name !== " Pose") {
      const startTime = Date.now();
      pose.description = await generateDescription(
        pose.name,
        pose.sanskrit_name,
        pose.expertise_level,
        pose.pose_type
      );
      const timeTaken = (Date.now() - startTime) / 1000;
      console.log(`Processed: ${i + 1}/${data.length} - ${pose.name} (${timeTaken.toFixed(2)} seconds)`);
    } else {
      pose.description = "";
      console.log(`Skipped: ${i + 1}/${data.length} - ${pose.name}`);
    }
    
    await setTimeout(30000); // Delay to avoid rate limit
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
};

const main = async () => {
  const inputFile = "./data/yoga_poses.json";
  const outputFile = "./data/yoga_poses_with_descriptions.json";
  await addDescriptionsToJson(inputFile, outputFile);
};

main().catch(console.error);
