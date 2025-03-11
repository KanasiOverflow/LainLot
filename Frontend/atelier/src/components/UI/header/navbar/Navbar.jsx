import React from 'react';
import { useTranslation } from 'react-i18next';
import mcss from './Navbar.module.css';

export default function Navbar() {

  const { t } = useTranslation();

  return (
    <div className={"container"}>
      <div className={mcss.headerSectionTop}>
        <div className={"row"}>
          <div className={"col-sm-12"}>
            <div className={mcss.customMenu + ' ' + mcss.hideOnMobile}>
              <ul>
                <li><a href="/Home">{t('HomeMenuLink')}</a></li>
                <li><a href="/Contacts">{t('ContactsMenuLink')}</a></li>
                <li><a href="/About">{t('AboutMenuLink')}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};