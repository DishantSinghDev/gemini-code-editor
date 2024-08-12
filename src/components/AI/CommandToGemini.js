import { useEffect, useState } from "react";
import { generateContent } from "../../api";
import TTS from "./TTS";

export function fecthContent() {

}

const GenerateContent = ({ prompt, audioEnded, responseEnd, code }) => {
    const [ssml, setSsml] = useState("");
    const [genCode, setGenCode] = useState("")
    const [error, setError] = useState(null); // Added state for error handling

    useEffect(() => {
        const handleContentFetch = async () => {
            try {
                setError(null); // Clear any previous errors
                if (prompt) { // Ensure prompt is not empty before making the request
                    const response = await generateContent(`User Prompt: ${prompt}, User Code: [${code}]. Act like you are a professional coder with great communication skills. If the user prompt is a general greeting like "hi," respond with just "the greetings back" and nothing else. For other specific requests requiring code, generate the {code enclosed}. Provide other texts in (SSML format only no markdown) for improved voice interaction.`);
                    console.log(response)
                    
                    setSsml(response);
                    responseEnd(true)
                }
            } catch (error) {
                console.error('Error processing speech:', error);
                responseEnd(true)
                setError('Failed to generate content. Please try again.'); // Set user-friendly error message
            }
        };
        if (prompt) {
            handleContentFetch(); // Call the async function
        }


    }, [prompt]); // Dependency array ensures this runs when `prompt` changes


    return (
        <div>
            <TTS audioEnded={audioEnded} autoplay={true} ssml={ssml} />
            {error && <p className="text-sm text-red-500">{error}</p>} {/* Display error if any */}
        </div>
    );
};

export default GenerateContent;
