// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database'
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDIBZXldOBfkuccLupVWz30v1as-TVG5QI",
    authDomain: "reksti-6bdec.firebaseapp.com",
    databaseURL: "https://reksti-6bdec-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "reksti-6bdec",
    storageBucket: "reksti-6bdec.appspot.com",
    messagingSenderId: "987427771673",
    appId: "1:987427771673:web:9472f18d4b54b597fce188",
    measurementId: "G-1YVY0GCZ4P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
module.exports = { app, database, auth };