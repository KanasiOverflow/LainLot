import React from 'react';
import style from './GeneralInput.module.css'

export default function GeneralInput(props) {
  return (
    <input className={style.generalInput} {...props}/>
  );
};