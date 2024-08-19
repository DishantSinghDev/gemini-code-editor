import { useEffect, useState } from "react";
import { generateContent } from "../../api";
import TTS from "./TTS";
import { useParseResponse } from "../../utils/parse-gen-code";
import PopUpToast, { showSuccessToast, showErrorToast } from "../PopUpToast";


const GenerateContent = ({ prompt, audioStarted, audioEnded, responseEnd, code, genCode, codeLang, codeOutput, cLang }) => {
    const [error, setError] = useState(null); // Added state for error handling
    const [response, setResponse] = useState(null); // State to store the response

    // Call useParseResponse at the top level
    const { ssmlText, extCode, language } = useParseResponse(response);

    useEffect(() => {
        if (extCode && language) {
            genCode(extCode);
            codeLang(language);
        }
    }, [extCode, language]);
    useEffect(() => {
        const handleContentFetch = async () => {
            try {
                setError(null); // Clear any previous errors
                if (prompt) { // Ensure prompt is not empty before making the request
                    const response = await generateContent(`User Prompt: ${prompt}

User Code: [${code}]

Code Output: ${codeOutput}

Code Language: ${cLang}

Instructions: You are already in use by the user, so act accordingly. Respond concisely and professionally, as if you are an advanced developer. For general greetings like "hi," respond with an appropriate greetings. For questions or tutorial requests, use proper code and best practices to demonstrate the answer. If no user code is provided and an explanation is requested, code generation is mandatory. Support disfluencies like "oh," "uh," "um," and "mhm," and maintain a natural cadence and tone. For code generation requests, provide the code directly and summarize the main points. For all other responses, strictly write in SSML format only, enclosed within a single '<speak>' tag at the start and a '</speak>' tag at the end.
`);
                    setResponse(response); // Store the response in state
                    console.log("response", response);
                    responseEnd(true)
                }
            } catch (error) {
                console.error('Error processing speech:', error);
                responseEnd(true)
                showErrorToast('Failed to generate content. Please try again.'); // Show error toast
                setError('Failed to generate content. Please try again.'); // Set user-friendly error message
            }
        };
        if (prompt) {
            handleContentFetch(); // Call the async function
        }


    }, [prompt]); // Dependency array ensures this runs when `prompt` changes


    return (
        <div>
            <PopUpToast />
            <TTS audioEnded={audioEnded} audioStarted={audioStarted} autoplay={true} ssml={ssmlText} />
            {error && <p className="text-sm text-red-500">{error}</p>} {/* Display error if any */}
        </div>
    );
};

export default GenerateContent;
