import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Message } from '../../types';
import './ChatPage.scss';

interface ChatPageProps {
  messages: Message[];
  onNewMessage: (query: string) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ messages, onNewMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onNewMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="deepseek-chat-container">
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message DeepSeek"
            className="chat-input"
          />
          <button 
            className="send-button"
            disabled={!inputValue.trim()}
            onClick={() => {
              if (inputValue.trim()) {
                onNewMessage(inputValue);
                setInputValue('');
              }
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;