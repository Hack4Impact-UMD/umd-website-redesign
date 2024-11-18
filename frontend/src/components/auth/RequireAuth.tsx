import React from 'react';
import { Navigate } from 'react-router-dom';
import Loading from '../loading/Loading';
import { AuthProvider, useAuth } from './AuthProvider';

interface Props {
  children: JSX.Element;
}

const RequireAuth: React.FC<Props> = ({ children }) => {
  const authContext = useAuth();
  if (authContext.loading) {
    return (
      /*  Placeholder for some loading component */
      <div style={{ width: '99vw', height: '99vh' }}>
        <Loading />;
      </div>
    );
  } else if (!authContext.user) {
    return <Navigate to="/admin/login" state={{ redir: window.location.pathname }} />;
  } else if (authContext.token?.claims?.role != 'ADMIN') {
    return (
      <div style={{ width: '99vw', height: '99vh' }}>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return <AuthProvider>{children}</AuthProvider>;
};

export default RequireAuth;
