export type RepairStatus = 'Pending' | 'InProgress' | 'Fixed';
export type RepairPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type RepairCategory = 'AC' | 'Water' | 'Electric' | 'CommonArea';
export type BillType = 'Water' | 'Electric' | 'CommonFee';
export type BillStatus = 'Unpaid' | 'Paid' | 'Overdue';
export type Language = 'en' | 'th';

export interface Repair {
  id: string;
  roomNo: string;
  category: RepairCategory;
  description: string;
  status: RepairStatus;
  priority: RepairPriority;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: string;
  type: BillType;
  amount: number;
  dueDate: string;
  status: BillStatus;
  unit: string;
  period: string;
  paidAt: string | null;
}

export interface ChatMessage {
  id: string;
  sender: 'tenant' | 'juristic';
  text: string;
  timestamp: string;
}

export interface Tenant {
  name: string;
  roomNo: string;
  building: string;
  avatar: string;
}

export interface MonthlyFee {
  month: string;
  amount: number;
}

export interface CondoBuilding {
  id: string;
  name: string;
  nameTh: string;
  area: string;
  areaTh: string;
}
