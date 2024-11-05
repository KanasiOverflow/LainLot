import React from 'react'
import mcss from './DisplayImage.module.css';

export default function DisplayImage({ base64Img, fullSize }) {
    console.log("fullSize: " + fullSize);
    return (
        <div>
            <img className={fullSize === true ? mcss.recordIdPageImg: mcss.recordItemImg} alt="preview" src={base64Img} />
        </div>
    )
};