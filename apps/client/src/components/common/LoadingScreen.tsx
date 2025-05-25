import React from 'react';
import './LoadingScreen.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <img src="/public/logo_dark.png" alt="Loading..." className="loading-logo" />
    </div>
  );
};

export default LoadingScreen;