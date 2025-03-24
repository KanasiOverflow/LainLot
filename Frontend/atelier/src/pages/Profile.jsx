import React, { useContext, useEffect } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../provider/context/AuthProvider.jsx';

export default function Profile() {
  const { t } = useTranslation();
  const { setIsAuth, setJustLoggedOut } = useContext(AuthContext);

  const logout = () => {
    secureLocalStorage.clear();
    setJustLoggedOut(true);
    setIsAuth(false);
  };

  return (
    <div>
      <div>
        <h3>{t('Profile')}</h3>
      </div>
      <div>
        <h4>
          Content
        </h4>
      </div>
      <div>
        <button onClick={logout}>
          {t('LogOut')}
        </button>
      </div>
    </div>
  );
}
