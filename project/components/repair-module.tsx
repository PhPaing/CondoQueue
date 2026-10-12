'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Plus, X, Upload, ImageIcon, Loader2, Wrench, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { useCondoStore } from '@/lib/store';
import { tenant } from '@/lib/seed-data';
import {
  repairStatusColor,
  repairPriorityColor,
  repairCategoryColor,
  formatDate,
} from '@/lib/format';
import type { Repair, RepairCategory, RepairPriority } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const CATEGORIES: RepairCategory[] = ['AC', 'Water', 'Electric', 'CommonArea'];
const PRIORITIES: RepairPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

export function RepairModule() {
  const { t, lang } = useI18n();
  const { repairs, fetchRepairs, createRepair, updateRepairStatus, deleteRepair, loading } = useCondoStore();
  const [showCreate, setShowCreate] = useState(false);

  React.useEffect(() => {
    fetchRepairs();
  }, [fetchRepairs]);

  return (
    <div className="animate-fade-in px-5 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{t('repairs.title')}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{t('repairs.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="group flex items-center gap-1.5 rounded-xl bg-thai-gradient px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-thai/20 transition-all duration-200 hover:shadow-thai/30 active:scale-95"
        >
          <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
          {t('repairs.newRepair')}
        </button>
      </div>

      {loading.repairs && repairs.length === 0 ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : repairs.length === 0 ? (
        <RepairEmptyState onCreate={() => setShowCreate(true)} />
      ) : (
        <div className="space-y-2.5 pb-2">
          {repairs.map((repair, idx) => (
            <RepairCard
              key={repair.id}
              repair={repair}
              index={idx}
              onStatusChange={(status) => updateRepairStatus(repair.id, status)}
              onDelete={() => {
                deleteRepair(repair.id);
                toast.success(t('repairs.repairDeleted'));
              }}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateRepairModal
          onClose={() => setShowCreate(false)}
          onCreate={async (data) => {
            await createRepair(data);
            toast.success(t('repairs.repairCreated'));
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

function RepairEmptyState({ onCreate }: { onCreate: () => void }) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center animate-scale-in">
      <div className="relative mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-thai/10">
          <Wrench className="h-8 w-8 text-thai" />
        </div>
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-thai shadow-lg shadow-thai/20">
          <Plus className="h-3 w-3 text-white" />
        </div>
      </div>
      <h3 className="text-sm font-semibold text-white">{t('repairs.emptyTitle')}</h3>
      <p className="mt-1.5 max-w-[260px] text-xs leading-relaxed text-muted-foreground">
        {t('repairs.emptyDesc')}
      </p>
      <button
        onClick={onCreate}
        className="mt-4 flex items-center gap-1.5 rounded-xl bg-thai-gradient px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-thai/20 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Plus className="h-4 w-4" />
        {t('repairs.newRepair')}
      </button>
    </div>
  );
}

function RepairCard({
  repair,
  index,
  onStatusChange,
  onDelete,
}: {
  repair: Repair;
  index: number;
  onStatusChange: (status: Repair['status']) => void;
  onDelete: () => void;
}) {
  const { t, lang } = useI18n();
  const sc = repairStatusColor(repair.status);
  const pc = repairPriorityColor(repair.priority);
  const cc = repairCategoryColor(repair.category);

  const statusLabel = (s: Repair['status']) => {
    if (s === 'InProgress') return t('common.inProgress');
    return s === 'Pending' ? t('common.pending') : t('common.fixed');
  };

  const statusIcon = {
    Pending: <Clock className="h-3 w-3" />,
    InProgress: <Loader2 className="h-3 w-3 animate-spin" />,
    Fixed: <CheckCircle2 className="h-3 w-3" />,
  };

  return (
    <div
      className="glass-card rounded-2xl p-3.5 animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn('rounded-lg px-2 py-0.5 text-[10px] font-medium', cc.bg, cc.text)}>
            {t(`repairs.category${repair.category === 'CommonArea' ? 'CommonArea' : repair.category}`)}
          </span>
          <span className={cn('rounded-lg px-2 py-0.5 text-[10px] font-medium', pc.bg, pc.text)}>
            {t(`common.${repair.priority.toLowerCase()}`)}
          </span>
        </div>
        <span className={cn('flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium', sc.bg, sc.text, sc.border)}>
          {statusIcon[repair.status]}
          {statusLabel(repair.status)}
        </span>
      </div>

      <p className="mt-2.5 text-sm leading-relaxed text-white">{repair.description}</p>

      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>{t('common.room')} {repair.roomNo}</span>
          <span>·</span>
          <span>{formatDate(repair.createdAt, lang)}</span>
        </div>
        <div className="flex items-center gap-1">
          {repair.status !== 'Fixed' && (
            <>
              {repair.status === 'Pending' && (
                <button
                  onClick={() => onStatusChange('InProgress')}
                  className="rounded-lg bg-blue-500/10 px-2 py-1 text-[10px] font-medium text-blue-400 transition-all hover:bg-blue-500/20 active:scale-95"
                >
                  {t('repairs.markInProgress')}
                </button>
              )}
              <button
                onClick={() => onStatusChange('Fixed')}
                className="rounded-lg bg-green-500/10 px-2 py-1 text-[10px] font-medium text-green-400 transition-all hover:bg-green-500/20 active:scale-95"
              >
                {t('repairs.markFixed')}
              </button>
            </>
          )}
          {repair.status === 'Fixed' && (
            <button
              onClick={onDelete}
              className="rounded-lg bg-red-500/10 px-2 py-1 text-[10px] font-medium text-red-400 transition-all hover:bg-red-500/20 active:scale-95"
            >
              {t('common.delete')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateRepairModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: {
    roomNo: string;
    category: RepairCategory;
    description: string;
    priority: RepairPriority;
    imageUrl: string | null;
  }) => Promise<void>;
}) {
  const { t } = useI18n();
  const [roomNo, setRoomNo] = useState(tenant.roomNo);
  const [category, setCategory] = useState<RepairCategory>('AC');
  const [priority, setPriority] = useState<RepairPriority>('Medium');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setSubmitting(true);
    try {
      await onCreate({
        roomNo,
        category,
        description: description.trim(),
        priority,
        imageUrl,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-[480px] max-h-[90vh] overflow-y-auto scrollbar-hide rounded-t-3xl border border-white/10 bg-[#0F172A] p-5 shadow-2xl animate-slide-up sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">{t('repairs.createRepair')}</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-muted-foreground transition-all hover:bg-white/10 hover:text-white active:scale-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Photo Upload */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('repairs.uploadPhoto')}
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                'relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-200',
                isDragging
                  ? 'border-thai bg-thai/5 scale-[1.02]'
                  : 'border-white/10 hover:border-thai/40 hover:bg-white/5'
              )}
            >
              {imageUrl ? (
                <div className="relative w-full">
                  <img src={imageUrl} alt="Preview" className="mx-auto max-h-40 rounded-lg object-contain" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl(null);
                    }}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-all hover:bg-red-500 active:scale-90"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-thai/10">
                    {isDragging ? (
                      <Upload className="h-5 w-5 text-thai animate-bounce" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-thai" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-white">
                    {isDragging ? t('repairs.dropHere') : t('repairs.dragDrop')}
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>
          </div>

          {/* Room No */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('repairs.roomNo')}
            </label>
            <input
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition-all focus:border-thai/50 focus:bg-white/10"
              placeholder="505"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('repairs.category')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200 active:scale-95',
                    category === cat
                      ? 'border-thai/50 bg-thai/10 text-thai'
                      : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-white'
                  )}
                >
                  {t(`repairs.category${cat === 'CommonArea' ? 'CommonArea' : cat}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('repairs.priority')}
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map((pri) => {
                const pc = repairPriorityColor(pri);
                return (
                  <button
                    key={pri}
                    onClick={() => setPriority(pri)}
                    className={cn(
                      'flex-1 rounded-xl border px-2 py-2 text-[11px] font-medium transition-all duration-200 active:scale-95',
                      priority === pri
                        ? cn('border-transparent', pc.bg, pc.text)
                        : 'border-white/10 bg-white/5 text-muted-foreground hover:text-white'
                    )}
                  >
                    {t(`common.${pri.toLowerCase()}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('repairs.description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition-all focus:border-thai/50 focus:bg-white/10"
              placeholder={t('repairs.descriptionPlaceholder')}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-white/10 hover:text-white active:scale-95"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!description.trim() || submitting}
              className="flex-1 rounded-xl bg-thai-gradient py-2.5 text-sm font-semibold text-white shadow-lg shadow-thai/20 transition-all hover:shadow-thai/30 active:scale-95 disabled:opacity-40 disabled:active:scale-100"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('repairs.submitting')}
                </span>
              ) : (
                t('common.submit')
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
