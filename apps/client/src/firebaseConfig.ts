import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCWhKwPPhSvegEcExm44QBA7pEZCUitBRM",
    authDomain: "convene-76a5c.firebaseapp.com",
    projectId: "convene-76a5c",
    storageBucket: "convene-76a5c.firebasestorage.app",
    messagingSenderId: "364956488988",
    appId: "1:364956488988:web:98c2d1b65292a20838d6d9",
    measurementId: "G-DDEFZK6S7B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);