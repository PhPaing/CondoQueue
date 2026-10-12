'use client';

import React from 'react';
import { LayoutDashboard, Wrench, Receipt, MessageCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

export type TabId = 'dashboard' | 'repairs' | 'billing' | 'chat';

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { t } = useI18n();

  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'repairs', label: t('nav.repairs'), icon: Wrench },
    { id: 'billing', label: t('nav.billing'), icon: Receipt },
    { id: 'chat', label: t('nav.chat'), icon: MessageCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-[480px] items-stretch justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="group relative flex flex-1 flex-col items-center gap-1 py-2.5 transition-all duration-200"
            >
              <div
                className={cn(
                  'relative flex h-8 w-12 items-center justify-center rounded-full transition-all duration-300',
                  isActive
                    ? 'bg-thai/10 shadow-[0_0_20px_-5px] shadow-thai/30'
                    : 'group-hover:bg-white/5'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-all duration-300',
                    isActive
                      ? 'text-thai scale-110'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                {isActive && (
                  <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-thai" />
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium transition-colors duration-200',
                  isActive ? 'text-thai' : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
