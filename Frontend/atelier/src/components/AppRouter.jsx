import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes, privateRoutes } from '../router';
import { AuthContext } from '../provider/context/AuthProvider';
import Loader from './UI/loader/Loader';
import Profile from '../pages/Profile';
import Login from '../pages/Auth/Login';
import EmailConfirmed from '../pages/Auth/EmailConfirmed';
import Registration from '../pages/Auth/Registration';
import ForgotPassword from '../pages/Auth/ForgotPassword';

export default function AppRouter() {
  const { isAuth, isLoading, loggedOut } = useContext(AuthContext);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>

      <Route
        path='profile'
        element={
          isAuth ? (<Profile />) :
            (loggedOut ?
              (<Navigate to='/home' replace />) :
              (<Navigate to='/login' replace />)
            )
        }
      />

      <Route
        path='login'
        element={
          isAuth
            ? <Navigate to="/profile" replace />
            : <Login />
        }
      />

      <Route
        path='emailconfirmed'
        element={
          isAuth
            ? <Navigate to="/profile" replace />
            : <EmailConfirmed />
        }
      />

      <Route
        path='registration'
        element={
          isAuth
            ? <Navigate to="/profile" replace />
            : <Registration />
        }
      />

      <Route
        path='forgotpassword'
        element={
          isAuth
            ? <Navigate to="/profile" replace />
            : <ForgotPassword />
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
