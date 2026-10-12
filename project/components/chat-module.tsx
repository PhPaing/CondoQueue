'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send, Check, CheckCheck, Phone, Video, MoreVertical, Building2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { useCondoStore } from '@/lib/store';
import { formatTime } from '@/lib/format';
import { cn } from '@/lib/utils';

export function ChatModule() {
  const { t, lang } = useI18n();
  const { chatMessages, fetchChat, sendMessage } = useCondoStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    setIsTyping(true);
    await sendMessage(text);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 60px - 64px)' }}>
      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-3">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-thai-gradient">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0F172A] bg-green-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">{t('chat.jururisticName')}</h3>
          <p className="text-[10px] text-green-400">{t('chat.online')}</p>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-white/5 hover:text-white active:scale-90">
          <Phone className="h-4 w-4" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-white/5 hover:text-white active:scale-90">
          <Video className="h-4 w-4" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-white/5 hover:text-white active:scale-90">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3">
        {chatMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
              <Building2 className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">{t('chat.emptyChat')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {chatMessages.map((msg, idx) => {
              const isTenant = msg.sender === 'tenant';
              const showAvatar =
                !isTenant && (idx === 0 || chatMessages[idx - 1].sender !== 'juristic');
              return (
                <div
                  key={msg.id}
                  className={cn('flex items-end gap-2', isTenant ? 'justify-end' : 'justify-start')}
                >
                  {!isTenant && (
                    <div className={cn('flex-shrink-0', !showAvatar && 'invisible')}>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-thai-gradient">
                        <Building2 className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                  )}
                  <div
                    className={cn(
                      'chat-bubble-in max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                      isTenant
                        ? 'bg-thai-gradient text-white rounded-br-md shadow-md shadow-thai/10'
                        : 'glass-card text-white rounded-bl-md'
                    )}
                    style={{ animationDelay: `${Math.min(idx * 30, 200)}ms` }}
                  >
                    <p className={cn(isTenant ? 'font-sans' : lang === 'th' ? 'font-thai' : 'font-sans')}>
                      {msg.text}
                    </p>
                    <div className={cn('mt-1 flex items-center gap-1', isTenant ? 'justify-end' : 'justify-start')}>
                      <span className={cn('text-[9px]', isTenant ? 'text-white/70' : 'text-muted-foreground')}>
                        {formatTime(msg.timestamp, lang)}
                      </span>
                      {isTenant && <CheckCheck className="h-3 w-3 text-white/70" />}
                    </div>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-thai-gradient">
                  <Building2 className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="glass-card flex items-center gap-1 rounded-2xl rounded-bl-md px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/5 px-4 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t('chat.typeMessage')}
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-thai/40 focus:bg-white/10"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-thai-gradient text-white shadow-lg shadow-thai/20 transition-all duration-200 hover:shadow-thai/30 active:scale-90 disabled:opacity-40 disabled:active:scale-100"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
