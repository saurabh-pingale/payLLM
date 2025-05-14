import React, { useState, useRef, useEffect } from 'react';
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
  modelType: string;
  onBack: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ query, onNewMessage, modelType, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [credits, setCredits] = useState(0)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    getResourcesOnMessage()
    scrollToBottom();
  }, [query]);

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

    record_message_onchain({
      ai_query: response, 
      user_query:query,
      ai_model: modelType,
      credits:10,
      amount: getSolFee(),
      receiver: localStorage.getItem('payllm-user-wallet-address') || SOL_ADMIN_RECEIVER_ADDRESS,
    })
  }

  return (
    <div className="payllm-chat-container">
      <p className='credits-text'>Credits - {credits}  </p>
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