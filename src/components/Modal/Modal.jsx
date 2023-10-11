import React, { useEffect } from 'react';
import styles from '../styles.module.css';

const Modal = props => {
  const { largeImageURL, alt, onClose } = props;

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleClose = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.Overlay} onClick={handleClose}>
      <div className={styles.Modal}>
        <img src={largeImageURL} alt={alt} />
      </div>
    </div>
  );
};

export default Modal;
