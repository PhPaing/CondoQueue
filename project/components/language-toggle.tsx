'use client';

import React from 'react';
import { Languages } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

export function LanguageToggle() {
  const { lang, toggleLang } = useI18n();

  return (
    <button
      onClick={toggleLang}
      className="group relative flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-all duration-200 hover:border-thai/40 hover:bg-thai/5 active:scale-95"
      aria-label="Toggle language"
    >
      <Languages className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-thai" />
      <span
        className={cn(
          'text-xs font-semibold transition-colors',
          lang === 'en' ? 'text-white' : 'text-muted-foreground'
        )}
      >
        EN
      </span>
      <span className="text-muted-foreground/50 text-xs">/</span>
      <span
        className={cn(
          'font-thai text-xs font-semibold transition-colors',
          lang === 'th' ? 'text-white' : 'text-muted-foreground'
        )}
      >
        ไทย
      </span>
    </button>
  );
}
