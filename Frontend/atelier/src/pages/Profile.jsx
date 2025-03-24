import React, { useContext, useEffect, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../provider/context/AuthProvider.jsx';
import { getUserInfo } from '../utils/getUserInfo.js';
import { useFetching } from '../hooks/useFetching.jsx';
import Loader from '../components/UI/loader/Loader.jsx';

export default function Profile() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const { setIsAuth, setloggedOut } = useContext(AuthContext);

  const token = secureLocalStorage.getItem('token');

  const [fetchUserInfo, isLoading, error] = useFetching(async () => {
    const response = await getUserInfo(token);
    setUser(response.data);
  });

  useEffect(() => {
    if (token) {
      fetchUserInfo();
    }
    // eslint-disable-next-line
  }, [token]);

  const logout = () => {
    secureLocalStorage.clear();
    setloggedOut(true);
    setIsAuth(false);
  };

  return (
    <div>
      <div>
        <h3>{t('Profile')}</h3>
      </div>
      <div>
        {isLoading && <Loader />}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {user && (
          <div>
            <p><strong>{t('Email')}:</strong> {user.email}</p>
          </div>
        )}
      </div>
      <div>
        <button onClick={logout}>
          {t('LogOut')}
        </button>
      </div>
    </div>
  );
}
