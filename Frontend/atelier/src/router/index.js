import About from "../pages/About";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ClientPage from "../pages/ClientPage";

export const privateRoutes = [
    {path: '/clientpage', component: <ClientPage/>}
];

export const publicRoutes = [
    {path: '/about', component: <About/>},
    {path: '/home', component: <Home/>},
    {path: '/login', component: <Login/>}
];