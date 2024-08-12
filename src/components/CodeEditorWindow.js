import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({
  onChange,
  language = "javascript",
  code,
  theme,
  typingSpeed = 200,
  codeChanged,
  animationEnds = () => {},
  removePrevCode = false // Default to false
}) => {
  const [value, setValue] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    if (code) {
      if (removePrevCode) {
        setValue(""); // Clear the editor content if removePrevCode is true
      }
      animateCode(code);
    }
  }, [removePrevCode, codeChanged]); // Adjusted dependencies

  const animateCode = (fullCode) => {
    const words = fullCode.split(" ");
    let index = 0;

    setIsReadOnly(true); // Disable the editor while animating

    const interval = setInterval(() => {
      if (index < words.length) {
        setValue((prev) => {
          const newValue = prev + (index === 0 ? "" : " ") + words[index];
          onChange("code", newValue);
          return newValue;
        });
        index++;
      } else {
        clearInterval(interval);
        setIsReadOnly(false); // Enable the editor when animation ends
        animationEnds(true);
      }
    }, typingSpeed); // Use typingSpeed prop
  };

  const handleEditorChange = (value) => {
    if (!isReadOnly) { // Only allow changes if the editor is not read-only
      setValue(value);
      onChange("code", value);
    }
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width="100%"
        language={language}
        value={value}
        theme={theme}
        options={{ readOnly: isReadOnly }} // Pass the readOnly option
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditorWindow;
