'use client';

import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Loader2, Receipt, Zap, Droplets, Building, X, QrCode } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { useCondoStore } from '@/lib/store';
import { billStatusColor, billTypeColor, formatTHB, formatDate, daysUntil } from '@/lib/format';
import type { Bill } from '@/lib/types';
import { cn } from '@/lib/utils';

const billTypeIcon = {
  Water: Droplets,
  Electric: Zap,
  CommonFee: Building,
};

export function BillingModule() {
  const { t, lang } = useI18n();
  const { bills, fetchBills, payBill, loading } = useCondoStore();
  const [payingBill, setPayingBill] = useState<Bill | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const unpaidBills = bills.filter((b) => b.status !== 'Paid');
  const paidBills = bills.filter((b) => b.status === 'Paid');
  const totalDue = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

  const handlePay = async () => {
    if (!payingBill) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    await payBill(payingBill.id);
    setProcessing(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setPayingBill(null);
    }, 2000);
  };

  return (
    <div className="animate-fade-in px-5 pt-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">{t('billing.title')}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{t('billing.subtitle')}</p>
      </div>

      {/* Total Due Banner */}
      <div className="mb-4 overflow-hidden rounded-2xl bg-thai-gradient p-4 shadow-lg shadow-thai/20 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/80">{t('billing.totalDue')}</p>
            <p className="mt-1 text-2xl font-bold text-white">{formatTHB(totalDue)} {t('billing.thb')}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Receipt className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {loading.bills && bills.length === 0 ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : unpaidBills.length === 0 && paidBills.length === 0 ? (
        <BillEmptyState />
      ) : (
        <div className="space-y-4 pb-2">
          {unpaidBills.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('common.unpaid')} ({unpaidBills.length})
              </h3>
              {unpaidBills.map((bill, idx) => (
                <BillCard
                  key={bill.id}
                  bill={bill}
                  index={idx}
                  lang={lang}
                  onPay={() => setPayingBill(bill)}
                />
              ))}
            </div>
          )}
          {paidBills.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('common.paid')} ({paidBills.length})
              </h3>
              {paidBills.map((bill, idx) => (
                <BillCard
                  key={bill.id}
                  bill={bill}
                  index={idx}
                  lang={lang}
                  onPay={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment Modal with PromptPay QR */}
      {payingBill && (
        <PaymentModal
          bill={payingBill}
          processing={processing}
          showSuccess={showSuccess}
          onClose={() => !processing && !showSuccess && setPayingBill(null)}
          onPay={handlePay}
        />
      )}
    </div>
  );
}

function BillCard({
  bill,
  index,
  lang,
  onPay,
}: {
  bill: Bill;
  index: number;
  lang: 'en' | 'th';
  onPay: () => void;
}) {
  const { t } = useI18n();
  const sc = billStatusColor(bill.status);
  const tc = billTypeColor(bill.type);
  const Icon = billTypeIcon[bill.type];
  const days = daysUntil(bill.dueDate);
  const isPaid = bill.status === 'Paid';

  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-3.5 animate-slide-up',
        isPaid && 'opacity-60'
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl', tc.bg)}>
          <Icon className={cn('h-5 w-5', tc.text)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">
            {t(`billing.billType${bill.type === 'CommonFee' ? 'CommonFee' : bill.type}`)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {bill.period} · {bill.unit}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-white">{formatTHB(bill.amount)} ฿</p>
          <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-medium', sc.bg, sc.text)}>
            {isPaid ? t('common.paid') : days < 0 ? t('common.overdue') : `${days} ${days === 1 ? t('common.day') : t('common.days')}`}
          </span>
        </div>
      </div>

      {!isPaid && (
        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5">
          <span className="text-[10px] text-muted-foreground">
            {t('common.due')} {formatDate(bill.dueDate, lang)}
          </span>
          <button
            onClick={onPay}
            className="flex items-center gap-1 rounded-lg bg-thai-gradient px-3 py-1.5 text-[11px] font-semibold text-white shadow-md shadow-thai/20 transition-all duration-200 hover:shadow-thai/30 active:scale-95"
          >
            <QrCode className="h-3.5 w-3.5" />
            {t('common.payNow')}
          </button>
        </div>
      )}
    </div>
  );
}

function PaymentModal({
  bill,
  processing,
  showSuccess,
  onClose,
  onPay,
}: {
  bill: Bill;
  processing: boolean;
  showSuccess: boolean;
  onClose: () => void;
  onPay: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-[480px] rounded-t-3xl border border-white/10 bg-[#0F172A] p-5 shadow-2xl animate-slide-up sm:rounded-3xl">
        {showSuccess ? (
          <div className="flex flex-col items-center py-8 animate-success-pop">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-12 w-12 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white">{t('billing.paymentSuccess')}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{t('billing.paymentSuccessDesc')}</p>
            <p className="mt-3 text-2xl font-bold text-green-400">{formatTHB(bill.amount)} ฿</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">{t('billing.payWithPromptpay')}</h3>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-muted-foreground transition-all hover:bg-white/10 hover:text-white active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* PromptPay QR */}
            <div className="flex flex-col items-center py-2">
              <div className="rounded-2xl border border-white/10 bg-white p-4">
                <PromptPayQR bill={bill} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{t('billing.scanToPay')}</p>
              <p className="mt-1 text-[10px] font-medium text-amber-400">{t('billing.demoQrCaption')}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{t('billing.amount')}:</span>
                <span className="text-xl font-bold text-thai">{formatTHB(bill.amount)} {t('billing.thb')}</span>
              </div>
            </div>

            <button
              onClick={onPay}
              disabled={processing}
              className="mt-4 w-full rounded-xl bg-thai-gradient py-3 text-sm font-semibold text-white shadow-lg shadow-thai/20 transition-all hover:shadow-thai/30 active:scale-[0.98] disabled:opacity-60"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </span>
              ) : (
                `${t('common.pay')} ${formatTHB(bill.amount)} ${t('billing.thb')}`
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Demo-only payload: plain text, NOT an EMVCo/PromptPay payload, so no banking app can pay it.
const BILL_TYPE_LABELS: Record<Bill['type'], string> = {
  CommonFee: 'Common Fee',
  Water: 'Water',
  Electric: 'Electric',
};

function buildDemoQrText(bill: Bill): string {
  return [
    'Condo Queue Mock Payment',
    `Bill Type: ${BILL_TYPE_LABELS[bill.type]}`,
    `Amount: ${bill.amount} THB`,
    'Juristic: The Rich Sathorn',
  ].join('\n');
}

function PromptPayQR({ bill }: { bill: Bill }) {
  return (
    <QRCodeSVG
      value={buildDemoQrText(bill)}
      size={160}
      level="M"
      bgColor="#FFFFFF"
      fgColor="#000000"
      marginSize={0}
      className="rounded-lg"
    />
  );
}

function BillEmptyState() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center animate-scale-in">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
        <Receipt className="h-8 w-8 text-green-400" />
      </div>
      <h3 className="text-sm font-semibold text-white">{t('billing.emptyTitle')}</h3>
      <p className="mt-1.5 max-w-[260px] text-xs leading-relaxed text-muted-foreground">
        {t('billing.emptyDesc')}
      </p>
    </div>
  );
}
