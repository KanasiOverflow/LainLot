import React from 'react';
import Copyright from './copyright/Copyright.js';
import Footbar from './footbar/Footbar.js';
import './Footer.module.css';

export default function Footer() {
  return (
    <div>
      <Footbar />
      <Copyright />
    </div>
  );
}
