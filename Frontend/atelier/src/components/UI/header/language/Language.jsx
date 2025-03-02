import React from 'react';
import mcss from './Language.module.css';

export default function Language() {
    return (
        <div className={mcss.lang_box}>
            <a href="/" title="Language" className={"nav-link"} data-toggle="dropdown" aria-expanded="true">
                <img src="images/flag-uk.png" alt="flag" className={"mr-2"} title="United Kingdom" />
                    English
                <i className="fa fa-angle-down ml-2" aria-hidden="true"></i>
            </a>
            <div className={"dropdown-menu"}>
                <a href="/" className={"dropdown-item"}>
                    <img src="images/flag-france.png" className={"mr-2"} alt="flag" />
                    French
                </a>
            </div>
        </div>
    )
};