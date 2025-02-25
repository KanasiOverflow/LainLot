import React from 'react';
import mcss from './Footbar.module.css';

export default function Footbar() {
    return (
        <div className={mcss.footerSection + ' ' + mcss.layoutPadding}>
            <div className={mcss.container}>
                <div className={mcss.footerLogo}>
                    <a href="/">
                        <img src="/images/footer-logo.png" alt="Footer Logo" />
                    </a>
                </div>
                <div className={mcss.footerMenu}>
                    <ul>
                        <li><a href="/best-sellers">Best Sellers</a></li>
                        <li><a href="/gift-ideas">Gift Ideas</a></li>
                        <li><a href="/new-releases">New Releases</a></li>
                        <li><a href="/todays-deals">Today's Deals</a></li>
                        <li><a href="/customer-service">Customer Service</a></li>
                    </ul>
                </div>
                <div className={mcss.locationMain}>
                    Help Line Number: <a href="tel:+1180012001200">+1 1800 1200 1200</a>
                </div>
            </div>
        </div>
    );
};
