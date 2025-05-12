import React from 'react';
import './Popup.scss';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="popup-close" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Popup;