import React, { useState, useEffect, useRef } from "react";
import WaveForm from "./WaveForm";
import { Mic, MicOff } from "lucide-react";
import useTextToSpeechAnalyzer from "./TTS";
import LangsDropdown from "./LangDrodown";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

function MicToT() {
    const [isListening, setIsListening] = useState(false);
    const [saying, setSaying] = useState(true);
    const [note, setNote] = useState("");
    const [analyzerData, setAnalyzerData] = useState(null);
    const [language, setLanguage] = useState("en-US");
    const [tAFocused, setTAFocused] = useState(false);

    const audioContextRef = useRef(null);
    const analyzerRef = useRef(null);
    const microphoneRef = useRef(null);

    const onSelectChange = (sl) => {
        console.log("Selected audio language...", sl);
        setLanguage(sl);
    };

    // Call useTextToSpeechAnalyzer hook only once

    useEffect(() => {
        if (!SpeechRecognition) {
            console.error("SpeechRecognition is not supported in this browser.");
            return;
        }

        mic.continuous = true;
        mic.interimResults = true;
        mic.lang = language;

        const startMic = () => {
            mic.start();

            mic.onend = () => {
                console.log("Mic restarted");
                mic.start();
            };

            mic.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map((result) => result[0])
                    .map((result) => result.transcript)
                    .join("");
                setNote(note + " " + transcript);
            };

            mic.onerror = (event) => {
                console.log(event.error);
            };
        };

        const setupAudioContext = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
                analyzerRef.current = audioContextRef.current.createAnalyser();
                microphoneRef.current.connect(analyzerRef.current);

                const bufferLength = analyzerRef.current.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                const updateAnalyzerData = () => {
                    analyzerRef.current.getByteFrequencyData(dataArray);
                    setAnalyzerData({ dataArray, bufferLength });
                    requestAnimationFrame(updateAnalyzerData);
                };

                updateAnalyzerData();
            } catch (error) {
                console.error("Error accessing media devices.", error);
            }
        };

        if (isListening) {
            setSaying(false);
            startMic();
            setupAudioContext();
        } else {
            mic.stop();
            mic.onend = () => {
                console.log("Mic stopped");
            };
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        }

        return () => {
            mic.stop();
            mic.onend = null;
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [isListening, language]);

    const handleNoteChange = (event) => {
        setNote(event.target.value);
    };

    // Adjust the textarea size based on content


    return (
        <>
            <div className="flex gap-2 w-fit items-center">
                <LangsDropdown onSelectChange={onSelectChange} />
                <button
                    onClick={() => setIsListening((prevState) => !prevState)}
                    aria-label={isListening ? "Stop recording" : "Start recording"}
                    className="border-none min-w-fit rounded-full p-2 duration-100 transition hover:bg-gray-200"
                >
                    {isListening ? <Mic /> : <MicOff />}
                </button>
                <div className="mt-2">
                    <WaveForm
                        analyzerData={analyzerData}
                    />
                </div>
                <textarea
                    value={note}
                    placeholder="Command..."
                    onChange={handleNoteChange}
                    className="rounded-md border-2 max-w-md border-gray-200 px-2 py-1 bg-gray-50 text-gray-700 resize-none overflow-hidden"
                    rows={2} // Minimum number of visible rows
                    onFocus={() => setTAFocused(true)}
                    onBlur={() => setTAFocused(false)} // Handle unfocusing
                    aria-label="Command input area" // Improve accessibility
                />
                <button disabled={!tAFocused} className={`${tAFocused ? "hover:bg-gray-100 " : "opacity-50"} text-sm text-gray-500 duration-100 transition bg-gray-20 py-0.5 px-1.5 rounded-md`}>Send</button>
            </div>
            <useTextToSpeechAnalyzer text="hello how are you doing" />
        </>
    );
}

export default MicToT;
