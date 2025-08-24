import React, { useEffect } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FcGoogle } from 'react-icons/fc';
import { FaBrain } from 'react-icons/fa';
import { Utils } from '../../config/utils';

const Login: React.FC = () => {
  const navigate = useNavigate();

    useEffect(() => {
  
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // Save the user ID to localStorage
          Utils.setUsernameInLocalStorage(user.displayName || '');
          // Save playerFBId to localStorage
          Utils.setPlayerFBIdInLocalStorage(user.uid);
          // Redirect to the dashboard after login
          navigate('/dashboard'); // Redirect to the game page after login
        } else {
          // If no user is logged in, clear the name and UID
          Utils.clearUserSessionFromLocalStorage();
        }
      });
  
      // Cleanup the subscription on component unmount
      return () => unsubscribe();
    }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  const title = "FLIP IT";

  return (
    <div className="hero-background">
      <div className="content">
        <img className="logo-img" src="/logo.png" alt="Logo" />
        <h1 className="animated-title">
          {title.split('').map((char, index) => (
            <span
              key={index}
              className={`animated-char char-${char === ' ' ? 'space' : char}`}
              style={{ '--char-index': index } as React.CSSProperties} // Pass index as a CSS variable
            >
              {char}
            </span>
          ))}
        </h1>
        <p className="subtitle">
          <FaBrain className="subtitle-icon" /> The Ultimate Memory Challenge
        </p>
        <button className="google-signin-button" onClick={handleGoogleSignIn}>
          <FcGoogle className="google-icon" /> Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;