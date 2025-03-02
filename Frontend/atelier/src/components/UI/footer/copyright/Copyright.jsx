import React from 'react';
import mcss from './Copyright.module.css';

export default function Copyright() {
    return (
        <div className={mcss.copyrightSection}>
            <div className={"container"}>
                <p className={mcss.copyrightText}>
                    &copy; {new Date().getFullYear()} {process.env.REACT_APP_WEBSITE_NAME}. All rights reserved.
                </p>
            </div>
        </div>
    )
};