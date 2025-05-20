import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CostumeEditor.module.css';

const CostumeEditor = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Sweatshirt');

  const parts = {
    'Sweatshirt': ['Hood', 'Collar', 'Center', 'Sleeves', 'Pockets', 'Cuffs', 'Hem'],
    'Pants': ['Waistband', 'Pockets', 'Legs', 'Cuffs']
  };

  return (
    <div className={`container-fluid ${styles.container}`}>
      <div className="row">
        <div className={`col-12 col-lg-9 ${styles.previewArea}`}>
          <div className="d-flex align-items-center justify-content-center h-100">



          </div>
        </div>

        <div className={`col-12 col-lg-3 p-3 ${styles.editorPanel}`}>
          <ul className="nav nav-tabs justify-content-center mb-3">
            {Object.keys(parts).map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {t(tab)}
                </button>
              </li>
            ))}
          </ul>

          <div id="editor-menu" className="row g-2">
            {parts[activeTab].map((element, eIdx) => (
              <div className="col-12" key={eIdx}>
                <label className="form-label small mb-1">{t(element)}</label>
                <input type="color" className="form-control form-control-color mb-1 w-100" />
                <div className="d-flex justify-content-between">
                  <button className="btn btn-outline-secondary btn-sm px-2">&larr;</button>
                  <button className="btn btn-outline-secondary btn-sm px-2">&rarr;</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 d-flex justify-content-between">
            <button className="btn btn-outline-warning fw-bold px-4 py-2">{t('Reset')}</button>
            <button className="btn btn-outline-warning fw-bold px-4 py-2">{t('Order')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostumeEditor;
