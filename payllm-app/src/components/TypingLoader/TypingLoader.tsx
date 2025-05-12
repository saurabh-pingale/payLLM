import React from 'react';
import './TypingLoader.scss';

const TypingLoader: React.FC = () => {
  return (
    <div className="typing-loader">
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
    </div>
  );
};

export default TypingLoader;