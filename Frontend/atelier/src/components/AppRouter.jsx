import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes, privateRoutes } from '../router';
import { AuthContext } from '../provider/context/AuthProvider';
import Loader from './UI/loader/Loader';
import RequireAuth from './auth/RequireAuth';
import Profile from '../pages/Profile';

export default function AppRouter() {
  const { isAuth, isLoading, justLoggedOut } = useContext(AuthContext);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>

      <Route
        path="/profile"
        element={
          isAuth ? (
            <RequireAuth>
              <Profile />
            </RequireAuth>
          ) : justLoggedOut ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {publicRoutes.map((route) => (
        <Route key={route.path}
          path={route.path}
          element={route.component} />
      ))}

      {privateRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={isAuth ? route.component : <Navigate to='/login' replace />}
        />
      ))}

      <Route path='/*' element={<Navigate to='/home' replace />} />

    </Routes>
  );
}
