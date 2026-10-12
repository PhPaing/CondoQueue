'use client';

import React from 'react';
import { Building2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { LanguageToggle } from '@/components/language-toggle';

export function AppHeader() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="mx-auto flex max-w-[480px] items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-thai-gradient shadow-lg shadow-thai/20">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-none text-white">
              {t('common.appName')}
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {t('common.tagline')}
            </p>
          </div>
        </div>
        <LanguageToggle />
      </div>
    </header>
  );
}
