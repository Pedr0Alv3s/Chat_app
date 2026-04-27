import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 400); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const handleManualClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 400);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
      case 'error':
        return <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
      default:
        return <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
    }
  };

  return (
    <div className={`${styles.toast} ${styles[type]} ${isExiting ? styles.exit : ''}`}>
      <div className={styles.content}>
        <span className={styles.icon}>{getIcon()}</span>
        <span className={styles.message}>{message}</span>
        <button className={styles.closeBtn} onClick={handleManualClose}>✕</button>
      </div>
      <div className={styles.progressBar} style={{ animationDuration: `${duration}ms` }} />
    </div>
  );
};

export default Toast;
