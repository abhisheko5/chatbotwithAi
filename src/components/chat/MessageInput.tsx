import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, isLoading } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const messageToSend = message.trim();
    setMessage('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      await sendMessage(messageToSend); // Wait for AI response
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessage(messageToSend);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  return (
    <div className="border-t border-gray-700 bg-gray-800">
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={isLoading ? 'AI is thinking...' : message}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                style={{ minHeight: '50px', maxHeight: '200px' }}
                disabled={isLoading}
                rows={1}
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 p-1 text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                <Paperclip className="h-4 w-4" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-2 text-center">
          ChatBot AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default MessageInput;
