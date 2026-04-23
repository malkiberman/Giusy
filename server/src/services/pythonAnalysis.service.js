const axios = require("axios");
const FormData = require("form-data");

/**
 * שולח אודיו + תשובות לפייתון ומחזיר features
 */
async function sendAudioToPython(audioFile, answers) {
  if (!audioFile) return null;

  try {
    const form = new FormData();

    // 🎤 קובץ אודיו מהמולטר (buffer)
    form.append("audio", audioFile.buffer, {
      filename: audioFile.originalname || "audio.webm",
      contentType: audioFile.mimetype,
    });

    // 🧾 תשובות
    form.append("answers", JSON.stringify(answers));

    const response = await axios.post(
      "http://127.0.0.1:8000/analyze",
      form,
      {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    return response.data?.audio_features || null;

  } catch (err) {
    console.warn("[Python Audio Analysis Failed]", err.message);
    return null;
  }
}

module.exports = { sendAudioToPython };