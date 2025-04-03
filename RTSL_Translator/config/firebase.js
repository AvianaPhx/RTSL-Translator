import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, setPersistence, browserLocalPersistence} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getReactNativePersistence } from "firebase/auth";
import { Platform } from "react-native";

// Your Firebase config object
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence depending on the platform
let auth;

if (Platform.OS !== "web") {
  // For React Native (Expo), use AsyncStorage for persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  auth = getAuth(app);  // For web, use the default persistence
}

const db = getFirestore(app);

// Export the services for use elsewhere in your app
export { auth, db };