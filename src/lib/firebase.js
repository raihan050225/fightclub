import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
   apiKey: "AIzaSyCZUhI9eytKEWctk4RvYtihh796kyad1q0",
  authDomain: "fightclub-efe82.firebaseapp.com",
  projectId: "fightclub-efe82",
  storageBucket: "fightclub-efe82.firebasestorage.app",
  messagingSenderId: "1074595110984",
  appId: "1:1074595110984:web:19535b30b7c8a0d349b87d",
  measurementId: "G-G9JSM7Y7WB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;