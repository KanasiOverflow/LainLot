import React from 'react';
import mcss from './Search.module.css';

export default function Search() {
    return (
        <div className={mcss.main}>
            <div className={"input-group"}>
                <input type="text" className={"form-control"} placeholder="Search this blog" />
                <div className={"input-group-append"}>
                    <button 
                        className={"btn btn-secondary btn-search"} 
                        type="button"
                    >
                        <i className={"fa fa-search"}></i>
                    </button>
                </div>
            </div>
        </div>
    );
}