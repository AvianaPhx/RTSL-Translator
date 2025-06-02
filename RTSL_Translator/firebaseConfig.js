import { initializeApp, getApps } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBoTMSMiqmqhDbydLbM2JPrgvhYSlGEzFU",
  authDomain: "rtsl-translator.firebaseapp.com",
  databaseURL: "https://rtsl-translator-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rtsl-translator",
  storageBucket: "rtsl-translator.firebasestorage.app",
  messagingSenderId: "383173419641",
  appId: "1:383173419641:web:0815bf81fdb5f85994aaa8",
  measurementId: "G-2LSKS9R29F"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
