import React, { useState } from 'react';
import SearchBox from './components/SearchBox/SearchBox.tsx';
import ChatPage from './components/chatPage/ChatPage.tsx';
import WelcomeMessage from './components/WelcomeMessage/WelcomeMessage.tsx';
import { SolanaProvider } from './utils/SolanaProvider.tsx';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import './styles/App.scss';
import '@solana/wallet-adapter-react-ui/styles.css';

interface HandleSearchProps { query: string, modelType: string, walletAddress: string }

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [modelType, setModelType] = useState('')
  const [walletAddressRef, setWalletAddressRef] = useState<string>('')

  const handleSearch = async ({ query, modelType, walletAddress }: HandleSearchProps) => {
    setWalletAddressRef(walletAddress as string)
    setSearchQuery(query);
    setModelType(modelType)
    setShowChat(true);
  };

  return (
    <SolanaProvider>
      <div className="app">
        <div className="status-bar">
          <div className="status-bar-content">
            <span className="network-indicator">
              <span className="indicator-dot"></span>
              We are currently live in devnet
            </span>
          </div>
        </div>

        <div className="wallet-container">
          <div className="wallet-button-container">
            <WalletMultiButton className="wallet-button" />
          </div>
        </div>

        {!showChat ? (
          <div className="welcome-container">
            <WelcomeMessage />
            <SearchBox onSearch={handleSearch} />
          </div>
        ) : (
          <ChatPage query={searchQuery} userWalletAddress={walletAddressRef} modelType={modelType} onBack={() => setShowChat(false)} />
        )}
      </div>
    </SolanaProvider>
  );
};

export default App;