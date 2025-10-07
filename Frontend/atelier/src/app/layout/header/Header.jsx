import React from 'react';
import Navbar from '../../components/UI/header/navbar/Navbar.jsx';
import Logo from '../../components/UI/header/logo/Logo.jsx';
import Sidebar from '../../components/UI/header/sidebar/Sidebar.jsx';
import Dropdown from './dropdown/Dropdown.jsx';
import Search from '../../components/UI/header/search/Search.jsx';
import Language from '../../components/UI/header/language/Language.jsx';
import Login from '../../components/UI/header/login/Login.jsx';
import Slider from './slider/Slider.jsx';
import mcss from './Header.module.css';

export default function Header() {
  return (
    <div className="banner_bg_main">
      <Navbar />
      <Logo />
      <div className={mcss.headerSection}>
        <div className="container">
          <div className={mcss.containtMain}>
            <Sidebar />
            <Dropdown />
            <Search />
            <div className="header_box">
              <Language />
              <Login />
            </div>
          </div>
        </div>
      </div>
      <Slider />
    </div>
  );
}
