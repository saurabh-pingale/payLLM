import React, { useState } from 'react';
import SearchBox from './components/SearchBox/SearchBox.tsx';
import ChatPage from './components/chatPage/ChatPage.tsx';
import WelcomeMessage from './components/WelcomeMessage/WelcomeMessage.tsx';
import { Message } from './types.js';
import './styles/App.scss';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setMessages(prev => [
      ...prev,
      { id: Date.now(), text: query, sender: 'user' },
      { id: Date.now() + 1, text: `I'm DeepSeek. How can I help you with "${query}"?`, sender: 'ai' }
    ]);
    setShowChat(true);
  };

  return (
    <div className="app">
      {!showChat ? (
        <div className="welcome-container">
          <WelcomeMessage />
          <SearchBox onSearch={handleSearch} />
        </div>
      ) : (
        <ChatPage messages={messages} onNewMessage={handleSearch} />
      )}
    </div>
  );
};

export default App;