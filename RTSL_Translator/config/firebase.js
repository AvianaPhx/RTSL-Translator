import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

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

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const firestore = getFirestore(app);

// Export the services for use elsewhere in your app
export { auth, firestore };
