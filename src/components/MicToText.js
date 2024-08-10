import React, { useState, useEffect } from "react";
import WaveForm from "./WaveForm";


const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

function MicToT() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("Mic restarted");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Mic stopped");
      };
    }

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setNote(transcript);
    };

    mic.onerror = (event) => {
      console.log(event.error);
    };

    return () => {
      mic.stop();
      mic.onend = null;
    };
  }, [isListening]);

  const handleSaveNote = () => {
    if (note) {
      setSavedNotes((prevNotes) => [...prevNotes, note]);
      setNote("");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6 text-white">Voice Notes</h1>
      <div className="container mx-auto p-4 flex flex-col">
        <div className="box mb-8">
          <h2 className="text-lg font-semibold text-white">Current Note</h2>
          <div className="relative mt-4 mb-6">
            <div
              className={`mic ${isListening ? "animate-mic active" : ""} mx-auto`}
              onClick={() => setIsListening((prevState) => !prevState)}
            >
              <WaveForm isListening={isListening} />
            </div>
          </div>
          <button
            onClick={handleSaveNote}
            disabled={!note}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-4 disabled:opacity-50"
            aria-label="Save current note"
          >
            Save Note
          </button>
          <p className="text-white">{note}</p>
        </div>
        <div className="box">
          <h2 className="text-lg font-semibold text-white">Saved Notes</h2>
          {savedNotes.map((n, index) => (
            <p key={index} className="text-white mt-2">{n}</p>
          ))}
        </div>
      </div>

    </>
  );
}

export default MicToT;
