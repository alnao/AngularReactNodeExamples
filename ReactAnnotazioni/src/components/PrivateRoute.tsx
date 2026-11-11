import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAppSelector } from '../app/hooks';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
