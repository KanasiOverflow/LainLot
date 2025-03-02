import React from 'react';
import mcss from './Navbar.module.css';

export default function Navbar() {
  return (
    <div className={"container"}>
      <div className={mcss.headerSectionTop}>
        <div className={"row"}>
          <div className={"col-sm-12"}>
            <div className={mcss.customMenu  + ' ' + mcss.hideOnMobile}>
              <ul>
                <li><a href="/Home">Home</a></li>
                <li><a href="/Contacts">Contacts</a></li>
                <li><a href="/About">About</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};