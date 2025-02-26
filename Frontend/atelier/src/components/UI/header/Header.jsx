import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import mcss from './Header.module.css';

export default function Header() {
    return (
        <div className={mcss.headerSection}>
            <div className={"container"}>
                <div className={mcss.containtMain}>
                    <Sidebar />
                    <Navbar />
                </div>
            </div>
        </div>
    );
}