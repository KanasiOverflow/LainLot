import React from 'react';
import Copyright from './copyright/Copyright';
import Footbar from './footbar/Footbar';
import './Footer.module.css';

export default function Footer() {
  return (
    <div>
      <Footbar />
      <Copyright />
    </div>
  );
}
