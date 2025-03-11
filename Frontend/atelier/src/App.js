import Header from './components/UI/header/Header';
import AppRouter from './components/AppRouter';
import Footer from './components/UI/footer/Footer';
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./provider/AppProvider";
import { Helmet } from 'react-helmet';
import './styles/App.css';
// rfc - create template component

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Helmet>
          <title>{process.env.REACT_APP_WEBSITE_NAME}</title>
        </Helmet>
        <div className="appWrapper">
          <Header />
          <main className="contentWrapper">
            <AppRouter />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;