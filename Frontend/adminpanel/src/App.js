import { BrowserRouter } from "react-router-dom";
import Navbar from './components/UI/navbar/Navbar';
import './styles/app.css';
import AppRouter from './components/AppRouter';

import { AppProvider } from "./provider/AppProvider";
import { Helmet } from 'react-helmet';
// rsc - create template component

function App() {
  return (
      <AppProvider>
        <BrowserRouter>
          <Helmet>
            <title>{process.env.REACT_APP_WEBSITE_NAME}</title>
          </Helmet>
          <Navbar />
          <AppRouter />
        </BrowserRouter>
      </AppProvider>
  );
};

export default App;