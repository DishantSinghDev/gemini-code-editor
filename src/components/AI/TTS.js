import React, { useEffect, useRef, useState } from 'react';
import SoundIcon from '../shared/icons/animatedSound';
import { processSpeech } from '../../api';
import PopUpToast, { showSuccessToast, showErrorToast } from "../PopUpToast";

const TTS = ({ ssml, audioEnded, autoplay, audioStarted }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [url, setUrl] = useState("");
    const audioPlayerRef = useRef(null);

    const toggleAudio = () => {
        if (audioPlayerRef.current) {
            if (isPlaying) {
                audioPlayerRef.current.pause();
                setIsPlaying(false);
            } else {
                audioPlayerRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch((error) => {
                        console.error("Error while playing audio", error);
                        setIsPlaying(false);
                    });
            }
        }
    };

    useEffect(() => {
        const handleProcessSpeech = async () => {
            try {
                const response = await processSpeech(ssml);
                const newUrl = URL.createObjectURL(response);
                setUrl(newUrl);
                audioStarted(true);
                
                // Cleanup previous URL
                if (url) {
                    URL.revokeObjectURL(url);
                }

            } catch (error) {
                showErrorToast('Failed to process speech. Please try again.');
                console.error('Error processing speech:', error);
                audioEnded(true);
            }
        };
        
        if (ssml) {
            handleProcessSpeech();
        }
        
    }, [ssml]);

    useEffect(() => {
        if (autoplay && url) {
            toggleAudio();
        }

        // Cleanup URL on component unmount
        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [url, autoplay]);

    return (
        <>
        <PopUpToast />
        <div onClick={toggleAudio}>
            <SoundIcon animate={isPlaying} className="text-black cursor-pointer h-10 w-10" />
            <audio
                ref={audioPlayerRef}
                src={url}
                className='hidden'
                onEnded={() => {
                    setIsPlaying(false);
                    audioEnded(true);
                }}
            >
                Your browser does not support the audio element.
            </audio>
        </div>
        </>
    );
};

export default TTS;
