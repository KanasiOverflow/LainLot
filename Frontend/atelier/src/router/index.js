import Profile from '../pages/Profile';
import About from '../pages/About';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Contacts from '../pages/Contacts';
import Cart from '../pages/Cart';

export const privateRoutes = [{ path: '/profile', component: <Profile /> }];

export const publicRoutes = [
  { path: '/about', component: <About /> },
  { path: '/home', component: <Home /> },
  { path: '/login', component: <Login /> },
  { path: '/contacts', component: <Contacts /> },
  { path: '/cart', component: <Cart /> },
];
