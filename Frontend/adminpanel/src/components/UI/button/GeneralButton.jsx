import React from 'react';
import style from './GeneralButton.module.css';

export default function GeneralButton({children, ...props}) {
  return (
    <button {...props} className={style.generalBtn}>
        {children}
    </button>
  );
};