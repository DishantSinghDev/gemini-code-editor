import { useState, useEffect, useRef } from 'react';
import { processSpeech } from '../api';

const useTextToSpeechAnalyzer = async (text) => {
    const speech = await processSpeech(text)

    return (
        <>
        {speech}
        
        </>
    );
};

export default useTextToSpeechAnalyzer;
