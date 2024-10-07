import { useContext } from 'react';
import cl from './GeneralModal.module.css';
import { ModalContext } from '../../../provider/context/ModalProvider';

export default function GeneralModal({ children }) {
  const {
    modal, setModal
  } = useContext(ModalContext);

  const rootClasses = [cl.generalModal];
  if (modal) {
    rootClasses.push(cl.active);
  }

  return (
    <div className={rootClasses.join(' ')} onClick={() => setModal(false)}>
      <div className={cl.generalModalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};