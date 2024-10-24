import React from 'react'
import style from './DisplayImage.module.css';

export default function DisplayImage({ base64Img, fullSize }) {
    console.log("fullSize: " + fullSize);
    return (
        <div>
            <img className={fullSize === true ? style.recordIdPageImg: style.recordItemImg} alt="preview" src={base64Img} />
        </div>
    )
};