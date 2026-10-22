import { api } from './client';
import { Customer } from './customers';
import { Cylinder } from './cylinders';

export interface Delivery {
  _id: string;
  deliveryId: string;
  customer: Customer;
  deliveryStaff?: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    role: string;
  };
  scheduledDate: string;
  deliveryDate?: string;
  cylinder?: Cylinder;
  quantity: number;
  deliveryAddress: string;
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
  deliveryStatus:
    | 'PENDING'
    | 'ASSIGNED'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'FAILED'
    | 'CANCELLED'
    | 'RESCHEDULED';
  paymentAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const deliveryApi = {
  list: (params: {
    page?: number;
    limit?: number;
    deliveryStatus?: string;
    paymentStatus?: string;
    staffId?: string;
    customerId?: string;
    search?: string;
  } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') searchParams.append(key, String(val));
    });
    return api.get<{
      success: boolean;
      data: Delivery[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/deliveries?${searchParams.toString()}`);
  },

  getById: (id: string) => api.get<{ success: boolean; delivery: Delivery; payments: any[] }>(`/deliveries/${id}`),

  getStats: () =>
    api.get<{
      success: boolean;
      stats: {
        total: number;
        byStatus: Record<string, number>;
        scheduledToday: number;
        deliveredToday: number;
      };
    }>('/deliveries/stats'),

  create: (data: any) => api.post<{ success: boolean; delivery: Delivery }>('/deliveries', data),

  updateStatus: (
    id: string,
    data: {
      deliveryStatus: string;
      cylinderId?: string;
      returnedCylinderSerial?: string;
      paymentReceived?: boolean;
      paymentMethod?: string;
      notes?: string;
    }
  ) => api.put<{ success: boolean; delivery: Delivery }>(`/deliveries/${id}/status`, data),
};
