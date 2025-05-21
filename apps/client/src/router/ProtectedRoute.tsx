import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;

  return <>{children}</>;
};

export default ProtectedRoute;