import Header from './components/UI/header/Header.jsx';
import AppRouter from './app/router/AppRouter.jsx';
import Footer from './components/UI/footer/Footer.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './app/providers/AppProvider.jsx';
import { Helmet } from 'react-helmet';
import './shared/styles/App.css';
// rfc - create template component

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Helmet>
          <title>{import.meta.env.VITE_WEBSITE_NAME ?? 'LainLot - Atelier'}</title>
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