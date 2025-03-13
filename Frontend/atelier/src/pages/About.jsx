import React, { useContext, useEffect } from 'react';
import { LanguageContext } from '../provider/context/LanguageContext';

export default function About() {

  const { langId } = useContext(LanguageContext);

  console.log(langId);

  return (
    <div>
      <h1>
        This is Lainlot Atelier - LainLot.com ©
      </h1>
    </div>
  );
};