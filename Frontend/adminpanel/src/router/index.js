import About from "../pages/About";
import Error from "../pages/Error";
import Login from "../pages/Login";
import RecordIdPage from "../pages/RecordIdPage";
import Records from "../pages/Records";

export const privateRoutes = [
    {path: '/about', component: <About/>},
    {path: '/records', component: <Records />},
    {path: '/records/:table/:id', component: <RecordIdPage />},
    {path: '/error', component: <Error />}
];

export const publicRoutes = [
    {path: '/login', component: <Login/>}
];