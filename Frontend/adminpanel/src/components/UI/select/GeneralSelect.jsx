import React from 'react';
import style from './GeneralSelect.module.css';

export default function GeneralSelect({ options, defaultValue, value, onChange }) {
    return (
        <select
            className={style.generalSelect}
            value={value}
            onChange={e => onChange(e.target.value)}
        >
            <option disabled value=''>{defaultValue}</option>
            {options.map(option =>
                <option key={option.value} value={option.value}>
                    {option.name}
                </option>
            )}
        </select>
    );
};