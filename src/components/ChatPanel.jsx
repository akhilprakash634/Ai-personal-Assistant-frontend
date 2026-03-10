import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, MessageSquare, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';
import api from '../api';

export default function ChatPanel({ onRefresh }) {
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I can help you manage your reminders. Try saying "Remind me to call Mom tomorrow" or "Show overdue".' }
  ]);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: query }]);

    try {
      const res = await api.post('/chat/', { message: query });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
      
      if (res.data.data?.task || res.data.data?.refresh_tasks) {
        if (onRefresh) onRefresh();
      }
      
      if (res.data.data?.action === 'navigate') {
        let path = '/';
        if (res.data.data.page === 'settings') path = '/settings';
        else if (res.data.data.page === 'tasks') path = '/tasks';
        
        // Add filter if present
        if (res.data.data.filter) {
          path += `?filter=${res.data.data.filter}`;
        }
        
        navigate(path);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error processing that request.' }]);
    }
  };

  if (isMinimized) {
    return (
      <button 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full premium-shadow flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`
      fixed bottom-0 right-0 w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 
      flex flex-col shadow-2xl z-40 transition-all duration-300 md:h-screen h-[400px]
    `}>
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center">
            <Sparkles className="w-4 h-4 mr-1.5 text-indigo-600 dark:text-indigo-400" />
            AI Assistant
          </h2>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 transition"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50/30 dark:bg-slate-950/30 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-sm' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700/50 rounded-tl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleChatSubmit} className="p-3 md:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pb-16 md:pb-4">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-400 transition text-sm font-medium dark:text-white"
          />
          <button 
            type="submit"
            disabled={!chatInput.trim()}
            className="absolute right-1.5 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 transition shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
