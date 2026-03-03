import { 
  Vehicle, VehicleStatus, Location, User, UserRole, TradeRequest, 
  Transaction, TransactionType, TransactionCategory, ChartOfAccount, 
  AccountType, Invoice, VendorBill, BankAccount, VendorType, BudgetPlan, ContactEntity, EntityCategory, ContactMessage
} from './types';

export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1542362567-b05503f3f5f4?auto=format&fit=crop&q=80&w=800&h=600';

export const MOCK_CHART_OF_ACCOUNTS: ChartOfAccount[] = [
  { code: '1010', name: 'Cash at Bank', type: AccountType.ASSET, balance: 450000, description: 'Primary operating funds' },
  { code: '1200', name: 'Accounts Receivable', type: AccountType.ASSET, balance: 125000, description: 'Unpaid customer invoices' },
  { code: '1400', name: 'Vehicle Inventory', type: AccountType.ASSET, balance: 2450000, description: 'Capitalized cost of cars' },
  { code: '2100', name: 'Accounts Payable', type: AccountType.LIABILITY, balance: 85000, description: 'Unpaid vendor bills' },
  { code: '2300', name: 'VAT Payable/Receivable', type: AccountType.LIABILITY, balance: 12400, description: 'Tax liability tracker' },
  { code: '3000', name: 'Retained Earnings', type: AccountType.EQUITY, balance: 1800000, description: 'Accumulated profits' },
  { code: '4000', name: 'Vehicle Sales Revenue', type: AccountType.REVENUE, balance: 820000, description: 'Gross income from sales' },
  { code: '5100', name: 'Cost of Goods Sold', type: AccountType.EXPENSE, balance: 640000, description: 'Original car acquisition costs' },
  { code: '6200', name: 'Staff Salaries', type: AccountType.EXPENSE, balance: 145000, description: 'Wages and benefits' }
];

export const MOCK_CONTACT_ENTITIES: ContactEntity[] = [
  { id: 'ent-1', name: 'Copart Auctions', category: EntityCategory.VENDOR, email: 'billing@copart.com', phone: '1-800-COPART', address: 'Dallas, TX', createdAt: '2024-01-01' },
  { id: 'ent-2', name: 'Elite Detailing', category: EntityCategory.VENDOR, email: 'service@elitedetailing.ca', phone: '416-555-0122', address: 'Scarborough, ON', createdAt: '2024-02-15' },
  { id: 'ent-3', name: 'Quick Tow Logistics', category: EntityCategory.TRANSPORT, email: 'dispatch@quicktow.ca', phone: '905-555-8899', address: 'Mississauga, ON', createdAt: '2024-03-10' },
  { id: 'ent-4', name: 'Hydro One', category: EntityCategory.UTILITY, email: 'business@hydroone.com', phone: '1-888-664-9376', createdAt: '2024-01-01' },
  { id: 'ent-5', name: 'Jane Doe', category: EntityCategory.CUSTOMER, email: 'jane.doe@gmail.com', createdAt: '2024-02-01' }
];

export const MOCK_BUDGETS: BudgetPlan[] = [
  { periodId: '2025-02', category: TransactionCategory.MARKETING, plannedAmount: 10000, actualAmount: 8500 },
  { periodId: '2025-02', category: TransactionCategory.REPAIR, plannedAmount: 25000, actualAmount: 28400 },
  { periodId: '2025-02', category: TransactionCategory.SALARY, plannedAmount: 150000, actualAmount: 145000 },
  { periodId: '2025-02', category: TransactionCategory.PURCHASE, plannedAmount: 500000, actualAmount: 480000 }
];

export const MOCK_INVOICES: Invoice[] = [
  { 
    id: 'INV-2025-001', date: '2025-02-10', dueDate: '2025-02-24', customerId: 'ent-5', 
    customerName: 'Jane Doe', amount: 58000, taxAmount: 7540, status: 'Paid', 
    items: [{ description: '2021 Ford F-150 Lariat Sale', amount: 58000 }],
    referenceId: 'v-sold-1'
  },
  { 
    id: 'INV-2025-002', date: '2025-02-15', dueDate: '2025-03-01', customerId: 'u4', 
    customerName: 'Robert Smith', amount: 92000, taxAmount: 11960, status: 'Sent', 
    items: [{ description: '2023 GMC Yukon Denali Sale', amount: 92000 }],
    referenceId: 'v1',
    downPayment: 20000, installmentsTotal: 48, installmentsPaid: 0
  }
];

export const MOCK_BILLS: VendorBill[] = [
  { id: 'BILL-001', billNumber: 'CP-88291', postingDate: '2025-02-01', invoiceDate: '2025-02-01', systemEntryDate: '2025-02-01', dueDate: '2025-02-15', vendorName: 'Copart Auctions', vendorType: VendorType.AUCTION, amount: 72000, taxAmount: 0, status: 'Paid', category: TransactionCategory.PURCHASE, referenceId: 'v1' },
  { id: 'BILL-002', billNumber: 'ED-452', postingDate: '2025-02-12', invoiceDate: '2025-02-12', systemEntryDate: '2025-02-12', dueDate: '2025-02-26', vendorName: 'Elite Detailing', vendorType: VendorType.REPAIR, amount: 450, taxAmount: 58.5, status: 'Pending', category: TransactionCategory.DETAIL, referenceId: 'v2' },
  { id: 'BILL-003', billNumber: 'HY-FEB25', postingDate: '2025-02-14', invoiceDate: '2025-02-14', systemEntryDate: '2025-02-14', dueDate: '2025-03-14', vendorName: 'Hydro One', vendorType: VendorType.UTILITIES, amount: 2400, taxAmount: 312, status: 'Pending', category: TransactionCategory.UTILITIES, isSharedExpense: true, allocationMethod: 'UnitCount' }
];

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  { id: 'bank1', name: 'TD Business Operating', institution: 'TD Canada Trust', accountNumber: '****5582', balance: 342000, type: 'Checking' },
  { id: 'bank2', name: 'GCP High-Interest Savings', institution: 'GCP Bank', accountNumber: '****1102', balance: 1200000, type: 'Savings' }
];

export const MOCK_LOCATIONS: Location[] = [
  {
    id: 'loc1',
    name: 'Main Showroom',
    address: '123 Auto Row, Toronto, ON',
    type: 'Showroom',
    phone: '555-0100',
    email: 'sales@oldroad.auto',
    operatingHours: {
      monday: '09:00 AM - 08:00 PM',
      tuesday: '09:00 AM - 08:00 PM',
      wednesday: '09:00 AM - 08:00 PM',
      thursday: '09:00 AM - 08:00 PM',
      friday: '09:00 AM - 08:00 PM',
      saturday: '10:00 AM - 06:00 PM',
      sunday: 'Closed'
    }
  },
  {
    id: 'loc2',
    name: 'East Warehouse',
    address: '456 Industrial Pkwy, Oshawa, ON',
    type: 'Warehouse',
    phone: '555-0200',
    email: 'storage@oldroad.auto',
    operatingHours: {
      monday: '08:00 AM - 04:00 PM',
      tuesday: '08:00 AM - 04:00 PM',
      wednesday: '08:00 AM - 04:00 PM',
      thursday: '08:00 AM - 04:00 PM',
      friday: '08:00 AM - 04:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    }
  }
];

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    vin: '1GKS2CKC6LR123456',
    year: 2009,
    make: 'Porsche',
    model: 'Boxster Base',
    trim: 'Convertible',
    color: 'Guards Red',
    bodyStyle: 'Convertible',
    fuelType: 'Gas',
    km: 5200,
    price: 44995,
    status: VehicleStatus.READY,
    ribbon: 'Just Arrived',
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'],
    location: 'Main Showroom',
    transmission: '6-Speed Manual',
    drivetrain: 'RWD',
    engine: '2.7L Straight Six',
    carfaxUrl: 'https://www.carfax.com/demo',
    isCarfaxOneOwner: true,
    features: { exterior: [], interior: [], infotainment: [], safety: [] },
    accessories: []
  },
  {
    id: 'v2',
    vin: '2T3P1RFV5MW654321',
    year: 2009,
    make: 'Porsche',
    model: 'Boxster Base',
    trim: 'Red Convertible',
    color: 'Red',
    bodyStyle: 'Convertible',
    fuelType: 'Gas',
    km: 126273,
    price: 19995,
    status: VehicleStatus.READY,
    ribbon: 'Clearout',
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'],
    location: 'Main Showroom',
    transmission: '5-Speed Manual',
    drivetrain: 'RWD',
    engine: '2.9L Mid-Engine...',
    carfaxUrl: 'https://www.carfax.com/demo',
    isCarfaxOneOwner: true,
    features: { exterior: [], interior: [], infotainment: [], safety: [] },
    accessories: []
  },
  {
    id: 'v3',
    vin: 'PORSCHE-SOLD-123',
    year: 2012,
    make: 'Porsche',
    model: 'Boxster S',
    trim: 'Convertible',
    color: 'Carrara White',
    bodyStyle: 'Convertible',
    fuelType: 'Gas',
    km: 23000,
    price: 48100,
    status: VehicleStatus.SOLD,
    images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800'],
    location: 'Main Showroom',
    transmission: '6-Speed Manual',
    drivetrain: 'RWD',
    engine: '2.7L Straight Six',
    carfaxUrl: 'https://www.carfax.com/demo',
    isCarfaxOneOwner: true,
    features: { exterior: [], interior: [], infotainment: [], safety: [] },
    accessories: []
  },
  {
    id: 'v4',
    vin: 'TURBO-INV-999',
    year: 2009,
    make: 'Porsche',
    model: 'Carrera 4S Turbo',
    trim: 'Convertible',
    color: 'Racing Yellow',
    bodyStyle: 'Convertible',
    fuelType: 'Gas',
    km: 15000,
    price: 125000,
    status: VehicleStatus.READY,
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800'],
    location: 'East Warehouse',
    transmission: 'PDK Dual-Clutch',
    drivetrain: 'AWD',
    engine: '3.8L Flat Six',
    isCarfaxOneOwner: false,
    features: { exterior: [], interior: [], infotainment: [], safety: [] },
    accessories: []
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    postingDate: '2025-01-10',
    invoiceDate: '2025-01-08',
    systemEntryDate: '2025-01-10',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.PURCHASE,
    amount: 72000,
    taxAmount: 0,
    description: 'Initial purchase from Auction',
    locationId: 'loc2',
    referenceId: 'v1',
    accountCode: '5100',
    periodId: '2025-01'
  },
  {
    id: 't3',
    postingDate: '2025-02-01',
    invoiceDate: '2025-01-31',
    systemEntryDate: '2025-02-01',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.SALARY,
    amount: 5500,
    taxAmount: 0,
    description: 'Monthly Salary - John Seller',
    locationId: 'loc1',
    referenceId: 'u2',
    accountCode: '6200',
    periodId: '2025-02'
  },
  {
    id: 't5',
    postingDate: '2025-02-15',
    invoiceDate: '2025-02-15',
    systemEntryDate: '2025-02-15',
    type: TransactionType.INCOME,
    category: TransactionCategory.SALE,
    amount: 58000,
    taxAmount: 7540,
    description: 'Final Sale to Jane Doe',
    locationId: 'loc1',
    referenceId: 'v-sold-1',
    accountCode: '4000',
    periodId: '2025-02'
  }
];

export const MOCK_TRADE_REQUESTS: TradeRequest[] = [
  {
    id: 'TR-101',
    customerId: 'u3',
    customerName: 'Jane Doe',
    customerEmail: 'customer@gmail.com',
    vin: '1HGCM82633A004321',
    year: 2021,
    make: 'Honda',
    model: 'Civic',
    km: 25000,
    condition: 'Great condition, no accidents.',
    status: 'Pending',
    requestDate: '2023-10-25'
  }
];

export const MOCK_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    fullName: 'David Miller',
    email: 'david.miller@example.com',
    subject: 'Vehicle Sales',
    message: 'I am interested in the 2009 Porsche Boxster. Is it still available for a test drive this weekend?',
    status: 'New',
    createdAt: '2025-02-28T10:30:00Z'
  },
  {
    id: 'msg-2',
    fullName: 'Sarah Wilson',
    email: 'sarah.w@gmail.com',
    subject: 'General Inquiry',
    message: 'Do you offer financing for out-of-province buyers? I am located in Quebec.',
    status: 'Read',
    createdAt: '2025-02-27T14:15:00Z'
  }
];

export interface DispatchArrival {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  vin: string;
  lotNumber: string;
  status: 'Pending' | 'Paid' | 'Picked Up' | 'Delivered' | 'Fixing' | 'Ready to Sell';
}

export const MOCK_DISPATCH_ARRIVALS: DispatchArrival[] = [
  { id: 'arr-1', year: 2023, make: 'Ford', model: 'F-150', trim: 'Lariat', vin: '1FTF...', lotNumber: '558291', status: 'Ready to Sell' },
  { id: 'arr-2', year: 2022, make: 'BMW', model: 'X5', trim: 'xDrive40i', vin: '5UXW...', lotNumber: '110293', status: 'Fixing' },
  { id: 'arr-3', year: 2024, make: 'Toyota', model: 'Camry', trim: 'XSE Hybrid', vin: '4T1B...', lotNumber: '992012', status: 'Ready to Sell' },
  { id: 'arr-4', year: 2021, make: 'Honda', model: 'Civic', trim: 'Sport', vin: '1HGC...', lotNumber: '228391', status: 'Delivered' }
];
