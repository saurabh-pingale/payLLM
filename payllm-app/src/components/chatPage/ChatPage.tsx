import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message } from '../../types';
import { fetchResource, getSolFee } from '../../utils/helper';
import { record_message_onchain } from '../../common/contract';
import { SOL_ADMIN_RECEIVER_ADDRESS } from '../../common/constants';
import { VideoContent } from '../../common/types';
import './ChatPage.scss';
import TypingLoader from '../TypingLoader/TypingLoader';

interface ChatPageProps {
  query: string;
  onNewMessage: ({ query, modelType }: { query: string, modelType: string }) => void;
  modelType: string;
  onBack: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ query, onNewMessage, modelType, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    getResourcesOnMessage()
    scrollToBottom();
  }, [query]);

  const getResourcesOnMessage = async () => {
    setMessages(
      [
        { id: Date.now(), text: query, sender: 'user' },
        { id: Date.now() + 1, text: 'Loading', sender: 'ai' }
      ]);

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
       <button className="back-button" onClick={onBack}>
        ← GO BACK
      </button>

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
      </div>
  );
};

export default ChatPage;