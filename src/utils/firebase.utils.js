import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration object
console.log(process.env.FIREBASE_API_KEY);
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
// Add scopes for Google Drive
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');
// Force the user to select an account during sign-in
// provider.setCustomParameters({   
//     prompt: "select_account"
// });

export const auth = getAuth(app);

// Function to sign in with Google and return the access token
export const signInWithGooglePopup = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    
    // Get the access token from the result
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    // Optionally, you can also get the user info
    const user = result;

    // Return the access token and user information
    return { accessToken, user };

  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};
