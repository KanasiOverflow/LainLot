import React from 'react';
import mcss from './Menu.module.css';

export default function Menu() {
  return (
    <nav className={"container"}>
      <div className={mcss.headerSectionTop}>
        <div className={"row"}>
          <div className={"col-sm-12"}>
            <div className={`${mcss.customMenu} ${mcss.hideOnMobile}`}>
              <ul>
                <li><a href="/best-sellers">Best Sellers</a></li>
                <li><a href="/gift-ideas">Gift Ideas</a></li>
                <li><a href="/new-releases">New Releases</a></li>
                <li><a href="/todays-deals">Today's Deals</a></li>
                <li><a href="/customer-service">Customer Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
};