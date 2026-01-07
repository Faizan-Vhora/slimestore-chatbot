'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  { icon: '📦', text: 'Track my order' },
  { icon: '↩️', text: 'Return policy' },
  { icon: '💳', text: 'Payment methods' },
  { icon: '🚚', text: 'Shipping info' },
  { icon: '🛍️', text: 'View products' },
  { icon: '💰', text: 'Current offers' },
];

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey there! Welcome to Slimestore! 👋\n\nI'm here to help you with products, orders, shipping, and more. What can I do for you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: data.error || data.response,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 group z-50"
      >
        <span className="text-2xl group-hover:scale-110 transition-transform">🧪</span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex flex-col w-full max-w-lg h-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white p-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <span className="text-3xl">🧪</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-xl tracking-tight">Slimestore</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-white/80">Online now</span>
              </div>
            </div>
            <button 
              onClick={() => setIsMinimized(true)}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white scroll-smooth">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md">
                    <span className="text-lg">🧪</span>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-br-md'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <span className={`text-[10px] text-gray-400 px-2 ${message.role === 'user' ? 'text-right' : ''}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex gap-3 max-w-[85%]">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md">
                  <span className="text-lg">🧪</span>
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-5 py-4 shadow-sm border border-gray-100">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        {messages.length <= 2 && (
          <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2 px-1">Quick actions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(question.text)}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 disabled:opacity-50 shadow-sm"
                >
                  <span>{question.icon}</span>
                  <span>{question.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="w-full px-5 py-3.5 bg-gray-100 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white disabled:bg-gray-100 text-sm transition-all duration-200 pr-12 text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-3">
            Powered by{' '}
            <a 
              href="https://github.com/Faizan-Vhora" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-purple-500 hover:text-purple-700 font-medium hover:underline transition-colors"
            >
              Faizan AI
            </a>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}
