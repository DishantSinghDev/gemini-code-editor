const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
const cors = require('cors');  // Import the cors package
const textToSpeech = require('@google-cloud/text-to-speech');

dotenv.config();

const app = express();
const PORT = 5555;
const apiKey = process.env.GEMINI_API_KEY
const credentials = '/root/gemini-api/gemini-code-editor/credentials/credentials.json' // Path to your credentials file

// Use CORS middleware to allow requests from different origins
app.use(cors({
    origin: 'https://gide.vercel.app',  // You might want to restrict this to specific origins
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Middleware to parse JSON bodies
app.use(express.json());

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;
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
    const { ssml } = req.body;

    if (!ssml) {
        return res.status(400).json({ error: "SSML is required" });
    }

    try {
        const client = new textToSpeech.TextToSpeechClient({ keyFilename: credentials });

        const request = {
            input: { ssml },
            voice: {
                languageCode: 'en-US',
                name: 'en-US-Studio-Q',  // Example of a casual voice
                ssmlGender: 'MALE'
            },
            audioConfig: { 
                audioEncoding: 'MP3'
            },
        };

        const [response] = await client.synthesizeSpeech(request);

        res.set('Content-Type', 'audio/mp3');
        res.send(response.audioContent);
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
