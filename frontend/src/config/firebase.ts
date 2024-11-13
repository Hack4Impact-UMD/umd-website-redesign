// Import the functions you need from the SDKs you need
import { getStorage } from '@firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDU8aP82o2TejkJ7swCqogFFIGctL2MS9M',
  authDomain: 'temp-h4i-redesign.firebaseapp.com',
  projectId: 'temp-h4i-redesign',
  storageBucket: 'temp-h4i-redesign.firebasestorage.app',
  messagingSenderId: '290581962985',
  appId: '1:290581962985:web:0342879ae69fffb2071078',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = initializeFirestore(app, {});
export const auth = getAuth(app);
export const functions = getFunctions(app, 'us-east4');
export const storage = getStorage(app);
export default app;
