import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeeEvf9PpKDPmHEbopBR6g7Hv8WNsRS9s",

  authDomain: "nexuschat-7a7ac.firebaseapp.com",

  projectId: "nexuschat-7a7ac",

  storageBucket: "nexuschat-7a7ac.firebasestorage.app",

  messagingSenderId: "642834882589",

  appId: "1:642834882589:web:0a0a9d6119a5f9a744e6f4",

  measurementId: "G-2VV7HGSBGG",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
