import type { RepairStatus, RepairPriority, BillStatus, BillType, RepairCategory } from './types';

export function formatDate(dateStr: string, lang: 'en' | 'th' = 'en'): string {
  const date = new Date(dateStr);
  const locale = lang === 'th' ? 'th-TH' : 'en-US';
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(dateStr: string, lang: 'en' | 'th' = 'en'): string {
  const date = new Date(dateStr);
  const locale = lang === 'th' ? 'th-TH' : 'en-US';
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatTHB(amount: number): string {
  return amount.toLocaleString('en-US');
}

export function repairStatusColor(status: RepairStatus): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case 'Pending':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-400' };
    case 'InProgress':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-400' };
    case 'Fixed':
      return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-400' };
  }
}

export function repairPriorityColor(priority: RepairPriority): {
  bg: string;
  text: string;
} {
  switch (priority) {
    case 'Low':
      return { bg: 'bg-slate-500/10', text: 'text-slate-400' };
    case 'Medium':
      return { bg: 'bg-yellow-500/10', text: 'text-yellow-400' };
    case 'High':
      return { bg: 'bg-orange-500/10', text: 'text-orange-400' };
    case 'Urgent':
      return { bg: 'bg-red-500/10', text: 'text-red-400' };
  }
}

export function billStatusColor(status: BillStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'Unpaid':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' };
    case 'Paid':
      return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' };
    case 'Overdue':
      return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' };
  }
}

export function billTypeColor(type: BillType): { bg: string; text: string } {
  switch (type) {
    case 'Water':
      return { bg: 'bg-cyan-500/10', text: 'text-cyan-400' };
    case 'Electric':
      return { bg: 'bg-yellow-500/10', text: 'text-yellow-400' };
    case 'CommonFee':
      return { bg: 'bg-thai/10', text: 'text-thai' };
  }
}

export function repairCategoryColor(cat: RepairCategory): { bg: string; text: string } {
  switch (cat) {
    case 'AC':
      return { bg: 'bg-sky-500/10', text: 'text-sky-400' };
    case 'Water':
      return { bg: 'bg-cyan-500/10', text: 'text-cyan-400' };
    case 'Electric':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400' };
    case 'CommonArea':
      return { bg: 'bg-purple-500/10', text: 'text-purple-400' };
  }
}
