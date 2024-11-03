import React, { useContext, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';
import GeneralInput from '../components/UI/input/GeneralInput';
import GeneralButton from '../components/UI/button/GeneralButton';
import CheckCredentialsService from 'api/CheckCredentialsService';
import { AuthContext } from '../provider/context/AuthProvider';

export default function Login() {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState(false);

    const { setIsAuth } = useContext(AuthContext);
    const auth = async event => {
        event.preventDefault();

        var response = await CheckCredentialsService.CheckCredentials(login, password);

        if (response) {
            if (response.data === "Connected!") {
                setIsAuth(true);
                secureLocalStorage.setItem('auth', 'true');
                secureLocalStorage.setItem('login', login);
                secureLocalStorage.setItem('password',  password);
            }
            else {
                console.log("Wrong credentials!");
            }
        }
        else {
            setAuthError(true);
        }

        setLogin('');
        setPassword('');       
    };

    return (
        <div>
            <h1>Login page</h1>
            <form onSubmit={auth}>
                <GeneralInput
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                    type='login'
                    placeholder='login'
                    required
                />
                <GeneralInput
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type='password'
                    placeholder='password'
                    required
                />
                <GeneralButton>Sign in</GeneralButton>
            </form>
            {authError &&
                <h4>Wrong Credentials!</h4>
            }
        </div>
    );
};