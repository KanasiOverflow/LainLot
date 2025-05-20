import React, { useState } from 'react';
import styles from './CostumeEditor.module.css';

const CostumeEditor = () => {
  const [activeTab, setActiveTab] = useState('Байка');

  const parts = {
    'Байка': ['Капюшон', 'Воротник', 'Центр', 'Рукава', 'Карманы', 'Манжеты', 'Пояс'],
    'Штаны': ['Пояс', 'Карманы', 'Штанины', 'Манжеты']
  };

  return (
    <div className={`container-fluid ${styles.container}`}>
      <div className="row">
        {/* Левая часть — предпросмотр */}
        <div className={`col-12 col-lg-9 ${styles.previewArea}`}>
          <div className="d-flex align-items-center justify-content-center h-100">
            <h5 className="text-center w-100">Область предпросмотра костюма</h5>
          </div>
        </div>

        {/* Правая часть — редактор */}
        <div className={`col-12 col-lg-3 p-3 ${styles.editorPanel}`}>
          <h6 className="mb-3 text-center">Редактор костюма</h6>

          {/* Вкладки */}
          <ul className="nav nav-tabs justify-content-center mb-3">
            {Object.keys(parts).map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>

          {/* Контент вкладки */}
          <div id="editor-menu" className="row g-2">
            {parts[activeTab].map((element, eIdx) => (
              <div className="col-12" key={eIdx}>
                <label className="form-label small mb-1">{element}</label>
                <input type="color" className="form-control form-control-color mb-1 w-100" />
                <div className="d-flex justify-content-between">
                  <button className="btn btn-outline-secondary btn-sm px-2">&larr;</button>
                  <button className="btn btn-outline-secondary btn-sm px-2">&rarr;</button>
                </div>
              </div>
            ))}
          </div>

          {/* Кнопки управления */}
          <div className="mt-4 d-flex justify-content-between">
            <button className="btn btn-outline-warning fw-bold px-4 py-2">Сброс</button>
            <button className="btn btn-outline-warning fw-bold px-4 py-2">Заказать</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostumeEditor;
