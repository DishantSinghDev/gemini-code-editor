import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBcfTmKknicWuUPJPlpeY5qBXFXoSS4y-k",
  authDomain: "gemini-code-editor.firebaseapp.com",
  projectId: "gemini-code-editor",
  storageBucket: "gemini-code-editor.appspot.com",
  messagingSenderId: "960088162288",
  appId: "1:960088162288:web:2286b078aafb6104df2735",
  measurementId: "G-4S2PWWHKT8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only if it's a browser environment)
if (typeof window !== "undefined") {
  getAnalytics(app);
}

// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();
// Force the user to select an account during sign-in
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.setCustomParameters({   
    prompt: "select_account"
});

export const auth = getAuth(app);
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
