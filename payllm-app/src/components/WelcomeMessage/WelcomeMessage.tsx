import React from 'react';
import './WelcomeMessage.scss';

const WelcomeMessage: React.FC = () => {
  return (
    <div className="welcome-message">
      <h2>Hi, I'm PayLLM.</h2>
      <p>How can I help you today?</p>
    </div>
  );
};

export default WelcomeMessage;