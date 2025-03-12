import { FirestoreVectorStore } from "@google-cloud/firestore";
import { VertexAIEmbeddings } from "@google-cloud/vertexai";
import admin from "firebase-admin";
import dotenv from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

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

const vectorStore = new FirestoreVectorStore({
  client: db,
  collection: process.env.FIRESTORE_COLLECTION,
  embeddingService: embedding,
});

const search = async (query) => {
  try {
    console.log(`Executing query: ${query}`);
    const results = await vectorStore.similaritySearch({
      query,
      k: parseInt(process.env.TOP_K || "5"),
      includeMetadata: true,
    });
    results.forEach((result) => console.log(result.pageContent));
  } catch (error) {
    console.error("Search error:", error);
  }
};

const args = yargs(hideBin(process.argv))
  .option("prompt", {
    alias: "p",
    type: "string",
    demandOption: true,
    description: "The search query prompt",
  })
  .help()
  .argv;

search(args.prompt);
