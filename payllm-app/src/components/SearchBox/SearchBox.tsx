import React, { useState, KeyboardEvent } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { convertSolToLamports } from '../../utils/converstion';
import './SearchBox.scss';

interface ModelOption {
  id: string;
  name: string;
  placeholder: string;
}

const modelOptions: ModelOption[] = [
  { id: 'default', name: 'Default', placeholder: 'Ask general text queries' },
  { id: 'veo2', name: 'Veo2', placeholder: 'Generate videos or Describe about your video' },
  { id: 'claude', name: 'Claude Sonnet', placeholder: 'Generate indepth responses' },
];

interface SearchBoxProps {
  onSearch: (query: string, model: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const { connection } = useConnection();
  const [query, setQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelOption>(modelOptions[0]);
  const { publicKey, sendTransaction, connected } = useWallet();

  const requestSol = async (publicKey: PublicKey) => {
      const recipient = new PublicKey('DTrXdM5a3X4dcSZRGF18Q1f1kLa8eoYThiFeV4uu5nwQ');
      const lamports = convertSolToLamports(0.01);

    const instructions = [
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipient,
        lamports,
      }),
    ];

    let latestBlockhash = await connection.getLatestBlockhash()
    const messageLegacy = new TransactionMessage({
      payerKey: publicKey,
      recentBlockhash: latestBlockhash.blockhash,
      instructions,
    }).compileToLegacyMessage();

    const transation = new VersionedTransaction(messageLegacy)
    const signature = await sendTransaction(transation, connection);
    await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');
    console.log(signature);

  }

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    try {
      if (e.key === 'Enter' && query.trim()) {
        if (!connected || !publicKey) {
          alert('Please connect your wallet.');
          return;
        }
        await requestSol(publicKey)
        onSearch(query, selectedModel.id);
      }
    } catch (err) {
      console.error('Transaction failed:', err);
      alert('Transaction failed. Please try again.');
    }
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <div className="model-badge">
          <select
            value={selectedModel.id}
            onChange={(e) => {
              const model = modelOptions.find((m) => m.id === e.target.value);
              if (model) setSelectedModel(model);
            }}
          >
            {modelOptions.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedModel.placeholder}
          className="search-input"
        />
      </div>

      <div className="search-options">
        <span className="search-option">Depth Search</span>
        <span className="search-option">Video Generation</span>
      </div>
    </div>
  );
};

export default SearchBox;
