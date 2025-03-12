import fs from "fs";
import path from "path";
import textToSpeech from "@google-cloud/text-to-speech";
import dotenv from "dotenv";

dotenv.config();

const client = new textToSpeech.TextToSpeechClient();

const uniqueLanguagesFromVoices = (voices) => {
  const languageSet = new Set();
  voices.forEach((voice) => {
    voice.languageCodes.forEach((code) => languageSet.add(code));
  });
  return Array.from(languageSet).sort();
};

export const listLanguages = async () => {
  const [response] = await client.listVoices();
  const languages = uniqueLanguagesFromVoices(response.voices);
  console.log(` Languages: ${languages.length} `.padStart(30, "-").padEnd(60, "-"));
  languages.forEach((lang, i) => {
    process.stdout.write(`${lang.padEnd(10)}`);
    if (i % 5 === 4) console.log();
  });
  console.log();
};

export const listVoices = async (languageCode = null) => {
  const [response] = await client.listVoices({ languageCode });
  const voices = response.voices.sort((a, b) => a.name.localeCompare(b.name));
  console.log(` Voices: ${voices.length} `.padStart(30, "-").padEnd(60, "-"));
  voices.forEach(({ name, languageCodes, ssmlGender, naturalSampleRateHertz }) => {
    console.log(
      `${languageCodes.join(", ")}`.padEnd(10) +
        ` | ${name}`.padEnd(25) +
        ` | ${ssmlGender}`.padEnd(10) +
        ` | ${naturalSampleRateHertz} Hz`
    );
  });
};

export const textToWav = async (voiceName, text) => {
  const languageCode = voiceName.split("-").slice(0, 2).join("-");
  const request = {
    input: { text },
    voice: { languageCode, name: voiceName },
    audioConfig: { audioEncoding: "LINEAR16" },
  };
  
  try {
    const [response] = await client.synthesizeSpeech(request);
    const audioDir = path.resolve("./audio");
    if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir);
    const filePath = path.join(audioDir, `${voiceName}.wav`);
    fs.writeFileSync(filePath, response.audioContent, "binary");
    console.log(`Generated speech saved to "${filePath}"`);
  } catch (error) {
    console.error("Error generating speech:", error);
  }
};

if (require.main === module) {
  (async () => {
    await textToWav(
      "en-IN-Wavenet-C",
      "Padangusthasana (Big Toe Pose) is a beginner standing forward bend. Grasp your big toe, lengthening your spine to gently stretch hamstrings and calves. Keep knees slightly bent to avoid strain. Focus on lengthening, not forcing the bend."
    );
  })();
}
