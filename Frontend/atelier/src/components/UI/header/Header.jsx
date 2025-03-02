import React from 'react';
import Navbar from './navbar/Navbar';
import Logo from './logo/Logo';
import Sidebar from './sidebar/Sidebar';
import Dropdown from './dropdown/Dropdown';
import Search from './search/Search';
import Language from './language/Language';
import Login from './login/Login';
import Slider from './slider/Slider';
import mcss from './Header.module.css';

export default function Header() {
    return (
        <div className={"banner_bg_main"}>
            <Navbar />
            <Logo />
            <div className={mcss.headerSection}>
                <div className={"container"}>
                    <div className={mcss.containtMain}>
                        <Sidebar />
                        <Dropdown />
                        <Search />
                        <div className={"header_box"}>
                            <Language />
                            <Login />
                        </div>
                    </div>
                </div>
            </div>
            <Slider />
        </div>
    )
};