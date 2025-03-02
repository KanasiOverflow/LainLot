import React from 'react';
import mcss from './Language.module.css';

export default function Language() {
    return (
        <div className={mcss.lang_box}>
            <a href="/" title="Language" className={"nav-link"} data-toggle="dropdown" aria-expanded="true">
                <img src="images/uk_16x16.png" alt="flag" className={"mr-2"} title="United Kingdom" />
                English
                <i className="fa fa-angle-down ml-2" aria-hidden="true"></i>
            </a>
            <div className={"dropdown-menu"}>
                <a href="/" className={"dropdown-item"}>
                    <img src="images/russia_16x16.png" className={"mr-2"} alt="flag" />
                    Русский
                </a>
                <a href="/" className={"dropdown-item"}>
                    <img src="images/poland_16x16.png" className={"mr-2"} alt="flag" />
                    Polska
                </a>
            </div>
        </div>
    )
};