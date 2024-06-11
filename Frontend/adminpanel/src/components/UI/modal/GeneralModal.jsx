import React from 'react';
import cl from './GeneralModal.module.css';

export default function GeneralModal({ children, visible, setVisible }) {

  const rootClasses = [cl.generalModal];
  if (visible) {
    rootClasses.push(cl.active);
  }

  return (
    <div className={rootClasses.join(' ')} onClick={() => setVisible(false)}>
      <div className={cl.generalModalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};