import React, { useContext } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { Link } from "react-router-dom";
import GeneralButton from '../button/GeneralButton';
import { AuthContext } from '../../../context';

export default function Navbar() {

    const {setIsAuth} = useContext(AuthContext);

    const logout = () => {
        setIsAuth(false);
        secureLocalStorage.removeItem('auth');
        secureLocalStorage.removeItem('login');
        secureLocalStorage.removeItem('password');
    };

    return (
        <div className='navbar'>
            <GeneralButton onClick={logout}>
                Sign out
            </GeneralButton>
            <div className='navbar__links'>
                <Link to='/about'>About site</Link>
                <Link to='/records'>Records</Link>
            </div>
        </div>
    );
};