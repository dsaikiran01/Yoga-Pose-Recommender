const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const { VertexAI } = require('@google-cloud/vertexai');
const { FirestoreVectorStore } = require('@google-cloud/firestore');
const textToSpeech = require('@google-cloud/text-to-speech');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const url = require('url');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();
const ttsClient = new textToSpeech.TextToSpeechClient();
const embedding = new VertexAI({
  projectId: process.env.GCP_PROJECT_ID,
  location: process.env.GCP_LOCATION,
  modelName: process.env.GCP_EMBEDDING_MODEL_NAME,
});

const vectorStore = new FirestoreVectorStore({
  client: db,
  collection: process.env.FIRESTORE_COLLECTION,
  embeddingService: embedding,
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const search = async (query) => {
  try {
    console.log(`Executing query: ${query}`);
    const results = await vectorStore.similaritySearch({
      query,
      k: parseInt(process.env.TOP_K || "5"),
      includeMetadata: false,
    });
    return results.map((doc) => ({
      page_content: doc.pageContent,
      metadata: doc.metadata,
    }));
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/search", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });
    const results = await search(prompt);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during search" });
  }
});

app.post("/generate_audio", async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ error: "Missing description" });

    const decodedDescription = decodeURIComponent(description);
    const voiceName = "en-US-Wavenet-D";
    const audioContent = await textToWav(voiceName, decodedDescription);

    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Disposition", "attachment; filename=audio.wav");
    res.send(audioContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const textToWav = async (voiceName, text) => {
  const request = {
    input: { text },
    voice: { languageCode: voiceName.split("-").slice(0, 2).join("-"), name: voiceName },
    audioConfig: { audioEncoding: "LINEAR16" },
  };
  const [response] = await ttsClient.synthesizeSpeech(request);
  return response.audioContent;
};

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
