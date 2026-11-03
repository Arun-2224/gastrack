// Realistic in-memory & localStorage mock service for live demo on static hosting (GitHub Pages)

export const DEMO_USERS = [
  {
    id: 'u-admin-1',
    _id: 'u-admin-1',
    name: 'Alexander Pierce',
    email: 'admin@gastrack.com',
    role: 'ADMIN',
    phone: '+1 (555) 000-0001',
    status: 'ACTIVE',
  },
  {
    id: 'u-mgr-1',
    _id: 'u-mgr-1',
    name: 'Sarah Jenkins',
    email: 'manager1@gastrack.com',
    role: 'MANAGER',
    phone: '+1 (555) 000-0002',
    status: 'ACTIVE',
  },
  {
    id: 'u-del-1',
    _id: 'u-del-1',
    name: 'Carlos Mendez',
    email: 'delivery1@gastrack.com',
    role: 'DELIVERY_STAFF',
    phone: '+1 (555) 100-0001',
    status: 'ACTIVE',
  },
  {
    id: 'u-inv-1',
    _id: 'u-inv-1',
    name: 'Rajesh Patel',
    email: 'inventory1@gastrack.com',
    role: 'INVENTORY_STAFF',
    phone: '+1 (555) 200-0001',
    status: 'ACTIVE',
  },
  {
    id: 'u-mnt-1',
    _id: 'u-mnt-1',
    name: 'Viktor Kowalski',
    email: 'maint1@gastrack.com',
    role: 'MAINTENANCE_STAFF',
    phone: '+1 (555) 300-0001',
    status: 'ACTIVE',
  },
];

export const DEMO_CUSTOMERS = [
  {
    _id: 'cust-1',
    customerId: 'CUST-1001',
    name: 'Apex Culinary & Grill',
    phone: '+1 (555) 301-4455',
    email: 'kitchen@apexgrill.com',
    address: '142 Market Street, Commercial Hub',
    city: 'Metro City',
    state: 'State',
    postalCode: '10001',
    customerType: 'COMMERCIAL',
    status: 'ACTIVE',
    cylinderCount: 8,
    outstandingBalance: 320,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'cust-2',
    customerId: 'CUST-1002',
    name: 'Eleanor Vance',
    phone: '+1 (555) 412-8899',
    email: 'eleanor.v@homemail.com',
    address: '77 Maple Ridge Way, Apt 4B',
    city: 'Metro City',
    state: 'State',
    postalCode: '10012',
    customerType: 'HOUSEHOLD',
    status: 'ACTIVE',
    cylinderCount: 1,
    outstandingBalance: 0,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'cust-3',
    customerId: 'CUST-1003',
    name: 'Titan Metallurgy Works',
    phone: '+1 (555) 902-1144',
    email: 'procurement@titanmetal.com',
    address: 'Industrial Plot 9B, Sector 7',
    city: 'Metro City',
    state: 'State',
    postalCode: '10045',
    customerType: 'INDUSTRIAL',
    status: 'ACTIVE',
    cylinderCount: 24,
    outstandingBalance: 1450,
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'cust-4',
    customerId: 'CUST-1004',
    name: 'Grand Hyatt Banquet & Bistro',
    phone: '+1 (555) 773-2211',
    email: 'logistics@grandhyattdining.com',
    address: '500 Skyline Boulevard',
    city: 'Metro City',
    state: 'State',
    postalCode: '10002',
    customerType: 'COMMERCIAL',
    status: 'ACTIVE',
    cylinderCount: 12,
    outstandingBalance: 0,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'cust-5',
    customerId: 'CUST-1005',
    name: 'Marcus & Clara Wright',
    phone: '+1 (555) 662-7733',
    email: 'marcus.wright@gmail.com',
    address: '18 Pinewood Crescent',
    city: 'Metro City',
    state: 'State',
    postalCode: '10018',
    customerType: 'HOUSEHOLD',
    status: 'ACTIVE',
    cylinderCount: 2,
    outstandingBalance: 45,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEMO_CYLINDERS = [
  {
    _id: 'cyl-1',
    cylinderId: 'GT-DOM-001',
    serialNumber: 'SN-7840192',
    cylinderType: 'DOMESTIC_14_2KG',
    capacity: 14.2,
    brand: 'BharatGas',
    status: 'AVAILABLE',
    condition: 'GOOD',
    currentLocation: { _id: 'loc-1', name: 'Main Central Warehouse', type: 'MAIN_WAREHOUSE' },
    currentCustomer: null,
    refillCount: 14,
    lastRefillDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    lastInspectionDate: new Date(Date.now() - 60 * 86400000).toISOString(),
    nextInspectionDate: new Date(Date.now() + 120 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 300 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'cyl-2',
    cylinderId: 'GT-COM-044',
    serialNumber: 'SN-9921405',
    cylinderType: 'COMMERCIAL_19KG',
    capacity: 19.0,
    brand: 'Indane',
    status: 'DELIVERED',
    condition: 'GOOD',
    currentLocation: { _id: 'loc-cust-1', name: 'Apex Culinary & Grill', type: 'CUSTOMER' },
    currentCustomer: {
      _id: 'cust-1',
      customerId: 'CUST-1001',
      name: 'Apex Culinary & Grill',
      phone: '+1 (555) 301-4455',
      customerType: 'COMMERCIAL',
    },
    refillCount: 22,
    lastRefillDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    lastInspectionDate: new Date(Date.now() - 90 * 86400000).toISOString(),
    nextInspectionDate: new Date(Date.now() + 90 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 400 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'cyl-3',
    cylinderId: 'GT-IND-108',
    serialNumber: 'SN-3391048',
    cylinderType: 'INDUSTRIAL_47_5KG',
    capacity: 47.5,
    brand: 'HP Gas',
    status: 'IN_REFILL',
    condition: 'GOOD',
    currentLocation: { _id: 'loc-plant-1', name: 'Apex Refill Plant Site', type: 'REFILL_PLANT' },
    currentCustomer: null,
    refillCount: 31,
    lastRefillDate: new Date(Date.now() - 25 * 86400000).toISOString(),
    lastInspectionDate: new Date(Date.now() - 110 * 86400000).toISOString(),
    nextInspectionDate: new Date(Date.now() + 70 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 600 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'cyl-4',
    cylinderId: 'GT-DOM-089',
    serialNumber: 'SN-6651230',
    cylinderType: 'DOMESTIC_14_2KG',
    capacity: 14.2,
    brand: 'Indane',
    status: 'EMPTY',
    condition: 'FAIR',
    currentLocation: { _id: 'loc-2', name: 'Secondary East Depot', type: 'SECONDARY_WAREHOUSE' },
    currentCustomer: null,
    refillCount: 18,
    lastRefillDate: new Date(Date.now() - 40 * 86400000).toISOString(),
    lastInspectionDate: new Date(Date.now() - 150 * 86400000).toISOString(),
    nextInspectionDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 350 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'cyl-5',
    cylinderId: 'GT-COM-012',
    serialNumber: 'SN-1124901',
    cylinderType: 'COMMERCIAL_19KG',
    capacity: 19.0,
    brand: 'BharatGas',
    status: 'MAINTENANCE',
    condition: 'DAMAGED',
    currentLocation: { _id: 'loc-maint-1', name: 'Metro Maintenance Center', type: 'MAINTENANCE_CENTER' },
    currentCustomer: null,
    refillCount: 29,
    lastRefillDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    lastInspectionDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    nextInspectionDate: new Date(Date.now() + 170 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 500 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'cyl-6',
    cylinderId: 'GT-CMP-003',
    serialNumber: 'SN-5582910',
    cylinderType: 'CAMPING_5KG',
    capacity: 5.0,
    brand: 'HP Gas',
    status: 'FILLED',
    condition: 'GOOD',
    currentLocation: { _id: 'loc-1', name: 'Main Central Warehouse', type: 'MAIN_WAREHOUSE' },
    currentCustomer: null,
    refillCount: 9,
    lastRefillDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    lastInspectionDate: new Date(Date.now() - 45 * 86400000).toISOString(),
    nextInspectionDate: new Date(Date.now() + 135 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEMO_DELIVERIES = [
  {
    _id: 'del-1',
    deliveryId: 'DEL-2026-081',
    customer: DEMO_CUSTOMERS[0],
    deliveryStaff: {
      _id: 'u-del-1',
      name: 'Carlos Mendez',
      phone: '+1 (555) 100-0001',
      email: 'delivery1@gastrack.com',
      role: 'DELIVERY_STAFF',
    },
    scheduledDate: new Date().toISOString(),
    cylinder: DEMO_CYLINDERS[1],
    quantity: 4,
    deliveryAddress: '142 Market Street, Commercial Hub',
    paymentStatus: 'PAID',
    deliveryStatus: 'DELIVERED',
    paymentAmount: 320,
    notes: 'Delivered to kitchen loading bay.',
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'del-2',
    deliveryId: 'DEL-2026-082',
    customer: DEMO_CUSTOMERS[1],
    deliveryStaff: {
      _id: 'u-del-1',
      name: 'Carlos Mendez',
      phone: '+1 (555) 100-0001',
      email: 'delivery1@gastrack.com',
      role: 'DELIVERY_STAFF',
    },
    scheduledDate: new Date().toISOString(),
    cylinder: DEMO_CYLINDERS[0],
    quantity: 1,
    deliveryAddress: '77 Maple Ridge Way, Apt 4B',
    paymentStatus: 'PAID',
    deliveryStatus: 'OUT_FOR_DELIVERY',
    paymentAmount: 48,
    notes: 'Call customer 10 mins before arrival.',
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'del-3',
    deliveryId: 'DEL-2026-083',
    customer: DEMO_CUSTOMERS[2],
    deliveryStaff: {
      _id: 'u-del-1',
      name: 'Carlos Mendez',
      phone: '+1 (555) 100-0001',
      email: 'delivery1@gastrack.com',
      role: 'DELIVERY_STAFF',
    },
    scheduledDate: new Date(Date.now() + 86400000).toISOString(),
    cylinder: DEMO_CYLINDERS[2],
    quantity: 6,
    deliveryAddress: 'Industrial Plot 9B, Sector 7',
    paymentStatus: 'UNPAID',
    deliveryStatus: 'ASSIGNED',
    paymentAmount: 850,
    notes: 'Forklift required for unloading 47.5kg cylinders.',
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEMO_PLANTS = [
  {
    _id: 'plant-1',
    name: 'Apex Gas Bottling & Refill Terminal',
    code: 'APEX-01',
    address: 'Plot 12, Heavy Chemical Zone, Suburbs',
    contactPerson: 'David Miller',
    phone: '+1 (555) 234-5678',
    email: 'operations@apexrefill.com',
    capacity: 1200,
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 200 * 86400000).toISOString(),
  },
  {
    _id: 'plant-2',
    name: 'Horizon Cryo Refill Infrastructure',
    code: 'HORIZON-02',
    address: '88 Energy Highway, Port District',
    contactPerson: 'Elena Rostova',
    phone: '+1 (555) 876-5432',
    email: 'logistics@horizoncryo.com',
    capacity: 800,
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
  },
];

export const DEMO_BATCHES = [
  {
    _id: 'batch-1',
    batchId: 'BATCH-2026-039',
    refillPlant: DEMO_PLANTS[0],
    cylinders: [DEMO_CYLINDERS[2]],
    createdDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    expectedCompletionDate: new Date(Date.now() + 1 * 86400000).toISOString(),
    status: 'IN_PROGRESS',
    notes: 'Bulk refill order for Industrial Grade 47.5kg units.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    _id: 'batch-2',
    batchId: 'BATCH-2026-038',
    refillPlant: DEMO_PLANTS[1],
    cylinders: [DEMO_CYLINDERS[0]],
    createdDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    completionDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: 'COMPLETED',
    notes: 'Domestic 14.2kg rapid refill batch.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

export const DEMO_MAINTENANCE = [
  {
    _id: 'maint-job-1',
    maintenanceId: 'MNT-2026-015',
    cylinder: DEMO_CYLINDERS[4],
    maintenanceType: 'VALVE_REPLACEMENT',
    description: 'High-pressure test indicated slight valve collar leakage. Valve unit replaced with brass seal.',
    technician: {
      _id: 'u-mnt-1',
      name: 'Viktor Kowalski',
      email: 'maint1@gastrack.com',
      phone: '+1 (555) 300-0001',
      role: 'MAINTENANCE_STAFF',
    },
    startDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    completionDate: '' as string | undefined,
    cost: 38,
    status: 'IN_PROGRESS',
    notes: 'Awaiting secondary hydrostatic certification.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const DEMO_INSPECTIONS = [
  {
    _id: 'insp-1',
    inspectionId: 'INSP-2026-001',
    cylinder: DEMO_CYLINDERS[0],
    inspector: DEMO_USERS[4],
    inspectionDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    inspectionType: 'ROUTINE',
    leakTest: 'PASSED',
    valveCondition: 'GOOD',
    bodyCondition: 'GOOD',
    corrosion: 'NONE',
    pressureTest: 'PASSED',
    safetySeal: 'INTACT',
    overallCondition: 'GOOD',
    result: 'PASSED',
    remarks: 'Standard certification passed with zero leak rate.',
    nextInspectionDate: new Date(Date.now() + 180 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    _id: 'insp-2',
    inspectionId: 'INSP-2026-002',
    cylinder: DEMO_CYLINDERS[1],
    inspector: DEMO_USERS[4],
    inspectionDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    inspectionType: 'PERIODIC_STATUTORY',
    leakTest: 'PASSED',
    valveCondition: 'GOOD',
    bodyCondition: 'GOOD',
    corrosion: 'SURFACE',
    pressureTest: 'PASSED',
    safetySeal: 'INTACT',
    overallCondition: 'GOOD',
    result: 'PASSED',
    remarks: 'Hydrostatic pressure passed within safety margin.',
    nextInspectionDate: new Date(Date.now() + 365 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    _id: 'insp-3',
    inspectionId: 'INSP-2026-003',
    cylinder: DEMO_CYLINDERS[4],
    inspector: DEMO_USERS[4],
    inspectionDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    inspectionType: 'INCIDENT_CHECK',
    leakTest: 'FAILED',
    valveCondition: 'DEFECTIVE',
    bodyCondition: 'DENTED',
    corrosion: 'NONE',
    pressureTest: 'FAILED',
    safetySeal: 'BROKEN',
    overallCondition: 'POOR',
    result: 'NEEDS_MAINTENANCE',
    remarks: 'Collar seal micro-leakage detected. Routed to maintenance.',
    nextInspectionDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

export const DEMO_PAYMENTS = [
  {
    _id: 'pay-1',
    paymentId: 'PAY-2026-101',
    customer: {
      _id: 'cust-1',
      customerId: 'CUST-1001',
      name: 'Apex Culinary & Grill',
      phone: '+1 (555) 301-4455',
    },
    amount: 320,
    paymentMethod: 'UPI',
    status: 'COMPLETED',
    recordedBy: {
      _id: 'u-admin-1',
      name: 'Alexander Pierce',
      role: 'ADMIN',
    },
    paymentDate: new Date(Date.now() - 1 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    _id: 'pay-2',
    paymentId: 'PAY-2026-102',
    customer: {
      _id: 'cust-2',
      customerId: 'CUST-1002',
      name: 'Eleanor Vance',
      phone: '+1 (555) 412-8899',
    },
    amount: 48,
    paymentMethod: 'CARD',
    status: 'COMPLETED',
    recordedBy: {
      _id: 'u-del-1',
      name: 'Carlos Mendez',
      role: 'DELIVERY_STAFF',
    },
    paymentDate: new Date(Date.now() - 2 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
];

export const DEMO_AUDIT_LOGS = [
  {
    _id: 'audit-1',
    user: {
      _id: 'u-admin-1',
      name: 'Alexander Pierce',
      email: 'admin@gastrack.com',
      role: 'ADMIN',
    },
    action: 'CYLINDER_STATUS_CHANGE',
    entity: 'Cylinder',
    entityId: 'GT-DOM-001',
    description: 'Updated cylinder status to AVAILABLE after depot intake inspection.',
    ipAddress: '192.168.1.45',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    _id: 'audit-2',
    user: {
      _id: 'u-del-1',
      name: 'Carlos Mendez',
      email: 'delivery1@gastrack.com',
      role: 'DELIVERY_STAFF',
    },
    action: 'DELIVERY_COMPLETED',
    entity: 'Delivery',
    entityId: 'DEL-2026-081',
    description: 'Delivered 4x Commercial 19kg Cylinders to Apex Culinary & Grill.',
    ipAddress: '172.56.21.90',
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
  },
];

export const DEMO_NOTIFICATIONS = [
  {
    _id: 'notif-1',
    title: 'Hydrostatic Recertification Due',
    message: '12 commercial cylinders due for inspection within 14 days.',
    type: 'WARNING',
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    _id: 'notif-2',
    title: 'New Refill Batch Dispatched',
    message: 'Batch BATCH-2026-039 is currently in progress at Apex Terminal.',
    type: 'INFO',
    read: false,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
];

// Handles in-browser API mock responses with localStorage persistence
const CYLINDERS_STORAGE_KEY = 'gastrack_mock_cylinders';
const INSPECTIONS_STORAGE_KEY = 'gastrack_mock_inspections';
const MAINTENANCE_STORAGE_KEY = 'gastrack_mock_maintenance';
const PAYMENTS_STORAGE_KEY = 'gastrack_mock_payments';

function getLiveCylinders(): typeof DEMO_CYLINDERS {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CYLINDERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored cylinders', e);
    }
  }
  return DEMO_CYLINDERS;
}

function saveLiveCylinders(cylinders: typeof DEMO_CYLINDERS) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CYLINDERS_STORAGE_KEY, JSON.stringify(cylinders));
    } catch (e) {
      console.warn('Failed to persist cylinders', e);
    }
  }
}

function getLiveInspections(): typeof DEMO_INSPECTIONS {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(INSPECTIONS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored inspections', e);
    }
  }
  return DEMO_INSPECTIONS;
}

function saveLiveInspections(inspections: typeof DEMO_INSPECTIONS) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(INSPECTIONS_STORAGE_KEY, JSON.stringify(inspections));
    } catch (e) {
      console.warn('Failed to persist inspections', e);
    }
  }
}

function getLiveMaintenance(): typeof DEMO_MAINTENANCE {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(MAINTENANCE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored maintenance', e);
    }
  }
  return DEMO_MAINTENANCE;
}

function saveLiveMaintenance(jobs: typeof DEMO_MAINTENANCE) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(jobs));
    } catch (e) {
      console.warn('Failed to persist maintenance', e);
    }
  }
}

function getLivePayments(): typeof DEMO_PAYMENTS {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(PAYMENTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored payments', e);
    }
  }
  return DEMO_PAYMENTS;
}

function saveLivePayments(payments: typeof DEMO_PAYMENTS) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
    } catch (e) {
      console.warn('Failed to persist payments', e);
    }
  }
}

export function handleMockApi(endpoint: string, options: RequestInit = {}): any {
  const method = (options.method || 'GET').toUpperCase();
  const cleanEndpoint = endpoint.split('?')[0];
  const body = options.body ? JSON.parse(options.body as string) : {};

  // 1. Auth Login
  if (cleanEndpoint === '/auth/login' && method === 'POST') {
    const email = body.email || 'admin@gastrack.com';
    const foundUser =
      DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
        id: 'u-custom',
        _id: 'u-custom',
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: 'ADMIN',
        phone: '+1 (555) 000-9999',
        status: 'ACTIVE',
      };

    return {
      success: true,
      token: 'demo-jwt-gastrack-token',
      user: foundUser,
    };
  }

  // 2. Auth Current User (/auth/me)
  if (cleanEndpoint === '/auth/me') {
    return {
      success: true,
      user: DEMO_USERS[0],
    };
  }

  // 3. Auth Users List
  if (cleanEndpoint === '/auth/users') {
    return {
      success: true,
      users: DEMO_USERS,
    };
  }

  // 4. Dashboard Summary
  if (cleanEndpoint === '/dashboard/summary') {
    const liveCyls = getLiveCylinders();
    const liveJobs = getLiveMaintenance();
    const liveInsps = getLiveInspections();
    const livePayments = getLivePayments();

    const available = liveCyls.filter((c: any) => c.status === 'AVAILABLE' || c.status === 'FILLED').length;
    const inCustomer = liveCyls.filter((c: any) => c.status === 'DELIVERED').length;
    const inRefill = liveCyls.filter((c: any) => c.status === 'IN_REFILL').length;
    const inInspection = liveCyls.filter((c: any) => c.status === 'INSPECTION').length;
    const inMaint = liveCyls.filter((c: any) => c.status === 'MAINTENANCE').length;
    const damagedLost = liveCyls.filter((c: any) => c.status === 'DAMAGED' || c.status === 'LOST' || c.status === 'RETIRED').length;

    const inspPassed = liveInsps.filter((i: any) => i.result === 'PASSED').length;
    const inspNeedsMaint = liveInsps.filter((i: any) => i.result === 'NEEDS_MAINTENANCE' || i.result === 'FAILED').length;
    const inspCondemned = liveInsps.filter((i: any) => i.result === 'REJECTED').length;

    const totalRealizedRevenue = livePayments
      .filter((p: any) => p.status === 'COMPLETED')
      .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);

    const totalOutstanding = DEMO_CUSTOMERS.reduce(
      (sum: number, c: any) => sum + (Number(c.outstandingBalance) || 0),
      0
    );

    return {
      success: true,
      summary: {
        totalCylinders: liveCyls.length,
        availableCylinders: available,
        inCustomerHands: inCustomer,
        inRefill: inRefill,
        inInspection: inInspection,
        inMaintenance: inMaint,
        damagedOrLost: damagedLost,
        totalCustomers: DEMO_CUSTOMERS.length,
        deliveriesToday: 24,
        completedToday: 19,
        totalRevenue: totalRealizedRevenue,
        totalOutstanding: totalOutstanding,
      },
      cylinderDistribution: [
        { name: 'Available', value: available, color: '#10b981' },
        { name: 'With Customers', value: inCustomer, color: '#3b82f6' },
        { name: 'In Refill', value: inRefill, color: '#f59e0b' },
        { name: 'In Inspection', value: inInspection, color: '#8b5cf6' },
        { name: 'In Maintenance', value: inMaint, color: '#ef4444' },
      ],
      deliveryTrends: [
        { _id: 'Mon', totalScheduled: 18, delivered: 18 },
        { _id: 'Tue', totalScheduled: 22, delivered: 21 },
        { _id: 'Wed', totalScheduled: 25, delivered: 24 },
        { _id: 'Thu', totalScheduled: 20, delivered: 19 },
        { _id: 'Fri', totalScheduled: 28, delivered: 26 },
        { _id: 'Sat', totalScheduled: 15, delivered: 15 },
        { _id: 'Sun', totalScheduled: 12, delivered: 12 },
      ],
      revenueTrends: [
        { _id: 'Week 1', revenue: 6200 },
        { _id: 'Week 2', revenue: 7100 },
        { _id: 'Week 3', revenue: 6850 },
        { _id: 'Week 4', revenue: 8300 },
      ],
      inspectionSummary: {
        PASSED: inspPassed,
        REQUIRES_MAINTENANCE: inspNeedsMaint,
        CONDEMNED: inspCondemned,
      },
      recentDeliveries: DEMO_DELIVERIES,
      recentAlerts: DEMO_NOTIFICATIONS,
    };
  }

  // 5. Cylinders
  if (cleanEndpoint === '/cylinders') {
    const liveCyls = getLiveCylinders();
    if (method === 'POST') {
      const newCylinder = {
        _id: `cyl-${Date.now()}`,
        cylinderId: body.cylinderId || `CYL-${String(liveCyls.length + 1).padStart(4, '0')}`,
        serialNumber: body.serialNumber || `SN-${Math.floor(1000000 + Math.random() * 9000000)}`,
        cylinderType: body.cylinderType || 'DOMESTIC_14_2KG',
        capacity: Number(body.capacity) || 14.2,
        brand: body.brand || 'GasTrack SuperGas',
        status: body.status || 'AVAILABLE',
        condition: body.condition || 'GOOD',
        currentLocation: { _id: 'loc-1', name: 'Main Central Warehouse', type: 'MAIN_WAREHOUSE' },
        currentCustomer: null,
        refillCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      liveCyls.unshift(newCylinder as any);
      saveLiveCylinders(liveCyls);
      return { success: true, cylinder: newCylinder };
    }

    const urlParams = new URLSearchParams(endpoint.includes('?') ? endpoint.split('?')[1] : '');
    const search = (urlParams.get('search') || '').toLowerCase().trim();
    const statusFilter = urlParams.get('status') || 'ALL';
    const conditionFilter = urlParams.get('condition') || 'ALL';
    const typeFilter = urlParams.get('cylinderType') || 'ALL';

    let filtered = liveCyls;
    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.serialNumber?.toLowerCase().includes(search) ||
          c.cylinderId?.toLowerCase().includes(search) ||
          c.brand?.toLowerCase().includes(search)
      );
    }
    if (statusFilter && statusFilter !== 'ALL') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }
    if (conditionFilter && conditionFilter !== 'ALL') {
      filtered = filtered.filter((c) => c.condition === conditionFilter);
    }
    if (typeFilter && typeFilter !== 'ALL') {
      filtered = filtered.filter((c) => c.cylinderType === typeFilter);
    }

    return {
      success: true,
      data: filtered,
      pagination: { page: 1, limit: 50, total: filtered.length, pages: 1 },
    };
  }

  if (cleanEndpoint === '/cylinders/stats') {
    const liveCyls = getLiveCylinders();
    const byStatus: Record<string, number> = {};
    const byCondition: Record<string, number> = {};
    const byType: Record<string, number> = {};

    liveCyls.forEach((c) => {
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      byCondition[c.condition] = (byCondition[c.condition] || 0) + 1;
      byType[c.cylinderType] = (byType[c.cylinderType] || 0) + 1;
    });

    return {
      success: true,
      stats: {
        total: liveCyls.length,
        byStatus,
        byCondition,
        byType,
      },
    };
  }

  // Cylinder status transition
  if (cleanEndpoint.startsWith('/cylinders/') && cleanEndpoint.endsWith('/status')) {
    const id = cleanEndpoint.split('/')[2];
    const liveCyls = getLiveCylinders();
    const target = liveCyls.find((c) => c._id === id || c.cylinderId === id);
    if (target) {
      target.status = body.status || target.status;
      if (body.condition) target.condition = body.condition;
      target.updatedAt = new Date().toISOString();
      saveLiveCylinders(liveCyls);
    }
    return { success: true, message: 'Status updated successfully', cylinder: target || liveCyls[0] };
  }

  // 6. Customers
  if (cleanEndpoint === '/customers') {
    if (method === 'POST') {
      const newCust = {
        _id: `cust-${Date.now()}`,
        customerId: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        name: body.name || 'New Customer',
        phone: body.phone || '+1 (555) 000-0000',
        email: body.email,
        address: body.address || 'Address',
        city: body.city || 'Metro City',
        state: 'State',
        postalCode: '10001',
        customerType: body.customerType || 'HOUSEHOLD',
        status: 'ACTIVE',
        cylinderCount: 0,
        outstandingBalance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      DEMO_CUSTOMERS.unshift(newCust as any);
      return { success: true, customer: newCust };
    }
    return {
      success: true,
      data: DEMO_CUSTOMERS,
      pagination: { page: 1, limit: 20, total: DEMO_CUSTOMERS.length, pages: 1 },
    };
  }

  if (cleanEndpoint === '/customers/stats') {
    return {
      success: true,
      stats: {
        total: DEMO_CUSTOMERS.length,
        byType: { HOUSEHOLD: 2, COMMERCIAL: 2, INDUSTRIAL: 1 },
        totalOutstanding: 1815,
      },
    };
  }

  // 7. Deliveries
  if (cleanEndpoint === '/deliveries') {
    if (method === 'POST') {
      const newDel = {
        _id: `del-${Date.now()}`,
        deliveryId: `DEL-2026-${Math.floor(100 + Math.random() * 900)}`,
        customer: DEMO_CUSTOMERS[0],
        deliveryStaff: DEMO_USERS[2],
        scheduledDate: body.scheduledDate || new Date().toISOString(),
        quantity: body.quantity || 1,
        deliveryAddress: body.deliveryAddress || 'Metro City',
        paymentStatus: 'UNPAID',
        deliveryStatus: 'PENDING',
        paymentAmount: body.paymentAmount || 50,
        notes: body.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      DEMO_DELIVERIES.unshift(newDel as any);
      return { success: true, delivery: newDel };
    }
    return {
      success: true,
      data: DEMO_DELIVERIES,
      pagination: { page: 1, limit: 20, total: DEMO_DELIVERIES.length, pages: 1 },
    };
  }

  if (cleanEndpoint === '/deliveries/stats') {
    return {
      success: true,
      stats: {
        total: DEMO_DELIVERIES.length,
        byStatus: { DELIVERED: 1, OUT_FOR_DELIVERY: 1, ASSIGNED: 1 },
        scheduledToday: 2,
        deliveredToday: 1,
      },
    };
  }

  // 8. Refill Plants & Batches
  if (cleanEndpoint === '/refill/plants') {
    return { success: true, plants: DEMO_PLANTS };
  }

  if (cleanEndpoint === '/refill/batches') {
    return {
      success: true,
      data: DEMO_BATCHES,
      pagination: { page: 1, limit: 20, total: DEMO_BATCHES.length, pages: 1 },
    };
  }

  // 9. Maintenance
  if (cleanEndpoint === '/maintenance') {
    const liveJobs = getLiveMaintenance();
    if (method === 'POST') {
      const liveCyls = getLiveCylinders();
      const targetCyl = liveCyls.find((c: any) => c._id === body.cylinderId || c.cylinderId === body.cylinderId) || liveCyls[0];
      const technician = DEMO_USERS.find((u: any) => u.id === body.technicianId || u._id === body.technicianId) || DEMO_USERS[4];

      const newJob = {
        _id: `maint-job-${Date.now()}`,
        maintenanceId: `MNT-2026-${String(liveJobs.length + 1).padStart(3, '0')}`,
        cylinder: targetCyl,
        maintenanceType: body.maintenanceType || 'VALVE_REPLACEMENT',
        description: body.description || 'Maintenance overhaul performed.',
        technician: {
          _id: technician._id,
          name: technician.name,
          email: technician.email,
          phone: technician.phone || '+1 (555) 300-0001',
          role: technician.role,
        },
        startDate: new Date().toISOString(),
        cost: Number(body.cost) || 45,
        status: 'IN_PROGRESS',
        notes: body.notes || '',
        createdAt: new Date().toISOString(),
      };

      liveJobs.unshift(newJob as any);
      saveLiveMaintenance(liveJobs);

      // Route cylinder to maintenance
      targetCyl.status = 'MAINTENANCE';
      saveLiveCylinders(liveCyls);

      return { success: true, job: newJob };
    }

    const urlParams = new URLSearchParams(endpoint.includes('?') ? endpoint.split('?')[1] : '');
    const statusFilter = urlParams.get('status') || 'ALL';

    let filtered = liveJobs;
    if (statusFilter && statusFilter !== 'ALL') {
      filtered = filtered.filter((j: any) => j.status === statusFilter);
    }

    return {
      success: true,
      data: filtered,
      pagination: { page: 1, limit: 30, total: filtered.length, pages: 1 },
    };
  }

  if (cleanEndpoint.startsWith('/maintenance/') && cleanEndpoint.endsWith('/status')) {
    const id = cleanEndpoint.split('/')[2];
    const liveJobs = getLiveMaintenance();
    const target = liveJobs.find((j: any) => j._id === id || j.maintenanceId === id);
    if (target) {
      target.status = body.status || target.status;
      if (body.cost !== undefined) target.cost = Number(body.cost);
      if (body.notes) target.notes = body.notes;
      if (target.status === 'COMPLETED') {
        target.completionDate = new Date().toISOString();

        // Route cylinder back to inspection
        const liveCyls = getLiveCylinders();
        const cyl = liveCyls.find((c: any) => c._id === target.cylinder?._id || c.cylinderId === target.cylinder?.cylinderId);
        if (cyl) {
          cyl.status = 'INSPECTION';
          cyl.condition = 'FAIR';
          saveLiveCylinders(liveCyls);
        }
      }
      saveLiveMaintenance(liveJobs);
    }
    return { success: true, job: target || liveJobs[0] };
  }

  if (cleanEndpoint === '/maintenance/stats') {
    const liveJobs = getLiveMaintenance();
    const byStatus: Record<string, number> = {};
    let totalCost = 0;
    liveJobs.forEach((j: any) => {
      byStatus[j.status] = (byStatus[j.status] || 0) + 1;
      totalCost += Number(j.cost) || 0;
    });
    return {
      success: true,
      stats: {
        total: liveJobs.length,
        byStatus,
        totalCost,
      },
    };
  }

  // 10. Inspections
  if (cleanEndpoint === '/inspections') {
    const liveInsps = getLiveInspections();
    if (method === 'POST') {
      const liveCyls = getLiveCylinders();
      const targetCyl = liveCyls.find((c: any) => c._id === body.cylinderId || c.cylinderId === body.cylinderId) || liveCyls[0];
      const inspector = DEMO_USERS.find((u: any) => u.id === body.inspectorId || u._id === body.inspectorId) || DEMO_USERS[4];

      const newInspection = {
        _id: `insp-${Date.now()}`,
        inspectionId: `INSP-2026-${String(liveInsps.length + 1).padStart(3, '0')}`,
        cylinder: targetCyl,
        inspector: {
          _id: inspector._id,
          name: inspector.name,
          role: inspector.role,
          email: inspector.email,
        },
        inspectionDate: body.inspectionDate || new Date().toISOString(),
        inspectionType: body.inspectionType || 'ROUTINE',
        leakTest: body.leakTest || 'PASSED',
        valveCondition: body.valveCondition || 'GOOD',
        bodyCondition: body.bodyCondition || 'GOOD',
        corrosion: body.corrosion || 'NONE',
        pressureTest: body.pressureTest || 'PASSED',
        safetySeal: body.safetySeal || 'INTACT',
        overallCondition: body.overallCondition || 'GOOD',
        result: body.result || 'PASSED',
        remarks: body.remarks || 'Safety inspection passed.',
        nextInspectionDate: new Date(Date.now() + 180 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
      };

      liveInsps.unshift(newInspection as any);
      saveLiveInspections(liveInsps);

      // Sync cylinder state based on inspection result
      if (body.result === 'NEEDS_MAINTENANCE' || body.result === 'FAILED') {
        targetCyl.status = 'MAINTENANCE';
        targetCyl.condition = 'DAMAGED';
      } else if (body.result === 'REJECTED') {
        targetCyl.status = 'RETIRED';
        targetCyl.condition = 'REJECTED';
      } else if (body.result === 'PASSED' && targetCyl.status === 'INSPECTION') {
        targetCyl.status = 'AVAILABLE';
        targetCyl.condition = 'GOOD';
      }
      targetCyl.lastInspectionDate = newInspection.inspectionDate;
      targetCyl.nextInspectionDate = newInspection.nextInspectionDate;
      saveLiveCylinders(liveCyls);

      return { success: true, inspection: newInspection };
    }

    const urlParams = new URLSearchParams(endpoint.includes('?') ? endpoint.split('?')[1] : '');
    const resultFilter = urlParams.get('result') || 'ALL';
    const typeFilter = urlParams.get('inspectionType') || 'ALL';

    let filtered = liveInsps;
    if (resultFilter && resultFilter !== 'ALL') {
      filtered = filtered.filter((i: any) => i.result === resultFilter);
    }
    if (typeFilter && typeFilter !== 'ALL') {
      filtered = filtered.filter((i: any) => i.inspectionType === typeFilter);
    }

    return {
      success: true,
      data: filtered,
      pagination: { page: 1, limit: 30, total: filtered.length, pages: 1 },
    };
  }

  if (cleanEndpoint === '/inspections/stats') {
    const liveInsps = getLiveInspections();
    const byResult: Record<string, number> = {};
    liveInsps.forEach((i: any) => {
      byResult[i.result] = (byResult[i.result] || 0) + 1;
    });
    return {
      success: true,
      stats: {
        total: liveInsps.length,
        byResult,
      },
    };
  }

  // 11. Payments
  if (cleanEndpoint === '/payments') {
    const livePayments = getLivePayments();
    if (method === 'POST') {
      const customer = DEMO_CUSTOMERS.find((c: any) => c._id === body.customerId || c.customerId === body.customerId) || DEMO_CUSTOMERS[0];
      const newPayment = {
        _id: `pay-${Date.now()}`,
        paymentId: `PAY-2026-${String(livePayments.length + 101).padStart(3, '0')}`,
        customer: {
          _id: customer._id,
          customerId: customer.customerId,
          name: customer.name,
          phone: customer.phone,
        },
        amount: Number(body.amount) || 0,
        paymentMethod: body.paymentMethod || 'CASH',
        status: 'COMPLETED',
        transactionReference: body.transactionReference || `TXN-${Date.now().toString().slice(-6)}`,
        notes: body.notes || '',
        recordedBy: {
          _id: DEMO_USERS[0]._id,
          name: DEMO_USERS[0].name,
          role: DEMO_USERS[0].role,
        },
        paymentDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      livePayments.unshift(newPayment as any);
      saveLivePayments(livePayments);

      return { success: true, payment: newPayment };
    }

    const urlParams = new URLSearchParams(endpoint.includes('?') ? endpoint.split('?')[1] : '');
    const methodFilter = urlParams.get('paymentMethod');

    let filtered = livePayments;
    if (methodFilter && methodFilter !== 'ALL') {
      filtered = filtered.filter((p: any) => p.paymentMethod === methodFilter);
    }

    return {
      success: true,
      data: filtered,
      pagination: { page: 1, limit: 20, total: filtered.length, pages: 1 },
    };
  }

  if (cleanEndpoint === '/payments/stats') {
    const livePayments = getLivePayments();
    const methodTotals: Record<string, number> = {};
    let totalRevenue = 0;

    livePayments
      .filter((p: any) => p.status === 'COMPLETED')
      .forEach((p: any) => {
        const amt = Number(p.amount) || 0;
        totalRevenue += amt;
        methodTotals[p.paymentMethod] = (methodTotals[p.paymentMethod] || 0) + amt;
      });

    const byMethod = Object.entries(methodTotals).map(([method, total]) => ({
      _id: method,
      total,
    }));

    return {
      success: true,
      stats: {
        totalRevenue,
        byMethod,
        recentPayments: livePayments.slice(0, 5),
      },
    };
  }

  // 12. Notifications
  if (cleanEndpoint === '/notifications') {
    return {
      success: true,
      unreadCount: 2,
      notifications: DEMO_NOTIFICATIONS,
    };
  }

  // 13. Audit Logs
  if (cleanEndpoint === '/audit-logs') {
    return {
      success: true,
      data: DEMO_AUDIT_LOGS,
      pagination: { page: 1, limit: 20, total: DEMO_AUDIT_LOGS.length, pages: 1 },
    };
  }

  // Default fallback
  return {
    success: true,
    data: [],
    message: 'Operation completed (demo mode)',
  };
}
