const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { SpeechClient } = require('@google-cloud/speech');
const util = require('util');
const dotenv = require('dotenv');
const cors = require('cors');  // Import the cors package

dotenv.config();

const app = express();
const PORT = 3001;

// Use CORS middleware to allow requests from different origins
app.use(cors({
    origin: '*',  // You might want to restrict this to specific origins
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Middleware to parse JSON bodies
app.use(express.json());

app.post("/", async (req, res) => {
    const { prompt, apiKey } = req.body;
    console.log(prompt, apiKey);

    if (!prompt) {
        return res.status(404).json({ error: "Prompt is required" });
    } 
    if (!apiKey) {
        return res.status(403).json({ error: "API Key is required" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.status(200).send(text);
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(error.status || 500).json({ error: error.errorDetails || 'Error generating content' });
    }
});

// New route for processing speech input
app.post("/voice", async (req, res) => {
    const { audioBase64 } = req.body;

    if (!audioBase64) {
        return res.status(400).json({ error: "Audio data is required" });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "API Key is not configured" });
    }

    const generativeAI = new GoogleGenerativeAI(apiKey);
    const speechClient = new SpeechClient();

    try {
        // Decode base64 audio data
        const audioBuffer = Buffer.from(audioBase64, 'base64');

        // Convert audio to text using Google Speech-to-Text
        const [response] = await speechClient.recognize({
            audio: {
                content: audioBuffer.toString('base64'),
            },
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
                languageCode: 'en-US',
            },
        });

        const transcription = response.results
            ? response.results.map(result => result.alternatives?.[0]?.transcript ?? '').join('\n') ?? ''
            : '';
        
        const model = generativeAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(transcription);
        const resp = await result.response;
        const text = resp.text();

        res.status(200).json({ result: text });
    } catch (error) {
        console.error("Error processing speech:", error);
        res.status(500).json({ error: 'Error processing request' });
    }
});


app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server running on port", PORT);
    } else {
        console.log("Error starting server:", error);
    }
});
