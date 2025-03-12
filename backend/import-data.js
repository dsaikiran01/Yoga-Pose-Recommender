import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { VertexAIEmbeddings } from "@google-cloud/vertexai";
import { FirestoreVectorStore } from "@google-cloud/firestore";
import dotenv from "dotenv";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();
const embedding = new VertexAIEmbeddings({
  projectId: process.env.GCP_PROJECT_ID,
  location: process.env.GCP_LOCATION,
  modelName: process.env.GCP_EMBEDDING_MODEL_NAME,
});

const loadYogaPosesDataFromLocalFile = (filename) => {
  try {
    const filePath = path.resolve(filename);
    const poses = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log(`Loaded ${poses.length} poses.`);
    return poses;
  } catch (error) {
    console.error("Error loading dataset:", error);
    return null;
  }
};

const createLangchainDocuments = (poses) => {
  const documents = poses.map((pose) => ({
    pageContent: `name: ${pose.name || ""}\ndescription: ${pose.description || ""}\nsanskrit_name: ${pose.sanskrit_name || ""}\nexpertise_level: ${pose.expertise_level || "N/A"}\npose_type: ${pose.pose_type || "N/A"}`.trim(),
    metadata: pose,
  }));
  console.log(`Created ${documents.length} Langchain documents.`);
  return documents;
};

const main = async () => {
  const poses = loadYogaPosesDataFromLocalFile("./data/yoga_poses_with_descriptions.json");
  if (!poses) return;

  const documents = createLangchainDocuments(poses);
  console.log(`Successfully created langchain documents. Total documents: ${documents.length}`);

  const vectorStore = new FirestoreVectorStore({
    client: db,
    collection: process.env.FIRESTORE_COLLECTION,
    embeddingService: embedding,
  });

  await vectorStore.addDocuments(documents);
  console.log("Added documents to the vector store.");
};

main().catch(console.error);