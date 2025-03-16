import Profile from '../pages/Profile.jsx';
import About from '../pages/About.jsx';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Contacts from '../pages/Contacts.jsx';
import Cart from '../pages/Cart.jsx';

export const privateRoutes = [{ path: '/profile', component: <Profile /> }];

export const publicRoutes = [
  { path: '/about', component: <About /> },
  { path: '/home', component: <Home /> },
  { path: '/login', component: <Login /> },
  { path: '/contacts', component: <Contacts /> },
  { path: '/cart', component: <Cart /> },
];
