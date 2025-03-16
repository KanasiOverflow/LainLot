import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AboutPageService from 'api/Atelier/AboutPageService';
import { useFetching } from '../hooks/useFetching';
import Loader from "../components/UI/loader/Loader";

export default function About() {
  const { i18n } = useTranslation();
  const [aboutTexts, setAboutTexts] = useState([]);

  const [fetchAbout, isLoading, error] = useFetching(async () => {
    const response = await AboutPageService.GetAbout(i18n.language);
    if (response && Array.isArray(response.data)) {
      setAboutTexts(response.data);
    }
  });

  useEffect(() => {
    fetchAbout();
    // eslint-disable-next-line
  }, [i18n.language]);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoading ? (
        <Loader />
      ) : (
        <ul>
          {aboutTexts.map((item) => (
            <li key={item.id}>
              <h3>{item.header}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
};