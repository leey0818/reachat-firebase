// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDKXxEpTiqvCNrKAingoL2Tm430c1M517U',
  authDomain: 'reachat-firebase-c97ce.firebaseapp.com',
  projectId: 'reachat-firebase-c97ce',
  databaseURL: 'https://reachat-firebase-c97ce-default-rtdb.asia-southeast1.firebasedatabase.app',
  storageBucket: 'reachat-firebase-c97ce.appspot.com',
  messagingSenderId: '596379304564',
  appId: '1:596379304564:web:87a79f1820fe30c1cb4721',
  measurementId: 'G-8L7TBBBZL4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Real-time database
getDatabase(app);

// Storage
getStorage(app);

// Google analytics
getAnalytics(app);
