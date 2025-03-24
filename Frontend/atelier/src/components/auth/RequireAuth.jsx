import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../provider/context/AuthProvider.jsx';

export default function RequireAuth({ children }) {
    const { isAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuth && location.pathname === '/profile') {
            navigate('/login', { replace: true });
        }
    }, [isAuth, navigate, location]);

    return isAuth ? children : null;
}
