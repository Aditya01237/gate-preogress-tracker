// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-u4DVrEwU7yw1w1ZTMPQVj37jQ6ZgwtI",
  authDomain: "gate-progress-tracker.firebaseapp.com",
  projectId: "gate-progress-tracker",
  storageBucket: "gate-progress-tracker.appspot.com",
  messagingSenderId: "830510690098",
  appId: "1:830510690098:web:f7f26a9ed2d1ead119b12b",
  measurementId: "G-83L6L5HYMW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const firestore = getFirestore(app);

const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .catch(error => {
            console.error("Error signing in with Google: ", error);
        });
};

export { auth, provider, firestore , signInWithGoogle};
