import { useState } from "react";
import { languageOptions } from "../constants/languageOptions"; // Assuming the language options are in a separate file

export function parseResponse(response) {
  const [ssmlText, setSsmlText] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");

  const extractCodeAndLanguage = (response) => {
    // Regex to match code blocks
    const codeRegex = /```(.*?)\n([\s\S]*?)```/g;
    let match;
    let extractedCode = "";
    let detectedLanguage = "text";

    while ((match = codeRegex.exec(response)) !== null) {
      extractedCode += match[2].trim(); // Extract code
      const lang = match[1].trim().toLowerCase(); // Extract language

      // Find the matching language option
      const languageOption = languageOptions.find((option) =>
        option.value.includes(lang)
      );

      if (languageOption) {
        detectedLanguage = languageOption.value;
      }
    }

    setCode(extractedCode);
    setLanguage(detectedLanguage);

    // Remove code blocks from response to get SSML text
    const ssml = response.replace(codeRegex, "").trim();
    setSsmlText(ssml);
  };

  extractCodeAndLanguage(response);

  return { ssmlText, code, language };
}
