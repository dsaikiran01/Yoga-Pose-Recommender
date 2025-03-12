# Yoga Pose Recommender (MERN + Firestore)

This project is a **Yoga Pose Recommender** application, migrated from Flask to a **MERN-based stack** using **React, Express, Node.js, and Firestore** (instead of MongoDB). It integrates Google Cloud services for vector search, text-to-speech (TTS), and image generation.

## 📁 Folder Structure

```
├── backend                  # Express server
│   ├── server.js            # Main Express server
│   ├── searchData.js        # Firestore vector search
│   ├── generateDescriptions.js  # Generates descriptions via Vertex AI
│   ├── generateTTS.js       # Google Cloud Text-to-Speech
│   ├── generateImage.js     # Image generation using Vertex AI
│   ├── importData.js        # Import data into Firestore
│   ├── invokeGemini.js      # Query Gemini model
│   ├── settings.js          # Loads YAML & env configurations
│   ├── config.yaml          # Configuration file
│   └── package.json         # Backend dependencies
│
├── frontend                 # React frontend (Vite + TypeScript)
│   ├── src
│   │   ├── components       # UI components
│   │   ├── pages            # Pages (Search, Results, etc.)
│   │   ├── App.tsx          # Main React component
│   │   ├── index.tsx        # Entry point
│   │   ├── api.ts           # API calls to Express backend
│   │   ├── styles.css       # Tailwind CSS setup
│   ├── package.json         # Frontend dependencies
│
└── images                   # Stores generated images
```

## 🚀 Setup & Installation

### **1️⃣ Backend Setup**

#### **Install Dependencies**
```sh
cd backend
npm install
```

#### **Set up Google Cloud Credentials**
Ensure you have Google Cloud authentication set up:
```sh
export GOOGLE_APPLICATION_CREDENTIALS="path-to-your-service-account.json"
```

#### **Run Express Server**
```sh
npm start
```
_Server runs on `http://localhost:5000`_

### **2️⃣ Frontend Setup**

#### **Install Dependencies**
```sh
cd frontend
npm install
```

#### **Run React App**
```sh
npm run dev
```
_App runs on `http://localhost:5173`_

## 🔥 Features
- 🔍 **Yoga Pose Search**: Uses Firestore vector search.
- 📝 **Description Generation**: Powered by Google Vertex AI.
- 🔊 **Text-to-Speech (TTS)**: Uses Google Cloud TTS for pose descriptions.
- 🎨 **Image Generation**: Generates pose illustrations using Vertex AI.
- 📡 **Firestore Database**: Stores structured yoga pose data.

## 📌 API Routes
### **Backend (Express) Endpoints**
| Route                 | Method | Description |
|----------------------|--------|-------------|
| `/search`           | POST   | Search for yoga poses |
| `/generate_audio`   | POST   | Generate TTS audio |
| `/generate_image`   | POST   | Generate yoga pose images |
| `/import_data`      | POST   | Import poses into Firestore |
| `/invoke_gemini`    | POST   | Query Gemini AI model |

## 📜 License
MIT License © 2024 Yoga Pose Recommender Team

---

💡 *For any issues, feel free to open a GitHub issue!* 🚀