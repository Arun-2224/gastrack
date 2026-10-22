import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'MANAGER', 'DELIVERY_STAFF', 'INVENTORY_STAFF', 'MAINTENANCE_STAFF']),
  phone: z.string().optional(),
});

export const createCylinderSchema = z.object({
  serialNumber: z.string().min(3, 'Serial number must be at least 3 characters').toUpperCase(),
  cylinderType: z.enum(['DOMESTIC_14_2KG', 'COMMERCIAL_19KG', 'INDUSTRIAL_47_5KG', 'CAMPING_5KG']),
  capacity: z.number().positive('Capacity must be greater than 0'),
  brand: z.string().default('GasTrack SuperGas'),
  manufacturingDate: z.string().optional(),
  purchaseDate: z.string().optional(),
  condition: z.enum(['GOOD', 'FAIR', 'DAMAGED', 'CRITICAL', 'REJECTED']).default('GOOD'),
  currentLocation: z.string().optional(),
  status: z.enum([
    'AVAILABLE',
    'FILLED',
    'EMPTY',
    'ASSIGNED',
    'DELIVERED',
    'RETURNED',
    'IN_REFILL',
    'INSPECTION',
    'MAINTENANCE',
    'DAMAGED',
    'LOST',
    'RETIRED',
  ]).default('AVAILABLE'),
});

export const updateCylinderStatusSchema = z.object({
  status: z.enum([
    'AVAILABLE',
    'FILLED',
    'EMPTY',
    'ASSIGNED',
    'DELIVERED',
    'RETURNED',
    'IN_REFILL',
    'INSPECTION',
    'MAINTENANCE',
    'DAMAGED',
    'LOST',
    'RETIRED',
  ]),
  notes: z.string().optional(),
  locationId: z.string().optional(),
  customerId: z.string().optional().nullable(),
  condition: z.enum(['GOOD', 'FAIR', 'DAMAGED', 'CRITICAL', 'REJECTED']).optional(),
});

export const createCustomerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(7, 'Phone number is required'),
  alternatePhone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(3, 'Address is required'),
  city: z.string().default('Metro City'),
  state: z.string().default('State'),
  postalCode: z.string().default('560001'),
  customerType: z.enum(['HOUSEHOLD', 'COMMERCIAL', 'INDUSTRIAL']),
});

export const createDeliverySchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  deliveryStaffId: z.string().optional(),
  cylinderId: z.string().optional(),
  quantity: z.number().int().min(1).default(1),
  deliveryAddress: z.string().min(3, 'Delivery address is required'),
  paymentAmount: z.number().min(0, 'Payment amount cannot be negative'),
  notes: z.string().optional(),
});

export const updateDeliveryStatusSchema = z.object({
  deliveryStatus: z.enum([
    'PENDING',
    'ASSIGNED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'FAILED',
    'CANCELLED',
    'RESCHEDULED',
  ]),
  cylinderId: z.string().optional(),
  returnedCylinderSerial: z.string().optional(),
  paymentReceived: z.boolean().optional(),
  paymentMethod: z.enum(['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'OTHER']).optional(),
  notes: z.string().optional(),
});

export const createPaymentSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  deliveryId: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.enum(['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'OTHER']),
  transactionReference: z.string().optional(),
});

export const createRefillPlantSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  code: z.string().min(2, 'Code is required').toUpperCase(),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  capacity: z.number().min(1).default(500),
});

export const createRefillBatchSchema = z.object({
  refillPlantId: z.string().min(1, 'Refill plant is required'),
  cylinderIds: z.array(z.string()).min(1, 'At least one cylinder must be selected'),
  expectedCompletionDate: z.string().optional(),
  notes: z.string().optional(),
});

export const updateRefillBatchStatusSchema = z.object({
  status: z.enum(['CREATED', 'SENT', 'IN_PROGRESS', 'COMPLETED', 'QUALITY_CHECK', 'APPROVED', 'REJECTED']),
  notes: z.string().optional(),
});

export const createInspectionSchema = z.object({
  cylinderId: z.string().min(1, 'Cylinder is required'),
  inspectionType: z.enum(['ROUTINE', 'POST_REFILL', 'PERIODIC_STATUTORY', 'INCIDENT_CHECK']).default('POST_REFILL'),
  leakTest: z.enum(['PASSED', 'FAILED']),
  valveCondition: z.enum(['GOOD', 'FAIR', 'DEFECTIVE']),
  bodyCondition: z.enum(['GOOD', 'DENTED', 'CORRODED', 'DAMAGED']),
  corrosion: z.enum(['NONE', 'SURFACE', 'SEVERE']).default('NONE'),
  pressureTest: z.enum(['PASSED', 'FAILED', 'NOT_APPLICABLE']).default('PASSED'),
  safetySeal: z.enum(['INTACT', 'BROKEN', 'MISSING']).default('INTACT'),
  overallCondition: z.enum(['GOOD', 'FAIR', 'POOR', 'REJECTED']),
  result: z.enum(['PASSED', 'FAILED', 'NEEDS_MAINTENANCE', 'REJECTED']),
  remarks: z.string().optional(),
  nextInspectionDate: z.string().optional(),
});

export const createMaintenanceSchema = z.object({
  cylinderId: z.string().min(1, 'Cylinder is required'),
  maintenanceType: z.enum([
    'VALVE_REPLACEMENT',
    'HYDROSTATIC_TEST',
    'RE_PAINTING',
    'COLLAR_REPAIR',
    'FOOT_RING_REPAIR',
    'INTERNAL_CLEANING',
    'OTHER',
  ]),
  description: z.string().min(3, 'Description is required'),
  technicianId: z.string().min(1, 'Technician is required'),
  cost: z.number().min(0).default(0),
  notes: z.string().optional(),
});

export const updateMaintenanceStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  cost: z.number().min(0).optional(),
  notes: z.string().optional(),
});
