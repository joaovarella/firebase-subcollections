import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_henPQtmmkYA5gQDzglx0iTuOI071gqg",
  authDomain: "mythic-veld-387421.firebaseapp.com",
  projectId: "mythic-veld-387421",
  storageBucket: "mythic-veld-387421.appspot.com",
  messagingSenderId: "241289931919",
  appId: "1:241289931919:web:89fb47d54b15813a1d54fa",
  measurementId: "G-F5QQYNWK10",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, firebaseConfig };
