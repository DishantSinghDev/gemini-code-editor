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
- A sample `.env.sample` file is given, Register on <a href="https://rapidapi.com/judge0-official/api/judge0-ce/pricing" target="__blank">RapidAPI</a> and get your API keys.
- Create a `.env` file.
- Add the API Keys in the `.env` file
- `npm start` to run the project.
- `cd server` to get to express app
- `node server.js` to run the express app 


TODO:

1. Add more languages [DONE]
2. User login, authentication and registration (Firebase Auth) [Done]
3. User Profile Page 
4. Save code functionality (Firestore - use Slug based approach)
5. Share code functionality
6. Increase Gemini Memory for better communication
7. Use Google Drive API to add and use multiple files together
