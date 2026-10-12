'use client';

import React, { useEffect } from 'react';
import { Wrench, Wallet, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useI18n } from '@/lib/i18n-context';
import { useCondoStore } from '@/lib/store';
import { monthlyFees, tenant } from '@/lib/seed-data';
import {
  repairStatusColor,
  billStatusColor,
  formatTHB,
  formatDate,
  daysUntil,
} from '@/lib/format';
import type { TabId } from '@/components/bottom-nav';
import { cn } from '@/lib/utils';

interface DashboardProps {
  onNavigate: (tab: TabId) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { t, lang } = useI18n();
  const { repairs, bills, fetchRepairs, fetchBills, loading } = useCondoStore();

  useEffect(() => {
    if (repairs.length === 0) fetchRepairs();
    if (bills.length === 0) fetchBills();
  }, [fetchRepairs, fetchBills, repairs.length, bills.length]);

  const pendingRepairs = repairs.filter((r) => r.status === 'Pending').length;
  const unpaidBills = bills.filter((b) => b.status !== 'Paid');
  const totalDue = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

  const upcomingBills = unpaidBills
    .filter((b) => b.status !== 'Paid')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const nextDueBill = upcomingBills[0];
  const nextDueDays = nextDueBill ? daysUntil(nextDueBill.dueDate) : null;

  const recentRepairs = [...repairs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const chartData = monthlyFees.map((m, i) => ({
    month: m.month,
    amount: m.amount,
    isLast: i === monthlyFees.length - 1,
  }));

  const kpis = [
    {
      label: t('common.pendingRepairs'),
      value: String(pendingRepairs),
      icon: Wrench,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      ring: 'ring-amber-500/20',
    },
    {
      label: t('common.amountDue'),
      value: `${formatTHB(totalDue)} ฿`,
      icon: Wallet,
      color: 'text-thai',
      bg: 'bg-thai/10',
      ring: 'ring-thai/20',
    },
    {
      label: t('common.nextDue'),
      value: nextDueDays !== null ? `${Math.abs(nextDueDays)} ${Math.abs(nextDueDays) === 1 ? t('common.day') : t('common.days')}` : '—',
      icon: Clock,
      color: nextDueDays !== null && nextDueDays < 0 ? 'text-red-400' : 'text-blue-400',
      bg: nextDueDays !== null && nextDueDays < 0 ? 'bg-red-500/10' : 'bg-blue-500/10',
      ring: nextDueDays !== null && nextDueDays < 0 ? 'ring-red-500/20' : 'ring-blue-500/20',
    },
  ];

  return (
    <div className="animate-fade-in space-y-5 px-5 pt-4">
      {/* Welcome */}
      <div>
        <p className="text-xs text-muted-foreground">{t('common.welcome')}</p>
        <h2 className="text-xl font-bold text-white">{tenant.name}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t('common.room')} {tenant.roomNo} · {tenant.building}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={i}
              className={cn(
                'glass-card rounded-2xl p-3 ring-1 animate-slide-up',
                kpi.ring
              )}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={cn('mb-2 flex h-8 w-8 items-center justify-center rounded-lg', kpi.bg)}>
                <Icon className={cn('h-4 w-4', kpi.color)} />
              </div>
              <p className="text-lg font-bold leading-tight text-white">{kpi.value}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Bar Chart */}
      <div className="glass-card rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '240ms' }}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">{t('dashboard.monthlyCommonFee')}</h3>
            <p className="text-[10px] text-muted-foreground">{t('dashboard.monthlyCommonFeeSub')}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-thai/10 px-2 py-1">
            <TrendingUp className="h-3 w-3 text-thai" />
            <span className="text-[10px] font-semibold text-thai">+14.5%</span>
          </div>
        </div>
        <div className="h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={28}>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(215 20% 65%)', fontSize: 10 }}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: 'rgba(255,107,53,0.05)' }}
                contentStyle={{
                  backgroundColor: 'rgba(30,41,59,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#fff',
                }}
                labelStyle={{ color: 'hsl(215 20% 65%)' }}
                formatter={(v: number) => [`${formatTHB(v)} ฿`, t('billing.amount')]}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.isLast ? '#FF6B35' : 'rgba(255,107,53,0.35)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Repairs */}
      <div className="glass-card rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '320ms' }}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">{t('dashboard.recentRepairs')}</h3>
          <button
            onClick={() => onNavigate('repairs')}
            className="flex items-center gap-1 text-[10px] text-thai transition-colors hover:text-thai-light"
          >
            {t('common.viewAll')}
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        {loading.repairs ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : recentRepairs.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">{t('dashboard.noRepairs')}</p>
        ) : (
          <div className="space-y-2">
            {recentRepairs.map((repair) => {
              const sc = repairStatusColor(repair.status);
              return (
                <div
                  key={repair.id}
                  className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-2.5 transition-colors hover:bg-white/5"
                >
                  <div className={cn('h-2 w-2 flex-shrink-0 rounded-full', sc.dot)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-white">
                      {repair.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {t('common.room')} {repair.roomNo} · {formatDate(repair.createdAt, lang)}
                    </p>
                  </div>
                  <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-medium', sc.bg, sc.text)}>
                    {t(`common.${repair.status === 'InProgress' ? 'inProgress' : repair.status.toLowerCase()}`)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Bills */}
      <div className="glass-card rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">{t('dashboard.upcomingBills')}</h3>
          <button
            onClick={() => onNavigate('billing')}
            className="flex items-center gap-1 text-[10px] text-thai transition-colors hover:text-thai-light"
          >
            {t('common.viewAll')}
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        {loading.bills ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : upcomingBills.length === 0 ? (
          <p className="py-4 text-center text-xs text-green-400">{t('dashboard.noBills')}</p>
        ) : (
          <div className="space-y-2">
            {upcomingBills.slice(0, 3).map((bill) => {
              const sc = billStatusColor(bill.status);
              const days = daysUntil(bill.dueDate);
              return (
                <div
                  key={bill.id}
                  className="flex items-center justify-between rounded-xl bg-white/[0.03] p-2.5"
                >
                  <div>
                    <p className="text-xs font-medium text-white">
                      {t(`billing.billType${bill.type === 'CommonFee' ? 'CommonFee' : bill.type}`)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {t('common.due')} {formatDate(bill.dueDate, lang)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{formatTHB(bill.amount)} ฿</p>
                    <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-medium', sc.bg, sc.text)}>
                      {days < 0 ? t('common.overdue') : `${days} ${days === 1 ? t('common.day') : t('common.days')}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
