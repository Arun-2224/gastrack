import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { connectDB, disconnectDB } from '../config/database';
import {
  User,
  Customer,
  Cylinder,
  CylinderStatusHistory,
  InventoryMovement,
  Location,
  Delivery,
  Payment,
  RefillPlant,
  RefillBatch,
  Inspection,
  Maintenance,
  Notification,
  AuditLog,
  CylinderStatus,
  CylinderType,
} from '../models';

dotenv.config();

export const seed = async (disconnectAfter = true) => {
  console.log('--- GasTrack Database Seeder Starting ---');
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  // Clear existing collections
  console.log('[Seed] Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Customer.deleteMany({}),
    Cylinder.deleteMany({}),
    CylinderStatusHistory.deleteMany({}),
    InventoryMovement.deleteMany({}),
    Location.deleteMany({}),
    Delivery.deleteMany({}),
    Payment.deleteMany({}),
    RefillPlant.deleteMany({}),
    RefillBatch.deleteMany({}),
    Inspection.deleteMany({}),
    Maintenance.deleteMany({}),
    Notification.deleteMany({}),
    AuditLog.deleteMany({}),
  ]);

  console.log('[Seed] Database cleared. Seeding fresh data...');

  // 1. Locations
  console.log('[Seed] Creating locations...');
  const locations = await Location.create([
    {
      name: 'Main Central Warehouse',
      type: 'MAIN_WAREHOUSE',
      address: '100 Industrial Corridor, Sector 4, Metro City',
      status: 'ACTIVE',
    },
    {
      name: 'Secondary East Depot',
      type: 'SECONDARY_WAREHOUSE',
      address: '45 East Logistics Park, Metro City',
      status: 'ACTIVE',
    },
    {
      name: 'Delivery Vehicle Fleet #01',
      type: 'DELIVERY_VEHICLE',
      address: 'Mobile Unit - North Zone',
      status: 'ACTIVE',
    },
    {
      name: 'Delivery Vehicle Fleet #02',
      type: 'DELIVERY_VEHICLE',
      address: 'Mobile Unit - South Zone',
      status: 'ACTIVE',
    },
    {
      name: 'Apex Refill Plant Site',
      type: 'REFILL_PLANT',
      address: 'Plot 12, Heavy Chemical Zone, Suburbs',
      status: 'ACTIVE',
    },
    {
      name: 'Metro Maintenance Center',
      type: 'MAINTENANCE_CENTER',
      address: 'Building 3, Quality & Testing Hub, Metro City',
      status: 'ACTIVE',
    },
  ]);

  const mainWarehouseLoc = locations[0];
  const eastDepotLoc = locations[1];
  const vehicle01Loc = locations[2];
  const plantLoc = locations[4];
  const maintLoc = locations[5];

  // 2. Refill Plants
  console.log('[Seed] Creating refill plants...');
  const refillPlants = await RefillPlant.create([
    {
      name: 'Apex Gas Bottling & Refill Terminal',
      code: 'APEX-01',
      address: 'Plot 12, Heavy Chemical Zone, Suburbs',
      contactPerson: 'David Miller',
      phone: '+1 (555) 234-5678',
      email: 'operations@apexrefill.com',
      capacity: 1200,
      status: 'ACTIVE',
    },
    {
      name: 'Horizon Cryo Refill Infrastructure',
      code: 'HORIZON-02',
      address: '88 Energy Highway, Port District',
      contactPerson: 'Elena Rostova',
      phone: '+1 (555) 876-5432',
      email: 'logistics@horizoncryo.com',
      capacity: 800,
      status: 'ACTIVE',
    },
  ]);

  // 3. Users (1 Admin, 2 Managers, 5 Delivery Staff, 3 Inventory Staff, 2 Maintenance Staff)
  console.log('[Seed] Creating users...');
  const salt = await bcrypt.genSalt(10);
  const defaultHashedPassword = await bcrypt.hash('Password123!', salt);

  const users = await User.create([
    // Admin
    {
      name: 'Alexander Pierce (Admin)',
      email: 'admin@gastrack.com',
      password: 'Password123!',
      role: 'ADMIN',
      phone: '+1 (555) 000-0001',
      status: 'ACTIVE',
    },
    // 2 Managers
    {
      name: 'Sarah Jenkins (Ops Manager)',
      email: 'manager1@gastrack.com',
      password: 'Password123!',
      role: 'MANAGER',
      phone: '+1 (555) 000-0002',
      status: 'ACTIVE',
    },
    {
      name: 'Marcus Vance (Logistics Manager)',
      email: 'manager2@gastrack.com',
      password: 'Password123!',
      role: 'MANAGER',
      phone: '+1 (555) 000-0003',
      status: 'ACTIVE',
    },
    // 5 Delivery Staff
    {
      name: 'Carlos Mendez',
      email: 'delivery1@gastrack.com',
      password: 'Password123!',
      role: 'DELIVERY_STAFF',
      phone: '+1 (555) 100-0001',
      status: 'ACTIVE',
    },
    {
      name: 'Tariq Al-Mansoor',
      email: 'delivery2@gastrack.com',
      password: 'Password123!',
      role: 'DELIVERY_STAFF',
      phone: '+1 (555) 100-0002',
      status: 'ACTIVE',
    },
    {
      name: 'Liam O’Connor',
      email: 'delivery3@gastrack.com',
      password: 'Password123!',
      role: 'DELIVERY_STAFF',
      phone: '+1 (555) 100-0003',
      status: 'ACTIVE',
    },
    {
      name: 'Devin Brooks',
      email: 'delivery4@gastrack.com',
      password: 'Password123!',
      role: 'DELIVERY_STAFF',
      phone: '+1 (555) 100-0004',
      status: 'ACTIVE',
    },
    {
      name: 'Jessica Morales',
      email: 'delivery5@gastrack.com',
      password: 'Password123!',
      role: 'DELIVERY_STAFF',
      phone: '+1 (555) 100-0005',
      status: 'ACTIVE',
    },
    // 3 Inventory Staff
    {
      name: 'Rajesh Patel',
      email: 'inventory1@gastrack.com',
      password: 'Password123!',
      role: 'INVENTORY_STAFF',
      phone: '+1 (555) 200-0001',
      status: 'ACTIVE',
    },
    {
      name: 'Emily Chen',
      email: 'inventory2@gastrack.com',
      password: 'Password123!',
      role: 'INVENTORY_STAFF',
      phone: '+1 (555) 200-0002',
      status: 'ACTIVE',
    },
    {
      name: 'Arthur Pendelton',
      email: 'inventory3@gastrack.com',
      password: 'Password123!',
      role: 'INVENTORY_STAFF',
      phone: '+1 (555) 200-0003',
      status: 'ACTIVE',
    },
    // 2 Maintenance Staff
    {
      name: 'Viktor Kowalski (Lead Tech)',
      email: 'maint1@gastrack.com',
      password: 'Password123!',
      role: 'MAINTENANCE_STAFF',
      phone: '+1 (555) 300-0001',
      status: 'ACTIVE',
    },
    {
      name: 'Samuel Thorne (Safety Inspector)',
      email: 'maint2@gastrack.com',
      password: 'Password123!',
      role: 'MAINTENANCE_STAFF',
      phone: '+1 (555) 300-0002',
      status: 'ACTIVE',
    },
  ]);

  const adminUser = users[0];
  const managerUser = users[1];
  const deliveryStaff = users.filter((u) => u.role === 'DELIVERY_STAFF');
  const inventoryStaff = users.filter((u) => u.role === 'INVENTORY_STAFF');
  const maintenanceStaff = users.filter((u) => u.role === 'MAINTENANCE_STAFF');

  // 4. Customers (35 realistic customers across HOUSEHOLD, COMMERCIAL, INDUSTRIAL)
  console.log('[Seed] Creating 35+ customers...');
  const customerData = [
    // Commercial
    { name: 'Grand Hyatt Metro Regency', customerType: 'COMMERCIAL', address: '12 Luxury Blvd', city: 'Metro City', phone: '+1 555-401-0001', email: 'procurement@hyattmetro.com' },
    { name: 'Fire & Stone Pizzeria', customerType: 'COMMERCIAL', address: '88 Little Italy Way', city: 'Metro City', phone: '+1 555-401-0002', email: 'kitchen@firestonepizza.com' },
    { name: 'Blue Ocean Seafood Grill', customerType: 'COMMERCIAL', address: '2 Waterfront Quay', city: 'Metro City', phone: '+1 555-401-0003', email: 'orders@blueoceangrill.com' },
    { name: 'Saffron Spice Fine Dining', customerType: 'COMMERCIAL', address: '44 Hill View St', city: 'Metro City', phone: '+1 555-401-0004', email: 'accounts@saffronspice.com' },
    { name: 'The Roasted Bean Coffee & Bakery', customerType: 'COMMERCIAL', address: '19 Park Lane', city: 'Metro City', phone: '+1 555-401-0005', email: 'supplies@roastedbean.com' },
    { name: 'St. Jude Community Hospital Canteen', customerType: 'COMMERCIAL', address: '500 Health Ave', city: 'Metro City', phone: '+1 555-401-0006', email: 'facility@stjudehospital.org' },
    { name: 'Golden Wok Asian Bistro', customerType: 'COMMERCIAL', address: '15 Chinatown Plaza', city: 'Metro City', phone: '+1 555-401-0007', email: 'manager@goldenwok.com' },
    { name: 'Metro Convention Center Catering', customerType: 'COMMERCIAL', address: '300 Expo Blvd', city: 'Metro City', phone: '+1 555-401-0008', email: 'events@metroconvention.com' },
    { name: 'Sunset Valley Brewery & Kitchen', customerType: 'COMMERCIAL', address: '72 Mill Road', city: 'Metro City', phone: '+1 555-401-0009', email: 'ops@sunsetbrewery.com' },
    { name: 'Crispy Crust Gourmet Bakery', customerType: 'COMMERCIAL', address: '109 Main Street', city: 'Metro City', phone: '+1 555-401-0010', email: 'orders@crispycrust.com' },

    // Industrial
    { name: 'Apex Metal Fabrication Ltd', customerType: 'INDUSTRIAL', address: 'Sector 9 Industrial Zone', city: 'Metro City', phone: '+1 555-501-0001', email: 'plant@apexmetalfab.com' },
    { name: 'Titan Alloys & Welding Works', customerType: 'INDUSTRIAL', address: 'Plot 44 Heavy Engineering Park', city: 'Metro City', phone: '+1 555-501-0002', email: 'titan@alloysweld.com' },
    { name: 'Matrix Glass & Ceramics Plant', customerType: 'INDUSTRIAL', address: '22 Kiln Road', city: 'Metro City', phone: '+1 555-501-0003', email: 'energy@matrixceramics.com' },
    { name: 'Vanguard Automotive Assembly', customerType: 'INDUSTRIAL', address: '100 Motorway Way', city: 'Metro City', phone: '+1 555-501-0004', email: 'logistics@vanguardauto.com' },
    { name: 'Pioneer Chemical Synthetics', customerType: 'INDUSTRIAL', address: '7 Chemical Corridor', city: 'Metro City', phone: '+1 555-501-0005', email: 'safety@pioneerchem.com' },
    { name: 'Sterling Shipyard & Marine Refit', customerType: 'INDUSTRIAL', address: 'Dock 5 Drydock Zone', city: 'Metro City', phone: '+1 555-501-0006', email: 'drydock@sterlingship.com' },
    { name: 'Nova Packaging & Thermoforming', customerType: 'INDUSTRIAL', address: '49 Logistics Belt', city: 'Metro City', phone: '+1 555-501-0007', email: 'plantops@novapack.com' },
    { name: 'Horizon Steel Pipe Works', customerType: 'INDUSTRIAL', address: '88 Foundry St', city: 'Metro City', phone: '+1 555-501-0008', email: 'procurement@horizonsteel.com' },

    // Household
    { name: 'Robert & Patricia Smith', customerType: 'HOUSEHOLD', address: '14 Elm Creek Terrace', city: 'Metro City', phone: '+1 555-601-0001', email: 'r.smith@email.com' },
    { name: 'Dr. Anita Banerjee', customerType: 'HOUSEHOLD', address: '22 Maple Crest Apt 4B', city: 'Metro City', phone: '+1 555-601-0002', email: 'anita.b@email.com' },
    { name: 'David & Hannah Wilson', customerType: 'HOUSEHOLD', address: '9 Oakwood Drive', city: 'Metro City', phone: '+1 555-601-0003', email: 'wilsonfamily@email.com' },
    { name: 'Michael Sterling', customerType: 'HOUSEHOLD', address: '302 Cedar Heights', city: 'Metro City', phone: '+1 555-601-0004', email: 'msterling@email.com' },
    { name: 'Maria Rodriguez', customerType: 'HOUSEHOLD', address: '77 Magnolia Court', city: 'Metro City', phone: '+1 555-601-0005', email: 'mrodriguez@email.com' },
    { name: 'Jonathan & Claire Taylor', customerType: 'HOUSEHOLD', address: '110 Birchwood Lane', city: 'Metro City', phone: '+1 555-601-0006', email: 'claire.taylor@email.com' },
    { name: 'Sunil & Priya Sharma', customerType: 'HOUSEHOLD', address: '55 Willow Creek Court', city: 'Metro City', phone: '+1 555-601-0007', email: 'sharma.residence@email.com' },
    { name: 'Arthur & Brenda King', customerType: 'HOUSEHOLD', address: '33 Sunny Meadows', city: 'Metro City', phone: '+1 555-601-0008', email: 'aking@email.com' },
    { name: 'George Papadopoulos', customerType: 'HOUSEHOLD', address: '88 Heritage Way', city: 'Metro City', phone: '+1 555-601-0009', email: 'gpapa@email.com' },
    { name: 'Kavita Ramanathan', customerType: 'HOUSEHOLD', address: '12 Forest Hill Drive', city: 'Metro City', phone: '+1 555-601-0010', email: 'k.ramanathan@email.com' },
    { name: 'Christopher Evans', customerType: 'HOUSEHOLD', address: '64 Riverbend Close', city: 'Metro City', phone: '+1 555-601-0011', email: 'cevans@email.com' },
    { name: 'Sarah & Thomas Wright', customerType: 'HOUSEHOLD', address: '19 Valley View Ridge', city: 'Metro City', phone: '+1 555-601-0012', email: 'wrightfamily@email.com' },
    { name: 'Fatima Al-Hassan', customerType: 'HOUSEHOLD', address: '84 Jasmine Court', city: 'Metro City', phone: '+1 555-601-0013', email: 'fatima.h@email.com' },
    { name: 'William & Deborah Scott', customerType: 'HOUSEHOLD', address: '102 Lakeview Promenade', city: 'Metro City', phone: '+1 555-601-0014', email: 'wscott@email.com' },
    { name: 'Lucas & Mia Rossi', customerType: 'HOUSEHOLD', address: '27 Orchard Grove', city: 'Metro City', phone: '+1 555-601-0015', email: 'rossi.residence@email.com' },
    { name: 'Zackary Morris', customerType: 'HOUSEHOLD', address: '409 Highline Tower, Unit 12', city: 'Metro City', phone: '+1 555-601-0016', email: 'zmorris@email.com' },
    { name: 'Rachel Green-Geller', customerType: 'HOUSEHOLD', address: '90 Bedford Street', city: 'Metro City', phone: '+1 555-601-0017', email: 'rgreen@email.com' },
  ];

  const customers = [];
  for (let i = 0; i < customerData.length; i++) {
    const c = customerData[i];
    const customerId = `CUST-${String(1001 + i).padStart(5, '0')}`;
    const doc = await Customer.create({
      customerId,
      name: c.name,
      phone: c.phone,
      email: c.email,
      address: c.address,
      city: c.city,
      state: 'Metro State',
      postalCode: '5600' + String(10 + (i % 20)),
      customerType: c.customerType as any,
      status: 'ACTIVE',
      cylinderCount: 0,
      outstandingBalance: i % 4 === 0 ? 120 : 0,
    });
    customers.push(doc);
  }

  // 5. Cylinders (105 Cylinders distributed across all lifecycle statuses)
  console.log('[Seed] Creating 105 cylinders with complete lifecycle states...');
  const cylinders = [];

  // Distribution plan:
  // 0-24 (25): AVAILABLE (at Main Warehouse, condition GOOD)
  // 25-39 (15): FILLED (at East Depot, condition GOOD)
  // 40-49 (10): ASSIGNED (assigned to upcoming deliveries, condition GOOD)
  // 50-69 (20): DELIVERED (at customer locations, condition GOOD/FAIR)
  // 70-81 (12): RETURNED/EMPTY (at Main Warehouse awaiting batching)
  // 82-91 (10): IN_REFILL (at Apex Refill Plant)
  // 92-96 (5): INSPECTION (post-refill quality check)
  // 97-100 (4): MAINTENANCE (at Maintenance Center)
  // 101-102 (2): DAMAGED
  // 103-104 (2): RETIRED

  const cylinderTypes: { type: CylinderType; capacity: number }[] = [
    { type: 'DOMESTIC_14_2KG', capacity: 14.2 },
    { type: 'COMMERCIAL_19KG', capacity: 19.0 },
    { type: 'INDUSTRIAL_47_5KG', capacity: 47.5 },
    { type: 'CAMPING_5KG', capacity: 5.0 },
  ];

  for (let i = 1; i <= 105; i++) {
    const serialNumber = `GT-LPG-${String(i).padStart(4, '0')}`;
    const cylinderId = `CYL-${String(i).padStart(4, '0')}`;

    let typeIndex = 0;
    if (i % 5 === 0) typeIndex = 2; // Industrial
    else if (i % 3 === 0) typeIndex = 1; // Commercial
    else if (i % 11 === 0) typeIndex = 3; // Camping
    const { type, capacity } = cylinderTypes[typeIndex];

    let status: CylinderStatus = 'AVAILABLE';
    let condition: any = 'GOOD';
    let loc: any = mainWarehouseLoc._id;
    let cust: any = null;
    let refillCount = (i % 8) + 1;

    if (i <= 25) {
      status = 'AVAILABLE';
      condition = 'GOOD';
      loc = mainWarehouseLoc._id;
    } else if (i <= 40) {
      status = 'FILLED';
      condition = 'GOOD';
      loc = eastDepotLoc._id;
    } else if (i <= 50) {
      status = 'ASSIGNED';
      condition = 'GOOD';
      loc = vehicle01Loc._id;
    } else if (i <= 70) {
      status = 'DELIVERED';
      condition = i % 4 === 0 ? 'FAIR' : 'GOOD';
      const assignedCust = customers[(i - 50) % customers.length];
      cust = assignedCust._id;
      loc = null; // With customer
      assignedCust.cylinderCount += 1;
      await assignedCust.save();
    } else if (i <= 82) {
      status = i % 2 === 0 ? 'RETURNED' : 'EMPTY';
      condition = 'FAIR';
      loc = mainWarehouseLoc._id;
    } else if (i <= 92) {
      status = 'IN_REFILL';
      condition = 'GOOD';
      loc = plantLoc._id;
    } else if (i <= 97) {
      status = 'INSPECTION';
      condition = 'FAIR';
      loc = mainWarehouseLoc._id;
    } else if (i <= 101) {
      status = 'MAINTENANCE';
      condition = 'DAMAGED';
      loc = maintLoc._id;
    } else if (i <= 103) {
      status = 'DAMAGED';
      condition = 'CRITICAL';
      loc = maintLoc._id;
    } else {
      status = 'RETIRED';
      condition = 'REJECTED';
      loc = maintLoc._id;
    }

    const cyl = await Cylinder.create({
      cylinderId,
      serialNumber,
      cylinderType: type,
      capacity,
      brand: 'GasTrack SuperGas',
      manufacturingDate: new Date(2022, (i % 12), 1),
      purchaseDate: new Date(2023, 1, 15),
      status,
      condition,
      currentLocation: loc || undefined,
      currentCustomer: cust || undefined,
      lastRefillDate: new Date(Date.now() - (i % 30) * 24 * 60 * 60 * 1000),
      refillCount,
      lastInspectionDate: new Date(Date.now() - (i % 60) * 24 * 60 * 60 * 1000),
      nextInspectionDate: new Date(Date.now() + (90 + (i % 60)) * 24 * 60 * 60 * 1000),
    });

    cylinders.push(cyl);

    // Create Initial Status History & Inventory Movement for each
    await CylinderStatusHistory.create({
      cylinder: cyl._id,
      previousStatus: undefined,
      newStatus: 'AVAILABLE',
      changedBy: inventoryStaff[0]._id,
      location: mainWarehouseLoc._id,
      notes: 'Initial receipt and commissioning into GasTrack fleet',
      timestamp: new Date(2023, 1, 15),
    });

    await InventoryMovement.create({
      cylinder: cyl._id,
      movementType: 'RECEIVED',
      toLocation: mainWarehouseLoc._id,
      performedBy: inventoryStaff[0]._id,
      notes: 'Initial warehouse intake',
      createdAt: new Date(2023, 1, 15),
    });

    // If cylinder reached current state via lifecycle, add subsequent lifecycle history steps
    if (status === 'DELIVERED') {
      await CylinderStatusHistory.create({
        cylinder: cyl._id,
        previousStatus: 'AVAILABLE',
        newStatus: 'ASSIGNED',
        changedBy: managerUser._id,
        location: vehicle01Loc._id,
        notes: 'Dispatched on delivery route',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      });
      await CylinderStatusHistory.create({
        cylinder: cyl._id,
        previousStatus: 'ASSIGNED',
        newStatus: 'DELIVERED',
        changedBy: deliveryStaff[0]._id,
        notes: 'Delivered and installed at customer premises',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      });
      await InventoryMovement.create({
        cylinder: cyl._id,
        movementType: 'DELIVERED',
        fromLocation: vehicle01Loc._id,
        performedBy: deliveryStaff[0]._id,
        notes: 'Handoff to customer',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      });
    } else if (status === 'IN_REFILL') {
      await CylinderStatusHistory.create({
        cylinder: cyl._id,
        previousStatus: 'EMPTY',
        newStatus: 'IN_REFILL',
        changedBy: inventoryStaff[1]._id,
        location: plantLoc._id,
        notes: 'Transferred to Apex Refill Plant for high-pressure refilling',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      });
      await InventoryMovement.create({
        cylinder: cyl._id,
        movementType: 'SENT_FOR_REFILL',
        fromLocation: mainWarehouseLoc._id,
        toLocation: plantLoc._id,
        performedBy: inventoryStaff[1]._id,
        notes: 'Dispatched to refill terminal',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      });
    }
  }

  // 6. Refill Batches (3 batches)
  console.log('[Seed] Creating refill batches...');
  const inRefillCylinderIds = cylinders
    .filter((c) => c.status === 'IN_REFILL')
    .map((c) => c._id);

  const batch1 = await RefillBatch.create({
    batchId: 'BATCH-2026-0001',
    refillPlant: refillPlants[0]._id,
    cylinders: inRefillCylinderIds.slice(0, 5),
    createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    expectedCompletionDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: 'IN_PROGRESS',
    notes: 'Commercial 19kg and Domestic batch refill',
  });

  const batch2 = await RefillBatch.create({
    batchId: 'BATCH-2026-0002',
    refillPlant: refillPlants[1]._id,
    cylinders: inRefillCylinderIds.slice(5, 10),
    createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    expectedCompletionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'SENT',
    notes: 'High-purity industrial batch',
  });

  const completedCylinders = cylinders.slice(10, 15).map((c) => c._id);
  const batch3 = await RefillBatch.create({
    batchId: 'BATCH-2026-0003',
    refillPlant: refillPlants[0]._id,
    cylinders: completedCylinders,
    createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    completionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    status: 'APPROVED',
    notes: 'Approved after quality and pressure verification',
  });

  // 7. Deliveries (30 Deliveries across PENDING, ASSIGNED, OUT_FOR_DELIVERY, DELIVERED)
  console.log('[Seed] Creating 30 deliveries...');
  const deliveries = [];
  const deliveryStatuses: any[] = ['DELIVERED', 'DELIVERED', 'DELIVERED', 'OUT_FOR_DELIVERY', 'ASSIGNED', 'PENDING'];

  for (let i = 1; i <= 30; i++) {
    const cust = customers[i % customers.length];
    const staff = deliveryStaff[i % deliveryStaff.length];
    const cyl = cylinders[(i * 3) % cylinders.length];
    const status = deliveryStatuses[i % deliveryStatuses.length];
    const daysAgo = (30 - i) % 15;
    const scheduledDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const amount = cyl.capacity === 47.5 ? 180 : cyl.capacity === 19 ? 85 : 45;

    const del = await Delivery.create({
      deliveryId: `DEL-2026-${String(i).padStart(4, '0')}`,
      customer: cust._id,
      deliveryStaff: staff._id,
      scheduledDate,
      deliveryDate: status === 'DELIVERED' ? scheduledDate : undefined,
      cylinder: cyl._id,
      quantity: 1,
      deliveryAddress: cust.address + ', ' + cust.city,
      paymentStatus: status === 'DELIVERED' ? (i % 5 === 0 ? 'PARTIAL' : 'PAID') : 'UNPAID',
      deliveryStatus: status,
      paymentAmount: amount,
      notes: `Standard refill delivery for ${cust.name}`,
    });
    deliveries.push(del);
  }

  // 8. Payments (25 Payments)
  console.log('[Seed] Creating payments...');
  const paymentMethods: any[] = ['UPI', 'CASH', 'CARD', 'BANK_TRANSFER'];
  for (let i = 1; i <= 25; i++) {
    const del = deliveries[i - 1];
    const cust = customers[(i * 2) % customers.length];
    const method = paymentMethods[i % paymentMethods.length];
    const amount = del ? del.paymentAmount : 85;

    await Payment.create({
      paymentId: `PAY-2026-${String(i).padStart(4, '0')}`,
      customer: cust._id,
      delivery: del ? del._id : undefined,
      amount,
      paymentMethod: method,
      transactionReference: `TXN-${method}-${100000 + i}`,
      status: 'COMPLETED',
      recordedBy: deliveryStaff[i % deliveryStaff.length]._id,
      paymentDate: new Date(Date.now() - (25 - i) * 24 * 60 * 60 * 1000),
    });
  }

  // 9. Inspections (25 Inspections)
  console.log('[Seed] Creating inspections...');
  const inspectionResults: any[] = ['PASSED', 'PASSED', 'PASSED', 'PASSED', 'NEEDS_MAINTENANCE', 'FAILED'];
  for (let i = 1; i <= 25; i++) {
    const cyl = cylinders[i % cylinders.length];
    const inspector = maintenanceStaff[i % maintenanceStaff.length];
    const result = inspectionResults[i % inspectionResults.length];

    await Inspection.create({
      inspectionId: `INSP-2026-${String(i).padStart(4, '0')}`,
      cylinder: cyl._id,
      inspector: inspector._id,
      inspectionDate: new Date(Date.now() - (25 - i) * 2 * 24 * 60 * 60 * 1000),
      inspectionType: i % 2 === 0 ? 'POST_REFILL' : 'ROUTINE',
      leakTest: result === 'FAILED' ? 'FAILED' : 'PASSED',
      valveCondition: result === 'NEEDS_MAINTENANCE' ? 'DEFECTIVE' : 'GOOD',
      bodyCondition: result === 'FAILED' ? 'DAMAGED' : 'GOOD',
      corrosion: result === 'FAILED' ? 'SURFACE' : 'NONE',
      pressureTest: 'PASSED',
      safetySeal: 'INTACT',
      overallCondition: result === 'PASSED' ? 'GOOD' : result === 'NEEDS_MAINTENANCE' ? 'FAIR' : 'POOR',
      result,
      remarks: result === 'PASSED' ? 'Passed all automated leak and hydrostatic tests.' : 'Requires valve overhaul or maintenance.',
      nextInspectionDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    });
  }

  // 10. Maintenance Records (10 records)
  console.log('[Seed] Creating maintenance records...');
  const maintTypes: any[] = [
    'VALVE_REPLACEMENT',
    'HYDROSTATIC_TEST',
    'RE_PAINTING',
    'COLLAR_REPAIR',
    'INTERNAL_CLEANING',
  ];
  for (let i = 1; i <= 10; i++) {
    const cyl = cylinders[(90 + i) % cylinders.length];
    const tech = maintenanceStaff[i % maintenanceStaff.length];
    const type = maintTypes[i % maintTypes.length];
    const isCompleted = i <= 6;

    await Maintenance.create({
      maintenanceId: `MAINT-2026-${String(i).padStart(4, '0')}`,
      cylinder: cyl._id,
      maintenanceType: type,
      description: `Scheduled ${type.toLowerCase().replace('_', ' ')} maintenance and pressure safety test.`,
      technician: tech._id,
      startDate: new Date(Date.now() - (15 - i) * 24 * 60 * 60 * 1000),
      completionDate: isCompleted ? new Date(Date.now() - (10 - i) * 24 * 60 * 60 * 1000) : undefined,
      cost: 25 + (i * 12),
      status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
      notes: isCompleted ? 'Replaced brass pressure valve and torque-tested to specification.' : 'In progress at repair bay.',
    });
  }

  // 11. Notifications (15 notifications)
  console.log('[Seed] Creating notifications...');
  const notifications = [
    { title: 'Low Inventory Alert: 14.2kg Domestic', message: 'Main Warehouse available stock fell below safety threshold (25 units).', type: 'LOW_INVENTORY', isRead: false },
    { title: 'Refill Batch In Progress', message: 'Batch BATCH-2026-0001 is currently 60% refilled at Apex Bottling Terminal.', type: 'REFILL_DELAY', isRead: false },
    { title: 'Mandatory Inspection Due: GT-LPG-0094', message: 'Statutory 5-year hydrostatic inspection is due within 7 days.', type: 'INSPECTION_DUE', isRead: false },
    { title: 'Delivery Dispatched: DEL-2026-0004', message: 'Driver Carlos Mendez has departed on route to Grand Hyatt Regency.', type: 'DELIVERY_DELAY', isRead: true },
    { title: 'Maintenance Overhaul Completed', message: 'Cylinder GT-LPG-0098 valve replacement completed and certified safe.', type: 'MAINTENANCE_DUE', isRead: true },
    { title: 'Payment Outstanding Notice', message: 'Titan Alloys & Welding Works balance exceeds credit limit ($240).', type: 'PAYMENT_DUE', isRead: false },
    { title: 'Inspection Overdue Notice', message: 'Cylinder GT-LPG-0101 was flagged for immediate isolation.', type: 'INSPECTION_OVERDUE', isRead: false },
    { title: 'Refill Batch Dispatched', message: 'Batch BATCH-2026-0002 has arrived at Horizon Cryo Plant.', type: 'REFILL_DELAY', isRead: true },
  ];

  for (const n of notifications) {
    await Notification.create({
      user: null, // Broadcast
      title: n.title,
      message: n.message,
      type: n.type as any,
      isRead: n.isRead,
      createdAt: new Date(),
    });
  }

  // 12. Audit Logs (40+ operational audit logs)
  console.log('[Seed] Creating audit logs...');
  const auditEntries = [
    { action: 'USER_LOGIN', entity: 'User', entityId: adminUser.email, desc: 'Admin authenticated from system console' },
    { action: 'CYLINDER_CREATE', entity: 'Cylinder', entityId: 'GT-LPG-0001', desc: 'Registered new cylinder into fleet inventory' },
    { action: 'CYLINDER_STATUS_CHANGE', entity: 'Cylinder', entityId: 'GT-LPG-0051', desc: 'Transitioned status from ASSIGNED to DELIVERED' },
    { action: 'DELIVERY_CREATE', entity: 'Delivery', entityId: 'DEL-2026-0001', desc: 'Scheduled commercial gas delivery for Grand Hyatt' },
    { action: 'REFILL_BATCH_CREATE', entity: 'RefillBatch', entityId: 'BATCH-2026-0001', desc: 'Dispatched refill batch to Apex Bottling Terminal' },
    { action: 'INSPECTION_COMPLETE', entity: 'Inspection', entityId: 'INSP-2026-0001', desc: 'Hydrostatic pressure test PASSED with 0 leakage' },
    { action: 'PAYMENT_CREATE', entity: 'Payment', entityId: 'PAY-2026-0001', desc: 'Recorded payment of $180 via UPI from Fire & Stone Pizza' },
    { action: 'MAINTENANCE_CREATE', entity: 'Maintenance', entityId: 'MAINT-2026-0001', desc: 'Opened valve overhaul work order for cylinder GT-LPG-0095' },
  ];

  for (let i = 0; i < 40; i++) {
    const entry = auditEntries[i % auditEntries.length];
    await AuditLog.create({
      user: users[i % users.length]._id,
      action: entry.action,
      entity: entry.entity,
      entityId: `${entry.entityId}-${i + 1}`,
      description: entry.desc,
      ipAddress: `192.168.1.${10 + (i % 25)}`,
      createdAt: new Date(Date.now() - (40 - i) * 6 * 60 * 60 * 1000),
    });
  }

  console.log('====================================================');
  console.log('✅ GasTrack Database Seed Complete!');
  console.log(`👤 Users seeded: ${users.length} (1 Admin, 2 Managers, 5 Delivery, 3 Inventory, 2 Maintenance)`);
  console.log(`👥 Customers seeded: ${customers.length}`);
  console.log(`🛢️ Cylinders seeded: ${cylinders.length} with complete lifecycle states`);
  console.log(`🚚 Deliveries seeded: ${deliveries.length}`);
  console.log(`🔄 Refill Batches: 3`);
  console.log(`🔍 Inspections seeded: 25`);
  console.log(`🔧 Maintenance jobs seeded: 10`);
  console.log(`💳 Payments seeded: 25`);
  console.log(`🔔 Notifications seeded: ${notifications.length}`);
  console.log(`📜 Audit logs seeded: 40+`);
  console.log('🔑 Demo Login: admin@gastrack.com / Password123!');
  console.log('====================================================');

  if (disconnectAfter) {
    await disconnectDB();
    process.exit(0);
  }
};

if (require.main === module) {
  seed(true).catch((err) => {
    console.error('[Seed Error]', err);
    process.exit(1);
  });
}

