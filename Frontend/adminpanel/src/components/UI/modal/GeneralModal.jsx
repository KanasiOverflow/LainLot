import { useContext } from 'react';
import { ModalContext } from '../../../provider/context/ModalProvider';
import mcss from './GeneralModal.module.css';

export default function GeneralModal({ children }) {
  const {
    modal, setModal
  } = useContext(ModalContext);

  const rootClasses = [mcss.generalModal];
  if (modal) {
    rootClasses.push(mcss.active);
  }

  return (
    <div className={rootClasses.join(' ')} onClick={() => setModal(false)}>
      <div className={mcss.generalModalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};