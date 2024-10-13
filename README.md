# Gemini Code Editor - Generate code using voice or text, save to Google Drive, and compile

<img src="https://i.ibb.co/3dF0vP2/Screenshot-2024-08-15-at-11-03-59-AM.png" />

## Features: 
- Compile and execute code in 40+ programming languages.
- Switch themes from a list of available themes.
- Gemini API integrated
- Google TTS for speech
- Uses your unused Google Drive Storage to save and access coding files.

## Installations and setup

- git clone `https://github.com/dishantsinghdev/gemini-code-editor.git`
- `npm install`
- A sample `.env.sample` file is given, Register on [Rapid API](https://rapidapi.com/dishis-technologies-judge0/api/judge029/pricing) and get your API keys.
- Create a `.env` file.
- Add the API Keys in the `.env` file
- `npm start` to run the project.
- `cd server` to get to express app
- `node server.js` to run the express app 


## Tutorial

- Use the speaking audio icon to listen for the first time, then it auto speaks <img src="https://i.ibb.co/L19jVQJ/Screenshot-2024-08-15-at-12-22-47-PM.png"/>
- Use custom input when the code wants some input from user.
- If you get a mic error `Error occurred while listening. Please try again.` then mute and unmute the mic again. [this error will be solved in future updates]
- You can directly put the text in command to get the output without speaking into mic
- You will get poped up with sign in window in around every 1 hr to refresh the tokens for getting access to your google drive
- `GeminiIDE` folder is the only folder that this app use to create files and update them [No other data is fetched or proccessed]

TODO:

1. Add more languages [DONE]
2. User login, authentication and registration (Firebase Auth) [Done]
3. User Profile Page 
4. Save code functionality (Firestore - use Slug based approach)
5. Share code functionality
6. Increase Gemini Memory for better communication
7. Use Google Drive API to add and use multiple files together
