import { useEffect, useState } from "react";
import secureLocalStorage from 'react-secure-storage';
import { BrowserRouter } from "react-router-dom";
import Navbar from './components/UI/navbar/Navbar';
import './styles/App.css';
import AppRouter from './components/AppRouter';
import { AuthContext } from './context';
import { ModalProvider } from "./context/ModalContext";

// rsc - create template component

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (secureLocalStorage.getItem('auth')) {
      setIsAuth(true);
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuth, setIsAuth, isLoading
    }}>
      <ModalProvider>
        <BrowserRouter>
          <Navbar />
          <AppRouter />
        </BrowserRouter>
      </ModalProvider>
    </AuthContext.Provider>
  );
};

export default App;