import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, DocumentItem } from '../types';
import {
  MessageSquare,
  Sparkles,
  Send,
  User,
  Bot,
  FileText,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Brain
} from 'lucide-react';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onOpenDocModalById: (docId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  onOpenDocModalById
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleCopy = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const presetChips = [
    "Summarize my career profile & top strengths",
    "Which skills am I missing for Senior AI Engineer?",
    "List all my hackathon & project accomplishments",
    "What did I work on during my IIT Bhilai internship?",
    "Estimate my placement readiness score"
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
              RETRIEVAL-AUGMENTED GENERATION (RAG)
            </span>
          </div>
          <h2 className="text-2xl font-extrabold font-outfit text-slate-100 mt-1">
            AI Career Assistant Chatbot
          </h2>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold hidden sm:block">
          Profile Context Active
        </span>
      </div>

      {/* CHAT MESSAGES SCROLL AREA */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3.5 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar Icon */}
            <div
              className={`p-2.5 rounded-2xl shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                  : 'bg-purple-500/10 border border-purple-500/30 text-purple-300 shadow-md shadow-purple-500/10'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Message Bubble Card */}
            <div className={`max-w-[85%] sm:max-w-[80%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div
                className={`p-5 rounded-3xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-indigo-600/20 border border-cyan-500/30 text-slate-100'
                    : 'glass-panel border border-slate-800 bg-[#0f172a]/90 text-slate-200'
                }`}
              >
                {/* Thinking animation state */}
                {msg.isThinking ? (
                  <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 py-1">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Searching vector store & formulating answer...</span>
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-sans">
                    {msg.text}
                  </div>
                )}

                {/* Citations Badges */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                      RAG Verified Source Citations ({msg.citations.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => onOpenDocModalById(c.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-cyan-300 font-mono flex items-center space-x-1.5 transition-all"
                        >
                          <FileText className="w-3 h-3 text-cyan-400" />
                          <span className="line-clamp-1 max-w-[200px]">{c.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Message Controls */}
              <div className="flex items-center space-x-3 mt-1.5 text-[10px] text-slate-500 px-2 font-mono">
                <span>{msg.timestamp}</span>
                {msg.sender === 'ai' && !msg.isThinking && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="hover:text-slate-300 transition-colors flex items-center space-x-1"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR & PRESET CHIPS */}
      <div className="space-y-3 pt-2">
        {/* Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {presetChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(chip)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 text-xs font-medium whitespace-nowrap transition-all cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Text Box */}
        <div className="p-2 rounded-2xl glass-panel border border-purple-500/30 bg-[#0f172a]/95 flex items-center space-x-2 shadow-2xl">
          <input
            type="text"
            placeholder="Ask RAG assistant about missing skills, career path recommendations, or resume summaries..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 bg-transparent text-xs sm:text-sm text-slate-100 focus:outline-none placeholder-slate-500"
          />

          <button
            onClick={handleSend}
            className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
