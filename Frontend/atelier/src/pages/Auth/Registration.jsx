import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Registration() {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className='login-title'>{t('Registration')}</h2>
      <form>
        <div className='form-group'>
          <label htmlFor='email'>{t('Email')}</label>
          <input
            type='email'
            id='email'
            className='form-control'
            placeholder={t('EnterEmail')}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>{t('Password')}</label>
          <input
            type='password'
            id='password'
            className='form-control'
            placeholder={t('EnterPassword')}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>{t('RepeatPassword')}</label>
          <input
            type='password'
            id='password'
            className='form-control'
            placeholder={t('RepeatPassword')}
            required
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          {t('Registration')}
        </button>
        <button type='submit' className='btn btn-primary'>
          {t('ClearFields')}
        </button>
      </form>
    </div>
  );
}
