'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { BottomNav, type TabId } from '@/components/bottom-nav';
import { Dashboard } from '@/components/dashboard';
import { RepairModule } from '@/components/repair-module';
import { BillingModule } from '@/components/billing-module';
import { ChatModule } from '@/components/chat-module';
import { useI18n } from '@/lib/i18n-context';
import { Toaster } from 'sonner';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[#0F172A] text-foreground">
      {/* Ambient background gradient */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,107,53,0.08), transparent), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(56,189,248,0.05), transparent)',
        }}
      />

      <div className="relative z-10 mx-auto min-h-screen max-w-[480px]">
        <AppHeader />

        <main className="pb-20">
          {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
          {activeTab === 'repairs' && <RepairModule />}
          {activeTab === 'billing' && <BillingModule />}
          {activeTab === 'chat' && <ChatModule />}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
            {t('common.footer')}
          </p>
        </footer>

        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>

      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(30,41,59,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            fontSize: '12px',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
}
