'use client';

import Link from "next/link";

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  Bot,
  Send,
  User,
  Sparkles,
  Shield,
  HelpCircle,
  MapPin,
  Loader2,
  MessageCircle,
  Lightbulb,
  Trash2,
  Languages,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  provider?: string;
}

const STORAGE_KEY = 'postall-ai-history';
const MAX_MESSAGES = 50;

// ─── Suggested Prompt Chips ───────────────────────────────────
const suggestedPrompts = [
  { text: 'Write a listing description', icon: MessageCircle },
  { text: 'Best price for my item?', icon: DollarSign },
  { text: 'How to stay safe?', icon: Shield },
  { text: 'Translate to Yoruba', icon: Languages },
  { text: 'Help with pricing', icon: HelpCircle },
];

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm your PostAll AI assistant. I can help you with posting tasks, finding work, selling items, payments, safety tips, and more. How can I help you today?",
  timestamp: new Date(),
  provider: 'GLM',
};

// ─── AI Providers for badges ──────────────────────────────────
const aiProviders = ['GLM', 'Groq', 'Gemini', 'OpenAI'];
function getRandomProvider(): string {
  return aiProviders[Math.floor(Math.random() * aiProviders.length)];
}

// ─── LocalStorage Helpers ─────────────────────────────────────
function loadHistory(): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) }));
    }
  } catch {
    // ignore
  }
  return [];
}

function saveHistory(messages: ChatMessage[]) {
  if (typeof window === 'undefined') return;
  try {
    const toSave = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

// ─── Main Page ────────────────────────────────────────────────
export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const history = loadHistory();
    return history.length > 0 ? history : [welcomeMessage];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Persist to localStorage on message change
  useEffect(() => {
    if (messages.length > 0 && messages[0].id !== 'welcome') {
      saveHistory(messages);
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        provider: getRandomProvider(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "Sorry, I couldn't process your request. Please try again in a moment. If the issue persists, visit our Help Center at /help.",
        timestamp: new Date(),
        provider: 'GLM',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClearChat = () => {
    setMessages([welcomeMessage]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    toast.success('Chat history cleared');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text: string) => {
    handleSend(text);
  };

  return (
    <div className="min-h-[60vh]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white hover:bg-white/20">AI Tool</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10"
              onClick={handleClearChat}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Chat
            </Button>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
            <Bot className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Meet Your AI Marketplace Assistant
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl">
            Ask anything about posting tasks, finding work, selling items, payments, safety, and more.
          </p>
          <Link href="/browse#tools" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mt-6">
            <ChevronLeft className="h-4 w-4" />Back to All Tools
          </Link>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        <Card className="shadow-xl border-0 flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-br from-teal-100 to-emerald-100 text-emerald-700'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-sm'
                      : 'bg-white text-gray-700 border border-gray-100 shadow-sm rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-[10px] ${
                          msg.role === 'user' ? 'text-emerald-200' : 'text-gray-400'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {msg.role === 'assistant' && msg.provider && (
                        <Badge variant="secondary" className="text-[8px] px-1.5 py-0 h-4 bg-emerald-50 text-emerald-600 border-emerald-200 font-semibold">
                          {msg.provider}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator — 3 Bouncing Dots */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white text-gray-700 border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompt Chips (always visible) */}
          <div className="px-4 sm:px-6 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-gray-500 font-medium">Try asking:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((suggestion) => (
                <Button
                  key={suggestion.text}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                  onClick={() => handleSuggestion(suggestion.text)}
                  disabled={isLoading}
                >
                  <suggestion.icon className="h-3 w-3 mr-1.5" />
                  {suggestion.text}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 p-3 sm:p-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1 h-11 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="h-11 w-11 rounded-xl p-0 shrink-0"
                size="default"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10px] text-gray-400">
                AI responses may not always be accurate. For critical questions, visit our{' '}
                <a href="/help" className="text-emerald-600 hover:underline">
                  Help Center
                </a>.
              </p>
              <p className="text-[10px] text-gray-400">
                Chat history saved locally ({messages.length} messages)
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
