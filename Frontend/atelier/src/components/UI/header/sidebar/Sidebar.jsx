import React, { useState } from 'react';
import mcss from './Sidebar.module.css';

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const openNav = () => setIsSidebarOpen(true);
    const closeNav = () => setIsSidebarOpen(false);

    return (
        <>
            {/* Toggle Sidebar Button */}
            {!isSidebarOpen && (
                <span className={mcss.toggle_icon} onClick={openNav}>
                    <img src="/images/toggle-icon.png" alt="Toggle Sidebar" />
                </span>
            )}

            {/* Sidebar */}
            <div
                id="Sidebar"
                className={`${mcss.sidenav} ${isSidebarOpen ? mcss.sidenavOpen : mcss.sidenavClose}`}
            >
                <button className={mcss.closebtn} onClick={closeNav}>
                    &times;
                </button>
                <a href="/index.html">Home</a>
                <a href="/fashion.html">Fashion</a>
                <a href="/electronic.html">Electronic</a>
                <a href="/jewellery.html">Jewellery</a>
            </div>
        </>
    )
};