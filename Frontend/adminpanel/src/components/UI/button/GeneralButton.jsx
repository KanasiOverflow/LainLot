import React from 'react';
import style from './GeneralButton.module.css';

const GeneralButton = React.memo(({ children, ...props }) => {
  return (
    <button {...props} className={style.generalBtn}>
      {children}
    </button>
  );
});

export default GeneralButton;