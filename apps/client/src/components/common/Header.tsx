import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa'; // Import the sign-out icon
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { Utils } from '../../config/utils';
import { auth } from '../../firebaseConfig';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const userName = Utils.getUsernameFromLocalStorage() || 'Guest'; // Get the username from local storage or default to 'Guest'

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

  return (
    <header className="header">
      <div className="header-content">
        <img
          src="/public/logo.png"
          alt="Logo"
          className="header-logo"
        />
        <h1 className="header-title">{title}</h1>
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