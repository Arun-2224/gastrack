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
    cost: 38,
    status: 'IN_PROGRESS',
    notes: 'Awaiting secondary hydrostatic certification.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
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

// Handles in-browser API mock responses
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
    return {
      success: true,
      summary: {
        totalCylinders: 420,
        availableCylinders: 185,
        inCustomerHands: 164,
        inRefill: 36,
        inInspection: 18,
        inMaintenance: 12,
        damagedOrLost: 5,
        totalCustomers: 88,
        deliveriesToday: 24,
        completedToday: 19,
        totalRevenue: 28450,
        totalOutstanding: 4120,
      },
      cylinderDistribution: [
        { name: 'Available', value: 185, color: '#10b981' },
        { name: 'With Customers', value: 164, color: '#3b82f6' },
        { name: 'In Refill', value: 36, color: '#f59e0b' },
        { name: 'In Inspection', value: 18, color: '#8b5cf6' },
        { name: 'In Maintenance', value: 12, color: '#ef4444' },
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
        PASSED: 84,
        REQUIRES_MAINTENANCE: 12,
        CONDEMNED: 2,
      },
      recentDeliveries: DEMO_DELIVERIES,
      recentAlerts: DEMO_NOTIFICATIONS,
    };
  }

  // 5. Cylinders
  if (cleanEndpoint === '/cylinders') {
    if (method === 'POST') {
      const newCylinder = {
        _id: `cyl-${Date.now()}`,
        cylinderId: body.cylinderId || `GT-DOM-${Math.floor(100 + Math.random() * 900)}`,
        serialNumber: body.serialNumber || `SN-${Math.floor(1000000 + Math.random() * 9000000)}`,
        cylinderType: body.cylinderType || 'DOMESTIC_14_2KG',
        capacity: body.capacity || 14.2,
        brand: body.brand || 'BharatGas',
        status: body.status || 'AVAILABLE',
        condition: body.condition || 'GOOD',
        currentLocation: { _id: 'loc-1', name: 'Main Central Warehouse', type: 'MAIN_WAREHOUSE' },
        currentCustomer: null,
        refillCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      DEMO_CYLINDERS.unshift(newCylinder as any);
      return { success: true, cylinder: newCylinder };
    }
    return {
      success: true,
      data: DEMO_CYLINDERS,
      pagination: { page: 1, limit: 20, total: DEMO_CYLINDERS.length, pages: 1 },
    };
  }

  if (cleanEndpoint === '/cylinders/stats') {
    return {
      success: true,
      stats: {
        total: DEMO_CYLINDERS.length,
        byStatus: {
          AVAILABLE: 1,
          DELIVERED: 1,
          IN_REFILL: 1,
          EMPTY: 1,
          MAINTENANCE: 1,
          FILLED: 1,
        },
        byCondition: { GOOD: 4, FAIR: 1, DAMAGED: 1 },
        byType: {
          DOMESTIC_14_2KG: 2,
          COMMERCIAL_19KG: 2,
          INDUSTRIAL_47_5KG: 1,
          CAMPING_5KG: 1,
        },
      },
    };
  }

  // Cylinder status transition
  if (cleanEndpoint.startsWith('/cylinders/') && cleanEndpoint.endsWith('/status')) {
    const id = cleanEndpoint.split('/')[2];
    const target = DEMO_CYLINDERS.find((c) => c._id === id || c.cylinderId === id);
    if (target) {
      target.status = body.status || target.status;
      if (body.condition) target.condition = body.condition;
    }
    return { success: true, message: 'Status updated successfully', cylinder: target || DEMO_CYLINDERS[0] };
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
    return {
      success: true,
      data: DEMO_MAINTENANCE,
      pagination: { page: 1, limit: 20, total: DEMO_MAINTENANCE.length, pages: 1 },
    };
  }

  if (cleanEndpoint === '/maintenance/stats') {
    return {
      success: true,
      stats: { total: DEMO_MAINTENANCE.length, byStatus: { IN_PROGRESS: 1 }, totalCost: 38 },
    };
  }

  // 10. Inspections
  if (cleanEndpoint === '/inspections') {
    return {
      success: true,
      data: [
        {
          _id: 'insp-1',
          inspectionId: 'INSP-2026-001',
          cylinder: DEMO_CYLINDERS[0],
          inspector: DEMO_USERS[4],
          inspectionDate: new Date().toISOString(),
          result: 'PASSED',
          tareWeight: 14.1,
          visualInspection: true,
          pressureTest: true,
          nextInspectionDate: new Date(Date.now() + 180 * 86400000).toISOString(),
          notes: 'Standard certification passed with zero leak rate.',
        },
      ],
      pagination: { page: 1, limit: 20, total: 1, pages: 1 },
    };
  }

  // 11. Payments
  if (cleanEndpoint === '/payments') {
    return {
      success: true,
      data: DEMO_PAYMENTS,
      pagination: { page: 1, limit: 20, total: DEMO_PAYMENTS.length, pages: 1 },
    };
  }

  if (cleanEndpoint === '/payments/stats') {
    return {
      success: true,
      stats: { totalRevenue: 368, byMethod: [{ _id: 'UPI', total: 320 }, { _id: 'CARD', total: 48 }], recentPayments: DEMO_PAYMENTS },
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
