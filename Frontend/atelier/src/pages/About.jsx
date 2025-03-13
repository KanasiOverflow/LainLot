import React, { useContext } from 'react';
import { LanguageContext  } from '../provider/context/LanguageContext';

export default function About() {

  const { langId, isLangLoading, langError } = useContext(LanguageContext);

  console.log(langId);

  return (
    <div>
      <h1>
        This is Lainlot Atelier - LainLot.com ©
      </h1>
    </div>
  );
};