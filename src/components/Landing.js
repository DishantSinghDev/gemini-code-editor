import React, { useEffect, useState, useRef } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";
import { encode } from "base-64";
import PopUpToast, { showSuccessToast, showErrorToast } from "./PopUpToast";
import "react-toastify/dist/ReactToastify.css";

import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import Footer from "./Footer";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import MicToT from "./MicToText";
import SignIn from "./SignInPopUp";
import { auth, signInWithGooglePopup } from "../utils/firebase.utils";
import { onAuthStateChanged } from "firebase/auth";
import useLocalStorage from "../hooks/use-local-storage";
import createOrUpdateFile from "./GoogleDrive/createFiles";
import fetchFileContent from "./GoogleDrive/fetchFileContent";
import CloudIcon from "./shared/icons/cloudIcon";
import updateFileName from "./GoogleDrive/updateFileName";
import fetchAllFileNames from "./GoogleDrive/fetchFileName";

// Default code for a new file
const javascriptDefault = ``;

const Landing = () => {
  // State management
  const [code, setCode] = useState(javascriptDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [user, setUser] = useState(null);
  const [codeChanged, setCodeChanged] = useState(true);
  const [fileName, setFileName] = useState("index.js");
  const [accessToken, _] = useLocalStorage('accessToken', '');
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudFetched, setCloudFetched] = useState(false);
  const [cloudError, setCloudError] = useState(false);
  const [currentFileName, setCurrentFileName] = useState("index.js");

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const folderName = "GeminiIDE";

  // Handle language selection change
  const onSelectChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    const newFileName = `index${selectedLanguage.extension}`;
    setFileName(newFileName);
  };

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    if (["light", "vs-dark"].includes(newTheme.value)) {
      setTheme(newTheme);
    } else {
      defineTheme(newTheme.value).then(() => setTheme(newTheme));
    }
  };

  // Fetch and set the initial theme
  useEffect(() => {
    defineTheme("oceanic-next").then(() =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  // Handle Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });

    return unsubscribe;
  }, []);

  // Function to get file extension
  const getExtension = (filename) => {
    return filename.substring(filename.lastIndexOf('.'));
  };

  // Handle file name fetching
  useEffect(() => {
    if (accessToken && fileName && user) {
      const fetchContent = async () => {
        try {
          const fileNames = await fetchAllFileNames(accessToken, folderName, handleFileFetched, handleFileFetching);
          if (fileNames.length !== 0) {
            setCurrentFileName(fileNames[0]);
            setFileName(fileNames[0]);
            const ext = getExtension(fileNames[0]);
            onSelectChange(languageOptions.find((l) => l.extension === ext));
          }
        } catch (error) {
          console.error("Error fetching content:", error);
        }
      };

      fetchContent();
    }
  }, [accessToken, user, currentFileName]);

  // handle file content fetching
  useEffect(() => {
    if (accessToken && fileName && user) {
      const fetchContent = async () => {
        try {
          const content = await fetchFileContent(accessToken, folderName, fileName, handleContentFetched, handleContentFetching);
          if (content) {
            setCode(content);
            setCodeChanged(!codeChanged);
          }
        } catch (error) {
          console.error("Error fetching content:", error);
        }
      };

      fetchContent();
    }
  }, [currentFileName, user]);

  // Create or update file

  const timeoutRef = useRef(null);

  useEffect(() => {

    if (accessToken && code && fileName && user) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        createOrUpdateFile(accessToken, folderName, fileName, code, handleFileCreated, handleFileLoad);
      }, 2000);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [accessToken, code, user]);

  // on File name change
  const timeoutFNRef = useRef(null);

  useEffect(() => {

    if (accessToken && code && fileName && user) {
      if (timeoutFNRef.current) {
        clearTimeout(timeoutFNRef.current);
      }

      timeoutFNRef.current = setTimeout(() => {
        console.log("File name changing...");
        const filen = updateFileName(accessToken, folderName, currentFileName, fileName, handleFileNameChanged, handleFileNameChanging);
        if (filen) {
          setCurrentFileName(fileName);
        }
      }, 2000);

      return () => {
        if (timeoutFNRef.current) {
          clearTimeout(timeoutFNRef.current);
        }
      };
    }
  }, [accessToken, fileName, user]);

  // Compile code and handle responses
  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      source_code: encode(code), // Encode source code in base64
      stdin: encode(customInput),
    };

    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then((response) => {
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        const error = err.response ? err.response.data : err;
        const status = err.response ? err.response.status : null;

        if (status === 429) {
          showErrorToast("Quota of 100 requests exceeded for the Day! Please try again later.", 10000);
        }
        setProcessing(false);
        showErrorToast("Error during axios request!");
        console.error("Error during compilation:", error);
      });
  };

  // Check the status of the compilation
  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: `${process.env.REACT_APP_RAPID_API_URL}/${token}`,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };

    try {
      const response = await axios.request(options);
      const statusId = response.data.status?.id;

      if (statusId === 1 || statusId === 2) {
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast("Compiled Successfully!");
      }
    } catch (err) {
      console.error("Error fetching status:", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  // Handle file creation and loading
  const handleFileCreated = (file) => {
    if (file) {
      setCloudFetched(true);
      setCloudError(false);
      setCloudLoading(false);
    } else {
      showErrorToast("Failed to create file!");

      setCloudFetched(false);
      setCloudError(true);
      setCloudLoading(false);
    }
  };

  const handleFileLoad = (file) => {
    if (file) {
      console.log("File creation loading...");
      setCloudFetched(false);
      setCloudError(false);
      setCloudLoading(true);
    }
  };

  const handleContentFetched = (content) => {
    if (content) {
      showSuccessToast("File content fetched successfully!");
      setCloudFetched(true);
      setCloudError(false);
      setCloudLoading(false);
    }
  };

  const handleContentFetching = (content) => {
    if (content) {
      console.log("Fetching content...");
      setCloudFetched(false);
      setCloudError(false);
      setCloudLoading(true);
    }
  };

  // Handle file name change
  const handleFileNameChanged = (bool) => {
    if (bool) {
      setCloudFetched(true);
      setCloudError(false);
      setCloudLoading(false);
    } else {
      showErrorToast("Failed to change file name!");

      setCloudFetched(false);
      setCloudError(true);
      setCloudLoading(false);
    }
  };

  const handleFileNameChanging = (bool) => {
    if (bool) {
      console.log("File name changing...");
      setCloudFetched(false);
      setCloudError(false);
      setCloudLoading(true);
    }
  };

  // Handle file name fetching
  const handleFileFetched = (file) => {
    if (file) {
      setCloudFetched(true);
      setCloudError(false);
      setCloudLoading(false);
    }
  };

  const handleFileFetching = (file) => {
    if (file) {
      console.log("Fetching file name...");
      setCloudFetched(false);
      setCloudError(false);
      setCloudLoading(true);
    }
  };



  // Handle code and language changes
  const onChange = (action, data) => {
    if (action === "code") {
      setCode(data);
    } else {
      console.warn("Action not handled!", action, data);
    }
  };

  const handleGenCode = (generatedCode) => {
    if (generatedCode) {
      setCode(generatedCode);
      setCodeChanged(!codeChanged);
    }
  };

  const handleCodeLanguage = (languageValue) => {
    if (languageValue) {
      const selectedLanguage = languageOptions.find((l) => l.value === languageValue);
      onSelectChange(selectedLanguage);
    }
  };

  // Handle key press events
  useEffect(() => {
    if (enterPress && ctrlPress && user) {
      handleCompile();
    }
  }, [ctrlPress, enterPress]);

  return (
    <>
      <PopUpToast />

      <SignIn />

      <div className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600"></div>
      <div className="flex flex-row">
        <div className="px-4 py-2">
          <LanguagesDropdown languageSelected={language} onSelectChange={onSelectChange} />
        </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
        {user ? (
          <div className="px-4">
            <MicToT code={code} generateCode={handleGenCode} codeLanguage={handleCodeLanguage} />
          </div>
        ) : (
          <></>
        )}
      </div>
      {user ? (

        <div className="flex flex-row gap-3 space-x-4 items-center px-4 py-4">
          <input type="text" className="py-2.5 px-5 me-2 ml-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" value={fileName} onChange={(e) => setFileName(e.target.value)} />
          <CloudIcon cloudError={cloudError} cloudFetched={cloudFetched} cloudLoading={cloudLoading} />
        </div>
      ) : (
        <> </>
      )}
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
            codeChanged={codeChanged}
            removePrevCode={true}
            animationEnds={(bool) => {
              if (bool) {
                handleCompile();
              }
            }}
          />
        </div>

        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
            <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
            <button
              onClick={handleCompile}
              disabled={!code || !user}
              className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                !code || !user ? "opacity-50" : ""
              )}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Landing;
