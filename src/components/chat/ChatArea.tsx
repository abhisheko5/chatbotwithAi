import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChat } from '../../contexts/ChatContext';
import { MessageSquare } from 'lucide-react';

const ChatArea: React.FC = () => {
  const { currentChat } = useChat();

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-800">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-300 mb-2">
            Welcome to ChatBot AI
          </h2>
          <p className="text-gray-500">
            Start a new conversation to begin chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-800">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <MessageList />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatArea;
