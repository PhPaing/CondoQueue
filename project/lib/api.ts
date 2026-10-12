import { seedRepairs, seedBills, seedChatMessages, autoReplies } from './seed-data';
import type { Repair, Bill, ChatMessage, RepairStatus } from './types';

/**
 * Mock .NET 8 Web API Service
 * Simulates clean architecture controllers:
 *   - RepairController (GET/POST/PUT /api/repairs)
 *   - BillController (GET/POST /api/bills)
 *   - ChatController (POST /api/chat)
 *
 * Each method returns a Promise with a realistic async delay
 * to simulate network latency (200-800ms).
 */

function delay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function uuid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * RepairController endpoints
 */
export const RepairApi = {
  // GET /api/repairs
  async getAll(): Promise<Repair[]> {
    await delay(300, 600);
    return [...seedRepairs];
  },

  // POST /api/repairs
  async create(data: {
    roomNo: string;
    category: Repair['category'];
    description: string;
    priority: Repair['priority'];
    imageUrl: string | null;
  }): Promise<Repair> {
    await delay(400, 800);
    const now = new Date().toISOString();
    return {
      id: uuid(),
      roomNo: data.roomNo,
      category: data.category,
      description: data.description,
      status: 'Pending',
      priority: data.priority,
      imageUrl: data.imageUrl,
      createdAt: now,
      updatedAt: now,
    };
  },

  // PUT /api/repairs/{id}/status
  async updateStatus(id: string, status: RepairStatus): Promise<Repair> {
    await delay(200, 400);
    const repair = seedRepairs.find((r) => r.id === id);
    if (!repair) throw new Error('Repair not found');
    repair.status = status;
    repair.updatedAt = new Date().toISOString();
    return { ...repair };
  },

  // DELETE /api/repairs/{id}
  async delete(id: string): Promise<void> {
    await delay(200, 400);
    const idx = seedRepairs.findIndex((r) => r.id === id);
    if (idx !== -1) seedRepairs.splice(idx, 1);
  },
};

/**
 * BillController endpoints
 */
export const BillApi = {
  // GET /api/bills
  async getAll(): Promise<Bill[]> {
    await delay(300, 600);
    return [...seedBills];
  },

  // POST /api/bills/{id}/pay
  async pay(id: string): Promise<Bill> {
    await delay(500, 900);
    const bill = seedBills.find((b) => b.id === id);
    if (!bill) throw new Error('Bill not found');
    bill.status = 'Paid';
    bill.paidAt = new Date().toISOString();
    return { ...bill };
  },
};

/**
 * ChatController endpoints
 */
export const ChatApi = {
  // GET /api/chat/messages
  async getMessages(): Promise<ChatMessage[]> {
    await delay(200, 400);
    return [...seedChatMessages];
  },

  // POST /api/chat/send
  async sendMessage(text: string): Promise<{ tenant: ChatMessage; juristic: ChatMessage }> {
    await delay(100, 200);
    const now = new Date().toISOString();
    const tenantMsg: ChatMessage = {
      id: uuid(),
      sender: 'tenant',
      text,
      timestamp: now,
    };
    const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
    const juristicMsg: ChatMessage = {
      id: uuid(),
      sender: 'juristic',
      text: reply,
      timestamp: new Date().toISOString(),
    };
    return { tenant: tenantMsg, juristic: juristicMsg };
  },
};
