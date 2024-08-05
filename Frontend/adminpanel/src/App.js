import { BrowserRouter } from "react-router-dom";
import Navbar from './components/UI/navbar/Navbar';
import './styles/App.css';
import AppRouter from './components/AppRouter';

import { AppProvider } from "./provider/AppProvider";

// rsc - create template component

function App() {
  return (
      <AppProvider>
        <BrowserRouter>
          <Navbar />
          <AppRouter />
        </BrowserRouter>
      </AppProvider>
  );
};

export default App;