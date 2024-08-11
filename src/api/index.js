// services/api.ts

import axios from 'axios';

// Base URL of your Express API
const API_URL = 'http://localhost:3001'; // Update this if your Express server URL changes

// Function to generate content
export const generateContent = async (prompt) => {
    try {
        const response = await axios.post(`${API_URL}/`, { prompt });
        return response.data;
    } catch (error) {
        console.error('Error generating content:', error);
        throw new Error('Error generating content');
    }
};

// Function to process speech
export const processSpeech = async (audioBase64) => {
    try {
        const response = await axios.post(`${API_URL}/voice`, { audioBase64 });
        return response.data;
    } catch (error) {
        console.error('Error processing speech:', error);
        throw new Error('Error processing speech');
    }
};
