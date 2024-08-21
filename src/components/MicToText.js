import React, { useState, useEffect, useRef } from "react";
import WaveForm from "./WaveForm";
import { Mic, MicOff } from "lucide-react";
import GenerateContent from "./AI/CommandToGemini";
import BarIcon from "./shared/icons/animatedBar";
import PopUpToast, { showSuccessToast, showErrorToast } from "./PopUpToast";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = SpeechRecognition ? new SpeechRecognition() : null;

function MicToT({ code, generateCode, codeLanguage, codeOutput, fName }) {
    const [isListening, setIsListening] = useState(false);
    const [note, setNote] = useState("");
    const [analyzerData, setAnalyzerData] = useState(null);
    const [language, setLanguage] = useState("en-US");
    const [tAFocused, setTAFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [noteError, setNoteError] = useState("");
    const [prompt, setPrompt] = useState("Hello!");

    const audioContextRef = useRef(null);
    const analyzerRef = useRef(null);
    const microphoneRef = useRef(null);
    const isMicRunningRef = useRef(false);
    const mediaStreamRef = useRef(null); // Ref to hold the media stream

    const onSelectChange = (sl) => {
        setLanguage(sl);
    };

    const startMic = () => {
        if (mic && !isMicRunningRef.current) {
            try {
                mic.start();
                console.log("Mic started");
            } catch {
                showErrorToast("Error starting the microphone");
            }
            isMicRunningRef.current = true;

            mic.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map((result) => result[0].transcript)
                    .join(" ");
                setNote(note + " " + transcript);
            };

            mic.onerror = (event) => {
                try {
                    mic.start();
                    console.log("Mic restarted");
                } catch {
                    setIsListening(false);
                    showErrorToast("Error occurred while restarting the microphone.");
                }
            };

            mic.onend = () => {
                isMicRunningRef.current = false;
            };
        }
    };

    const stopMic = () => {
        if (mic && isMicRunningRef.current) {
            try {
                mic.stop();
            } catch {
                showErrorToast("Error stopping the microphone");
            }
            isMicRunningRef.current = false;
        }
    };

    const setupAudioContext = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream; // Store the media stream
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
            analyzerRef.current = audioContextRef.current.createAnalyser();
            microphoneRef.current.connect(analyzerRef.current);

            const bufferLength = analyzerRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateAnalyzerData = () => {
                analyzerRef.current.getByteFrequencyData(dataArray);
                setAnalyzerData({ dataArray: [...dataArray], bufferLength });
                requestAnimationFrame(updateAnalyzerData);
            };

            updateAnalyzerData();
        } catch (error) {
            showErrorToast("Error accessing media devices.");
            console.error("Error accessing media devices.", error);
        }
    };

    const cleanUpAudioContext = () => {
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop()); // Stop all tracks of the media stream
            mediaStreamRef.current = null;
        }
    };

    useEffect(() => {
        if (!SpeechRecognition) {
            console.error("SpeechRecognition is not supported in this browser.");
            showErrorToast("Speech recognition is not supported in this browser.");
            return;
        }

        mic.continuous = true;
        mic.interimResults = true;
        mic.lang = language;

        if (isListening) {
            startMic();
            setupAudioContext();
        } else {
            stopMic();
            cleanUpAudioContext();
        }

        return () => {
            stopMic();
            cleanUpAudioContext();
        };
    }, [isListening, language]);

    const handleNoteChange = (event) => {
        setNote(event.target.value);
    };

    const handleAudioStarted = (bool) => {
        if (bool) {
            setLoading(false);
            setNote("");
            setPrompt("");
            setIsListening(false);
        }
    };

    const handleAudioEnded = (bool) => {
        if (bool) {
            setIsListening(true);
            setNote("");
        } 
    };

    const handleCommandSend = (e) => {
        e.preventDefault();
        setLoading(true);
        const trimmedNote = note.trim();
        if (trimmedNote) {
            setPrompt(trimmedNote);
            setIsListening(false);
            setNoteError("");
        } else {
            setLoading(false);
            setPrompt("");
            setNoteError("Enter a command");
        }
    };

    const handleResponseEnd = (bool) => {
        if (bool) {
            // Handle end of AI response
        }
    };

    useEffect(() => {
        if (note && !loading) {
            const timeoutId = setTimeout(() => {
                const trimmedNote = note.trim();
                if (trimmedNote) {
                    setPrompt(trimmedNote);
                    setLoading(true);
                    setIsListening(false);
                }
            }, 2000);

            return () => clearTimeout(timeoutId);
        }
    }, [note]);

    const genCode = (extCode) => {
        if (extCode) {
            generateCode(extCode);
        }
    };

    const codeLang = (language) => {
        if (language) {
            codeLanguage(language);
        }
    };

    return (
        <>
            <PopUpToast />
            <div className="flex gap-2 w-fit items-center">
                <button
                    onClick={() => setIsListening((prevState) => !prevState)}
                    aria-label={isListening ? "Stop recording" : "Start recording"}
                    className={`border-none min-w-fit rounded-full p-2 duration-100 transition ${
                        isListening ? "bg-red-500 text-white" : "hover:bg-gray-200"
                    }`}
                >
                    {isListening ? <Mic /> : <MicOff />}
                </button>
                <div className="mt-2">
                    <WaveForm analyzerData={analyzerData} />
                </div>
                <form onSubmit={handleCommandSend} className="flex">
                    <textarea
                        value={note}
                        placeholder="Command..."
                        onChange={handleNoteChange}
                        className="rounded-md border-2 max-w-md border-gray-200 px-2 py-1 bg-gray-50 text-gray-700 resize-none overflow-hidden"
                        rows={2}
                        onFocus={() => setTAFocused(true)}
                        onBlur={() => setTAFocused(false)}
                        aria-label="Command input area"
                        required
                    />
                    {noteError && <p className="text-sm text-red-400">{noteError}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`${
                            loading
                                ? "opacity-50 cursor-not-allowed"
                                : tAFocused
                                ? "hover:bg-gray-100"
                                : "opacity-50"
                        } text-sm text-gray-500 duration-100 transition bg-gray-20 py-0.5 px-1.5 rounded-md`}
                    >
                        {loading ? <BarIcon /> : "Send"}
                    </button>
                </form>
                <div>
                    <GenerateContent
                        codeOutput={codeOutput}
                        fName={fName}
                        audioStarted={handleAudioStarted}
                        genCode={genCode}
                        codeLang={codeLang}
                        code={code}
                        responseEnd={handleResponseEnd}
                        audioEnded={handleAudioEnded}
                        prompt={prompt}
                    />
                </div>
            </div>
        </>
    );
}

export default MicToT;
