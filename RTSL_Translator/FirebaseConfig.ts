// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import ReactNativeAsyncStorage  from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoTMSMiqmqhDbydLbM2JPrgvhYSlGEzFU",
  authDomain: "rtsl-translator.firebaseapp.com",
  databaseURL: "https://rtsl-translator-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rtsl-translator",
  storageBucket: "rtsl-translator.firebasestorage.app",
  messagingSenderId: "383173419641",
  appId: "1:383173419641:web:8b6f29bc9d830ccc94aaa8",
  measurementId: "G-2X0B4CYE2C"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app , { persistence: getReactNativePersistence(ReactNativeAsyncStorage)});
const analytics = getAnalytics(app);