import Navbar from './components/UI/navbar/Navbar';
import AppRouter from './components/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './provider/AppProvider';
import { Helmet } from 'react-helmet';
import './styles/App.css';
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
}

export default App;
