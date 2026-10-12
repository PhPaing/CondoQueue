import type {
  Repair,
  Bill,
  ChatMessage,
  Tenant,
  MonthlyFee,
  CondoBuilding,
} from './types';

export const tenant: Tenant = {
  name: 'Phone Myat Paing',
  roomNo: '505',
  building: 'The Rich Sathorn Taksin',
  avatar: '',
};

export const buildings: CondoBuilding[] = [
  {
    id: 'b1',
    name: 'The Rich Sathorn Taksin',
    nameTh: 'เดอะ ริช สาทร ตากสิน',
    area: 'Sathorn',
    areaTh: 'สาทร',
  },
  {
    id: 'b2',
    name: 'Rich Park Triple Station',
    nameTh: 'ริช พาร์ค ทริปเปิ้ล สเตชัน',
    area: 'Huay Kwang',
    areaTh: 'ห้วยขวาง',
  },
  {
    id: 'b3',
    name: 'Ashton Silom',
    nameTh: 'แอชตัน สีลม',
    area: 'Silom',
    areaTh: 'สีลม',
  },
  {
    id: 'b4',
    name: 'Noble Around Phloen Chit',
    nameTh: 'โนเบิล อะราวด์ พล็องจิต',
    area: 'Phloen Chit',
    areaTh: 'เพลินจิต',
  },
  {
    id: 'b5',
    name: 'Maestro 19 Ratchada',
    nameTh: 'เมสโตร 19 รัชดา',
    area: 'Ratchada',
    areaTh: 'รัชดาภิเษก',
  },
  {
    id: 'b6',
    name: 'IDEO Mobi Huai Khwang',
    nameTh: 'ไอดีโอ โมบิ ห้วยขวาง',
    area: 'Huay Kwang',
    areaTh: 'ห้วยขวาง',
  },
];

export const seedRepairs: Repair[] = [
  {
    id: 'r-001',
    roomNo: '505',
    category: 'AC',
    description: 'Air conditioner not cooling, blowing warm air only. Daikin inverter unit.',
    status: 'Pending',
    priority: 'High',
    imageUrl: null,
    createdAt: '2026-10-10T09:30:00Z',
    updatedAt: '2026-10-10T09:30:00Z',
  },
  {
    id: 'r-002',
    roomNo: '505',
    category: 'Water',
    description: 'Bathroom sink drain clogged, water backing up slowly.',
    status: 'InProgress',
    priority: 'Medium',
    imageUrl: null,
    createdAt: '2026-10-08T14:20:00Z',
    updatedAt: '2026-10-09T10:00:00Z',
  },
  {
    id: 'r-003',
    roomNo: '505',
    category: 'CommonArea',
    description: 'Hallway light on 5th floor flickering, near elevator B.',
    status: 'Fixed',
    priority: 'Low',
    imageUrl: null,
    createdAt: '2026-10-01T18:45:00Z',
    updatedAt: '2026-10-03T11:00:00Z',
  },
  {
    id: 'r-004',
    roomNo: '505',
    category: 'Electric',
    description: 'Power outlet in bedroom not working, possible short circuit.',
    status: 'Pending',
    priority: 'Urgent',
    imageUrl: null,
    createdAt: '2026-10-11T22:15:00Z',
    updatedAt: '2026-10-11T22:15:00Z',
  },
  {
    id: 'r-005',
    roomNo: '505',
    category: 'AC',
    description: 'AC remote control not responding, batteries replaced already.',
    status: 'Pending',
    priority: 'Low',
    imageUrl: null,
    createdAt: '2026-10-11T08:00:00Z',
    updatedAt: '2026-10-11T08:00:00Z',
  },
];

export const seedBills: Bill[] = [
  {
    id: 'bill-001',
    type: 'CommonFee',
    amount: 1850,
    dueDate: '2026-10-15',
    status: 'Unpaid',
    unit: 'Room 505',
    period: 'October 2026',
    paidAt: null,
  },
  {
    id: 'bill-002',
    type: 'Water',
    amount: 320,
    dueDate: '2026-10-15',
    status: 'Unpaid',
    unit: '42 units',
    period: 'September 2026',
    paidAt: null,
  },
  {
    id: 'bill-003',
    type: 'Electric',
    amount: 280,
    dueDate: '2026-10-05',
    status: 'Overdue',
    unit: '185 kWh',
    period: 'September 2026',
    paidAt: null,
  },
  {
    id: 'bill-004',
    type: 'CommonFee',
    amount: 1850,
    dueDate: '2026-09-15',
    status: 'Paid',
    unit: 'Room 505',
    period: 'September 2026',
    paidAt: '2026-09-12T10:30:00Z',
  },
  {
    id: 'bill-005',
    type: 'Water',
    amount: 285,
    dueDate: '2026-09-15',
    status: 'Paid',
    unit: '38 units',
    period: 'August 2026',
    paidAt: '2026-09-10T14:20:00Z',
  },
  {
    id: 'bill-006',
    type: 'Electric',
    amount: 240,
    dueDate: '2026-09-05',
    status: 'Paid',
    unit: '160 kWh',
    period: 'August 2026',
    paidAt: '2026-09-03T09:15:00Z',
  },
];

export const seedChatMessages: ChatMessage[] = [
  {
    id: 'm-001',
    sender: 'juristic',
    text: 'สวัสดีครับ มีอะไรให้ช่วยไหมครับ? Welcome to CondoQueue!',
    timestamp: '2026-10-09T08:00:00Z',
  },
  {
    id: 'm-002',
    sender: 'tenant',
    text: 'แอร์ห้อง 505 ไม่เย็นเลยครับ รบกวนส่งช่างมาดูให้หน่อย',
    timestamp: '2026-10-10T09:25:00Z',
  },
  {
    id: 'm-003',
    sender: 'juristic',
    text: 'จuristicได้รับเรื่องแล้วครับ จะส่งช่างแอร์ไปตรวจสอบภายใน 24 ชม.ครับ',
    timestamp: '2026-10-10T09:35:00Z',
  },
  {
    id: 'm-004',
    sender: 'tenant',
    text: 'ขอบคุณครับ แล้วท่อน้ำในห้องน้ำก็อุดตันด้วย',
    timestamp: '2026-10-10T14:15:00Z',
  },
];

export const monthlyFees: MonthlyFee[] = [
  { month: 'May', amount: 2150 },
  { month: 'Jun', amount: 2100 },
  { month: 'Jul', amount: 2320 },
  { month: 'Aug', amount: 2095 },
  { month: 'Sep', amount: 2135 },
  { month: 'Oct', amount: 2450 },
];

export const repairCategoryIcons: Record<string, string> = {
  AC: 'ac',
  Water: 'water',
  Electric: 'electric',
  CommonArea: 'common',
};

export const autoReplies: string[] = [
  'Juristic received your request krab. We will check and get back to you within 24 hours.',
  'รับเรื่องแล้วครับ ช่างจะไปตรวจสอบภายใน 24 ชม.ครับ',
  'Juristic received your message krab. We are processing your request now.',
  'ขอบคุณที่แจ้งครับ ทางเราได้รับเรื่องแล้ว จะรีบดำเนินการให้ครับ',
];
