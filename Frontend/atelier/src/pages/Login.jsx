import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();

  return (
    <div className="login-container">
      <h2 className="login-title">{t('Authorization')}</h2>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="email">{t('Email')}</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder={t('EnterEmail')}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">{t('Password')}</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder={t('EnterPassword')}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {t('Login')}
        </button>
        <div className="login-links">
          <a href="/forgot-password" className="forgot-password">
            {t('ForgotYourPassword')}
          </a>
          <a href="/register" className="register-link">
            {t('Registration')}
          </a>
        </div>
      </form>
    </div>
  );
}
