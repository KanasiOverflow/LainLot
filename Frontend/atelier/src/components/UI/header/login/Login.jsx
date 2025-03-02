import React from 'react';
import mcss from './Login.module.css';

export default function Login() {
    return (
        <div className={mcss.loginMenu}>
            <ul>
                <li><a href="/">
                    <i className={"fa fa-shopping-cart"} aria-hidden="true"></i>
                    <span className={mcss.padding10}>Cart</span></a>
                </li>
                <li><a href="/">
                    <i className={"fa fa-user"} aria-hidden="true"></i>
                    <span className={mcss.padding10}>Cart</span></a>
                </li>
            </ul>
        </div>
    )
};