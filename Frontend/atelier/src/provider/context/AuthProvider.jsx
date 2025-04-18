import { createContext, useState, useEffect } from 'react';
import secureLocalStorage from 'react-secure-storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loggedOut, setloggedOut] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (secureLocalStorage.getItem('auth')) {
      setIsAuth(true);
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        setIsAuth,
        isLoading,
        loggedOut,
        setloggedOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
