import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode; // Content of the page
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // Exclude the header for the login page
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Header title="FLIP IT" />}
      <main>{children}</main>
    </>
  );
};

export default Layout;