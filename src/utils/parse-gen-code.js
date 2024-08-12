import { useState, useEffect } from "react";
import { languageOptions } from "../constants/languageOptions";

export function useParseResponse(response) {
  const [ssmlText, setSsmlText] = useState("");
  const [extCode, setCode] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    const extractCodeAndLanguage = () => {
      // Regex to match code blocks
      const codeRegex = /```(.*?)\n([\s\S]*?)```/g;
      let match;
      let extractedCode = "";
      let detectedLanguage = "text";

      while ((match = codeRegex.exec(response)) !== null) {
        if (match[2]) {
          extractedCode += match[2].trim(); // Extract code
        }
        if (match[1]) {
          const lang = match[1].trim().toLowerCase(); // Extract language

          // Find the matching language option
          const languageOption = languageOptions.find((option) =>
            option.value.includes(lang)
          );

          if (languageOption) {
            detectedLanguage = languageOption.value;
          }
        }
      }

      // Remove unnecessary symbols from SSML
      const cleanSSML = response
        ? response.replace(codeRegex, "").replace(/[`,*]/g, "").trim() // Removing unwanted symbols
        : "";

      // Update state
      setCode(extractedCode);
      setLanguage(detectedLanguage);
      setSsmlText(cleanSSML);
    };

    extractCodeAndLanguage();
  }, [response]);

  return { ssmlText, extCode, language };
}
