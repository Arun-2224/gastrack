import { api } from './client';

export interface Cylinder {
  _id: string;
  cylinderId: string;
  serialNumber: string;
  cylinderType: 'DOMESTIC_14_2KG' | 'COMMERCIAL_19KG' | 'INDUSTRIAL_47_5KG' | 'CAMPING_5KG';
  capacity: number;
  brand: string;
  manufacturingDate?: string;
  purchaseDate?: string;
  status:
    | 'AVAILABLE'
    | 'FILLED'
    | 'EMPTY'
    | 'ASSIGNED'
    | 'DELIVERED'
    | 'RETURNED'
    | 'IN_REFILL'
    | 'INSPECTION'
    | 'MAINTENANCE'
    | 'DAMAGED'
    | 'LOST'
    | 'RETIRED';
  condition: 'GOOD' | 'FAIR' | 'DAMAGED' | 'CRITICAL' | 'REJECTED';
  currentLocation?: {
    _id: string;
    name: string;
    type: string;
  };
  currentCustomer?: {
    _id: string;
    customerId: string;
    name: string;
    phone: string;
    customerType: string;
  } | null;
  lastRefillDate?: string;
  refillCount: number;
  lastInspectionDate?: string;
  nextInspectionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CylinderFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  condition?: string;
  cylinderType?: string;
  locationId?: string;
  customerId?: string;
}

export const cylinderApi = {
  list: (params: CylinderFilterParams = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') searchParams.append(key, String(val));
    });
    return api.get<{
      success: boolean;
      data: Cylinder[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/cylinders?${searchParams.toString()}`);
  },

  getById: (id: string) => api.get<{ success: boolean; cylinder: Cylinder }>(`/cylinders/${id}`),

  getHistory: (id: string) =>
    api.get<{ success: boolean; history: any[] }>(`/cylinders/${id}/history`),

  getMovements: (id: string) =>
    api.get<{ success: boolean; movements: any[] }>(`/cylinders/${id}/movements`),

  getStats: () =>
    api.get<{
      success: boolean;
      stats: {
        total: number;
        byStatus: Record<string, number>;
        byCondition: Record<string, number>;
        byType: Record<string, number>;
      };
    }>('/cylinders/stats'),

  create: (data: any) => api.post<{ success: boolean; cylinder: Cylinder }>('/cylinders', data),

  update: (id: string, data: any) => api.put<{ success: boolean; cylinder: Cylinder }>(`/cylinders/${id}`, data),

  transitionStatus: (id: string, data: { status: string; notes?: string; locationId?: string; customerId?: string | null; condition?: string }) =>
    api.post<{ success: boolean; message: string; cylinder: Cylinder }>(`/cylinders/${id}/status`, data),

  bulkTransition: (data: { cylinderIds: string[]; newStatus: string; locationId?: string; notes?: string }) =>
    api.post<{ success: boolean; message: string; successful: number; failed: number }>('/cylinders/bulk-status', data),
};
