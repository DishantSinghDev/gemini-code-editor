// services/api.ts

import axios from 'axios';

// Base URL of your Express API
const API_URL = "https://gemini-ide-server.dishantsingh.me"; // Update this if your Express server URL changes

// Function to generate content
export const generateContent = async (prompt) => {
    try {
        const response = await fetch(`${API_URL}/generate`,  {
            body: JSON.stringify({ prompt }),
            headers: {
                'Content-Type': 'application/json', // Ensure the content type is set
            },
            method: 'POST',
        });
        const text = await response.text()
        return text;
    } catch (error) {
        console.error('Error generating content:', error);
        throw new Error('Error generating content');
    }
};

// Function to process speech
export const processSpeech = async (ssml) => {
    try {
        const response = await fetch(`${API_URL}/voice`, {
            body: JSON.stringify({ ssml }),
            headers: {
                'Content-Type': 'application/json', // Ensure the content type is set
            },
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the response as a binary buffer
        const audioBlob = await response.blob();
        return audioBlob; // Return the Blob for handling in the frontend
    } catch (error) {
        console.error('Error processing speech:', error);
        throw new Error('Error processing speech');
    }
};
