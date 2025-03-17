import Header from './components/UI/header/Header.jsx';
import AppRouter from './components/AppRouter.jsx';
import Footer from './components/UI/footer/Footer.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './provider/AppProvider.jsx';
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
}

export default App;
