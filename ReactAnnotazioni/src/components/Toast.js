import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-exclamation-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'info':
        return 'bi-info-circle-fill';
      default:
        return 'bi-info-circle-fill';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#d1e7dd';
      case 'error':
        return '#f8d7da';
      case 'warning':
        return '#fff3cd';
      case 'info':
        return '#cff4fc';
      default:
        return '#cff4fc';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return '#0f5132';
      case 'error':
        return '#842029';
      case 'warning':
        return '#664d03';
      case 'info':
        return '#055160';
      default:
        return '#055160';
    }
  };

  return (
    <div
      className="position-fixed top-0 start-50 translate-middle-x mt-3"
      style={{ zIndex: 9999, minWidth: '350px', maxWidth: '500px' }}
    >
      <div
        className="d-flex align-items-center p-3 shadow-lg rounded-3"
        style={{
          backgroundColor: getBackgroundColor(),
          color: getTextColor(),
          border: `1px solid ${getTextColor()}33`,
          animation: 'slideDown 0.3s ease-out'
        }}
      >
        <i className={`bi ${getIcon()} me-3`} style={{ fontSize: '1.5rem' }}></i>
        <div className="flex-grow-1 me-2">
          {message}
        </div>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
          style={{ opacity: 0.8 }}
        ></button>
      </div>
      <style>{`
        @keyframes slideDown {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
