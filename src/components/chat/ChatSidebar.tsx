import React from 'react';
import { Plus, MessageSquare, Trash2, User, LogOut, X } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useUserData, useSignOut } from '@nhost/react';

interface ChatSidebarProps {
  onClose: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onClose }) => {
  const { chats, currentChat, createNewChat, selectChat, deleteChat } = useChat();
  const user = useUserData();
  const { signOut } = useSignOut();

  const handleNewChat = async () => {
    await createNewChat(); // Optimistically adds new chat and selects it
    onClose(); // Close sidebar on mobile
  };

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
    onClose(); // Close sidebar on mobile
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-gray-900 h-full flex flex-col border-r border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">ChatBot AI</h1>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors group"
        >
          <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">New Chat</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {chats.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No chats yet</p>
            <p className="text-xs">Start a new conversation</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-800 ${
                currentChat?.id === chat.id ? 'bg-gray-700' : ''
              }`}
              onClick={() => handleSelectChat(chat.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <h3 className="font-medium text-white truncate text-sm">
                    {chat.title}
                  </h3>
                </div>
                
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {user?.displayName || user?.email}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
