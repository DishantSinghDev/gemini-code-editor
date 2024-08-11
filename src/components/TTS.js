import { useState, useEffect, useRef } from 'react';
import { processSpeech } from '../api';

const TextToSpeechAnalyzer = async (text) => {
    const speech = await processSpeech(text)
    return (
        <>
        Hello
        
        </>
    );
};

export default TextToSpeechAnalyzer;
