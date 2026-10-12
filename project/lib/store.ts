'use client';

import { create } from 'zustand';
import type { Repair, Bill, ChatMessage, RepairStatus } from './types';
import { RepairApi, BillApi, ChatApi } from './api';
import { seedRepairs, seedBills, seedChatMessages } from './seed-data';

interface CondoStore {
  repairs: Repair[];
  bills: Bill[];
  chatMessages: ChatMessage[];
  loading: { repairs: boolean; bills: boolean; chat: boolean };
  error: string | null;

  fetchRepairs: () => Promise<void>;
  createRepair: (data: {
    roomNo: string;
    category: Repair['category'];
    description: string;
    priority: Repair['priority'];
    imageUrl: string | null;
  }) => Promise<Repair>;
  updateRepairStatus: (id: string, status: RepairStatus) => Promise<void>;
  deleteRepair: (id: string) => Promise<void>;

  fetchBills: () => Promise<void>;
  payBill: (id: string) => Promise<void>;

  fetchChat: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
}

export const useCondoStore = create<CondoStore>((set, get) => ({
  repairs: [],
  bills: [],
  chatMessages: [],
  loading: { repairs: false, bills: false, chat: false },
  error: null,

  fetchRepairs: async () => {
    set((s) => ({ loading: { ...s.loading, repairs: true } }));
    try {
      const repairs = await RepairApi.getAll();
      set({ repairs, loading: { ...get().loading, repairs: false } });
    } catch (e) {
      set({ error: (e as Error).message, loading: { ...get().loading, repairs: false } });
    }
  },

  createRepair: async (data) => {
    const optimisticRepair: Repair = {
      id: `temp-${Date.now()}`,
      roomNo: data.roomNo,
      category: data.category,
      description: data.description,
      status: 'Pending',
      priority: data.priority,
      imageUrl: data.imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((s) => ({ repairs: [optimisticRepair, ...s.repairs] }));
    try {
      const realRepair = await RepairApi.create(data);
      set((s) => ({
        repairs: s.repairs.map((r) => (r.id === optimisticRepair.id ? realRepair : r)),
      }));
      return realRepair;
    } catch (e) {
      set((s) => ({
        repairs: s.repairs.filter((r) => r.id !== optimisticRepair.id),
        error: (e as Error).message,
      }));
      throw e;
    }
  },

  updateRepairStatus: async (id, status) => {
    const prev = get().repairs;
    set((s) => ({
      repairs: s.repairs.map((r) =>
        r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
      ),
    }));
    try {
      await RepairApi.updateStatus(id, status);
    } catch {
      set({ repairs: prev });
    }
  },

  deleteRepair: async (id) => {
    const prev = get().repairs;
    set((s) => ({ repairs: s.repairs.filter((r) => r.id !== id) }));
    try {
      await RepairApi.delete(id);
    } catch {
      set({ repairs: prev });
    }
  },

  fetchBills: async () => {
    set((s) => ({ loading: { ...s.loading, bills: true } }));
    try {
      const bills = await BillApi.getAll();
      set({ bills, loading: { ...get().loading, bills: false } });
    } catch (e) {
      set({ error: (e as Error).message, loading: { ...get().loading, bills: false } });
    }
  },

  payBill: async (id) => {
    const prev = get().bills;
    set((s) => ({
      bills: s.bills.map((b) =>
        b.id === id
          ? { ...b, status: 'Paid', paidAt: new Date().toISOString() }
          : b
      ),
    }));
    try {
      await BillApi.pay(id);
    } catch {
      set({ bills: prev });
    }
  },

  fetchChat: async () => {
    set((s) => ({ loading: { ...s.loading, chat: true } }));
    try {
      const messages = await ChatApi.getMessages();
      set({ chatMessages: messages, loading: { ...get().loading, chat: false } });
    } catch (e) {
      set({ error: (e as Error).message, loading: { ...get().loading, chat: false } });
    }
  },

  sendMessage: async (text) => {
    const now = new Date().toISOString();
    const tenantMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: 'tenant',
      text,
      timestamp: now,
    };
    set((s) => ({ chatMessages: [...s.chatMessages, tenantMsg] }));
    try {
      const result = await ChatApi.sendMessage(text);
      set((s) => ({
        chatMessages: s.chatMessages.map((m) =>
          m.id === tenantMsg.id ? result.tenant : m
        ).concat(result.juristic),
      }));
    } catch (e) {
      set((s) => ({
        chatMessages: s.chatMessages.filter((m) => m.id !== tenantMsg.id),
        error: (e as Error).message,
      }));
    }
  },
}));

export function useSeedData() {
  return { seedRepairs, seedBills, seedChatMessages };
}
