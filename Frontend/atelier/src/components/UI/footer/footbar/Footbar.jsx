import React from 'react';
import mcss from './Footbar.module.css';

export default function Footbar() {
    return (
        <div className={mcss.footerSection + ' ' + mcss.layoutPadding}>
            <div className={"container"}>
                <div className={mcss.footerLogo}>
                    <a href="/">
                        <img src="/images/lainlot_footer_logo.png" alt="Footer Logo" />
                    </a>
                </div>
                <div className={mcss.footerMenu}>
                    <ul>
                        <li><a href="/Home">Home</a></li>
                        <li><a href="/Contacts">Contacts</a></li>
                        <li><a href="/About">About</a></li>
                    </ul>
                </div>
                <div className={mcss.locationMain}>
                    Help Line Number: <a href="tel:+1180012001200">+1 1800 1200 1200</a>
                </div>
            </div>
        </div>
    )
};
