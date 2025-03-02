import React, { useState } from 'react';
import mcss from './Sidebar.module.css';

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const openNav = () => setIsSidebarOpen(true);
    const closeNav = () => setIsSidebarOpen(false);

    return (
        <>
            <div
                id="Sidebar"
                className={`${mcss.sidenav} ${isSidebarOpen ? mcss.sidenavOpen : mcss.sidenavClose}`}
            >
                <button className={mcss.closebtn} onClick={closeNav}>
                    &times;
                </button>
                <a href="/Home">Home</a>
                <a href="/Contacts">Contacts</a>
                <a href="/About">About</a>
            </div>

            {!isSidebarOpen && (
                <span className={mcss.toggle_icon} onClick={openNav}>
                    <img src="/images/toggle-icon.png" alt="Toggle Sidebar" />
                </span>
            )}
        </>
    )
};