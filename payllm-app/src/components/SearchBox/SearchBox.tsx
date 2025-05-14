import React, { useState, KeyboardEvent, useRef } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { convertSolToLamports, getSolFee } from '../../utils/helper';
import { modelOptions, SOL_ADMIN_RECEIVER_ADDRESS, MESSAGE_CHAR_LIMITS } from '../../common/constants';
import { ModelOption } from '../../common/types';
import './SearchBox.scss';
import Popup from '../Popup/Popup';
import TypingLoader from '../TypingLoader/TypingLoader';

interface SearchBoxProps {
  onSearch: ({ query, modelType }: { query: string, modelType: string }) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const { connection } = useConnection();
  const [query, setQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelOption>(modelOptions[0]);
  const [showPopup, setShowPopup] = useState(false);
  const [signature, setSignature] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey, sendTransaction, connected } = useWallet();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const requestSol = async (publicKey: PublicKey) => {
    const recipient = new PublicKey(SOL_ADMIN_RECEIVER_ADDRESS);
    const sol_fee = getSolFee()
    const lamports = convertSolToLamports(sol_fee);

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
    setSignature(signature);
    setShowPopup(true);
  }

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    try {
      if (e.key === 'Enter' && e.shiftKey) {
        return;
      }

      if (e.key === 'Enter' && query.trim() && !e.shiftKey) {
        e.preventDefault();

        const charLimit = selectedModel.id === 'default' ? MESSAGE_CHAR_LIMITS.DEFAULT : MESSAGE_CHAR_LIMITS.OTHER;
        if (query.length > charLimit) {
          alert(`Message exceeds ${charLimit} character limit`);
          return;
        }

        setIsLoading(true);

        setTimeout(() => {
          try {
            if (!connected || !publicKey) {
              alert('Please connect your wallet.');
              return;
            }
            // TODO - uncomment
            // await requestSol(publicKey)
            localStorage.setItem('payllm-user-wallet-address', publicKey.toString())
            onSearch({ query, modelType: selectedModel.id });
          } catch (error) {
            console.error('Transaction failed:', error);
            alert('Transaction failed. Please try again.');
          } finally {
            setIsLoading(false);
          }
        }, 1500);
      }
    } catch (err) {
      console.error('Transaction failed:', err);
      alert('Transaction failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    setQuery(textarea.value);
    
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
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

        <textarea
          ref={textareaRef}
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={selectedModel.placeholder}
          className="search-input"
          rows={1}
          maxLength={selectedModel.id === 'default' ? MESSAGE_CHAR_LIMITS.DEFAULT : MESSAGE_CHAR_LIMITS.OTHER}
        />

        {isLoading && <TypingLoader />}
      </div>

      <div className="search-options">
        <span className="search-option">Depth Search</span>
        <span className="search-option">Video Generation</span>
      </div>

      <Popup isOpen={showPopup} onClose={() => setShowPopup(false)}>
        <h3>Transaction Successful</h3>
        <p>Signature: {signature}</p>
        <p>View on explorer: 
          <a 
            href={`https://explorer.solana.com/tx/${signature}`} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#6e48aa', marginLeft: '0.5rem' }}
          >
            Open Explorer
          </a>
        </p>
      </Popup>
    </div>
  );
};

export default SearchBox;
