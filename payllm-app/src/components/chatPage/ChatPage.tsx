import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Message } from '../../types';
import { fetchResource, getSolFee } from '../../utils/helper';
import { record_message_onchain } from '../../common/contract';
import { SOL_ADMIN_RECEIVER_ADDRESS } from '../../common/constants';
import { VideoContent } from '../../common/types';
import TypingLoader from '../TypingLoader/TypingLoader';
import { fetchCredits, manageCredits } from '../../common/api.action';
import './ChatPage.scss';

interface ChatPageProps {
  query: string;
  onNewMessage: ({ query, modelType }: { query: string, modelType: string }) => void;
  modelType: string
}

const ChatPage: React.FC<ChatPageProps> = ({ query, onNewMessage, modelType }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [credits, setCredits] = useState(0)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    getResourcesOnMessage()
    scrollToBottom();
  }, [query]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onNewMessage({ query: inputValue, modelType });
      setInputValue('');
    }
  };

  const handleManageCredits =  async() => {
    const walletAddress = localStorage.getItem('payllm-user-wallet-address') as string
    const data = await fetchCredits(walletAddress as  string)
    setCredits(Number(data?.credits) ? Number(data?.credits) -5 : 0)
    if(Number(data?.credits)){
      const totalCredits = Number(data?.credits) - 5
      await manageCredits(walletAddress, totalCredits)
    }else{
      alert('Not having credits please recharge')
      window.location.reload();
      return
    }
  }

  const getResourcesOnMessage = async () => {
    setMessages(
      [
        { id: Date.now(), text: query, sender: 'user' },
        { id: Date.now() + 1, text: 'Loading', sender: 'ai' }
      ]);

    await handleManageCredits()
    const response = await fetchResource({ modelType, query });
    let aiMessage: Message;
    if (typeof response === 'string') {
      aiMessage = { id: Date.now() + 1, text: response, sender: 'ai' };
    } else if (response && response.type === 'video') {
      aiMessage = { id: Date.now() + 1, text: response, sender: 'ai' };
    } else {
      aiMessage = { id: Date.now() + 1, text: JSON.stringify(response), sender: 'ai' };
    }

    setMessages([
      { id: Date.now(), text: query, sender: 'user' },
      aiMessage
    ]);

    //TODO - uncomment it
    // record_message_onchain({
    //   ai_query: response, 
    //   user_query:query,
    //   ai_model: modelType,
    //   credits:10,
    //   amount: getSolFee(),
    //   receiver: localStorage.getItem('payllm-user-wallet-address') || SOL_ADMIN_RECEIVER_ADDRESS,
    // })
  }

  return (
    <div className="payllm-chat-container">
      <p className='credits-text'>Credits - {credits}  </p>
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              {(() => {
                if (typeof message.text === 'string') {
                  if (message.text === 'Loading') {
                    return <TypingLoader />;
                  }
                  return message.text;
                }

                const videoContent = message.text as VideoContent;
                if(videoContent.type === 'video') {
                  return (
                    <video 
                      src={videoContent.url}
                      controls
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                );
              } 
              return null;
              })()}
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
            placeholder="Message PayLLM"
            className="chat-input"
          />
          <button
            className="send-button"
            disabled={!inputValue.trim()}
            onClick={() => {
              if (inputValue.trim()) {
                onNewMessage({ query: inputValue, modelType });
                setInputValue('');
              }
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;