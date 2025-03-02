import React from 'react';

export default function Dropdown() {
    return (
        <div className={"dropdown"}>
            <button className={"btn btn-secondary dropdown-toggle"}
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
            >
                All Category
            </button>
            <div className={"dropdown-menu"} aria-labelledby="dropdownMenuButton">
                <a className={"dropdown-item"} href="/home">Action</a>
                <a className={"dropdown-item"} href="/home">Another action</a>
                <a className={"dropdown-item"} href="/home">Something else here</a>
            </div>
        </div>
    )
};