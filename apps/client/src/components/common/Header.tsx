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
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    // Fetch the userName from localStorage
    const storedUserName = localStorage.getItem('username') || 'Guest';
    // const storedUserName = Utils.getUsernameFromLocalStorage() || 'Guest';
    setUserName(storedUserName);
  }, []);

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };

  const confirmLogout = () => {
    setShowLogoutPopup(false);
    handleSignOut();
  };

  const handleSignOut = () => {

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
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');     // Navigate back to the dashboard
  };

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div onClick={handleBackToDashboard} className="header-logo-container">
          <img
            src="/flip-it/logo.png"
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
          onClick={handleLogoutClick}
        />
      </div>
      {/* Logout Popup */}
      {showLogoutPopup && (
        <div className="logout-popup">
          <div className="popup-content">
            <p>Are you sure you want to log out?</p>
            <div className="popup-actions">
              <button className="cancel-button" onClick={handleCancelLogout}>
                Cancel
              </button>
              <button className="confirm-button" onClick={confirmLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;