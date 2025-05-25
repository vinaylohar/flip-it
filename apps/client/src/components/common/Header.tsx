import React, { useEffect, useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa'; // Import the sign-out icon
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Header.css';
import { Utils } from '../../config/utils';
import { auth } from '../../firebaseConfig';
import { GameVariationValues, PARAM_VARIATION } from '../../config/constants';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const [searchParams] = useSearchParams();
  const selectedVariation = (searchParams.get(PARAM_VARIATION) as GameVariationValues) || Utils.getDefaultVariation();
  const variationName = Utils.getVariationName(selectedVariation);

  useEffect(() => {
    // Fetch the userName from localStorage
    const storedUserName = localStorage.getItem('username') || 'Guest';
    // const storedUserName = Utils.getUsernameFromLocalStorage() || 'Guest';
    setUserName(storedUserName);
  }, []);

  const handleSignOut = () => {
    const confirmSignOut = window.confirm('Are you sure you want to sign out?');
    if (confirmSignOut) {
      Utils.clearUserSessionFromLocalStorage(); // Clear user session from local storage
      navigate('/'); // Navigate to the home screen
      window.location.reload(); // Force a page reload to clear cached state
      window.history.replaceState(null, '', '/'); // Replace the current history state
      // Sign out the user from firebase
      auth.signOut().then(() => {
        console.log('User signed out');
      }).catch((error) => {
        console.error('Error signing out:', error);
      });
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');     // Navigate back to the dashboard
  };

  return (
    <header className="header">
      <div className="header-content">
        <div onClick={handleBackToDashboard} className="header-logo-container">
          <img
            src="/public/logo.png"
            alt="Logo"
            className="header-logo"
          />
          <h1 className="header-title">{title}</h1>
        </div>
        <h2 className="header-variation">{variationName}</h2> {/* Display variation name */}
        <div className="user-info">
          <div className="user-icon">
            {userName.charAt(0).toUpperCase()} {/* Display the first initial */}
          </div>
          <span className="user-name">{userName}</span>
        </div>
        <FaSignOutAlt
          className="signout-icon"
          title="Sign Out"
          onClick={handleSignOut}
        />
      </div>
    </header>
  );
};

export default Header;