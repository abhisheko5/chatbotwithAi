import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MessageItemProps {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const MessageItem: React.FC<MessageItemProps> = ({ id, content, role, timestamp }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`group flex space-x-4 p-6 ${role === 'assistant' ? 'bg-gray-700/50' : ''}`}>
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          role === 'user' ? 'bg-blue-600' : 'bg-green-600'
        }`}>
          {role === 'user' ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-2">
          <span className="font-medium text-white">
            {role === 'user' ? 'You' : 'ChatBot AI'}
          </span>
          <span className="text-xs text-gray-400">
            {formatTime(timestamp)}
          </span>
        </div>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
            {content}
          </p>
        </div>
        {role === 'assistant' && (
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center space-x-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MessageList: React.FC = () => {
  const { currentChat, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  if (!currentChat) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {currentChat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center py-12">
            <div>
              <Bot className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-500">
                Send a message to begin chatting with the AI
              </p>
            </div>
          </div>
        ) : (
          currentChat.messages.map((message) => (
            <MessageItem
              key={message.id}
              id={message.id}
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
            />
          ))
        )}
        
        {isLoading && (
          <div className="flex space-x-4 p-6 bg-gray-700/50">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-white">ChatBot AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-400">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;