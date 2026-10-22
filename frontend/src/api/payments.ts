import { api } from './client';

export interface Payment {
  _id: string;
  paymentId: string;
  customer: {
    _id: string;
    customerId: string;
    name: string;
    phone: string;
  };
  delivery?: {
    _id: string;
    deliveryId: string;
    paymentAmount: number;
    paymentStatus: string;
  };
  amount: number;
  paymentMethod: 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'OTHER';
  transactionReference?: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  recordedBy: {
    _id: string;
    name: string;
    role: string;
  };
  paymentDate: string;
  createdAt: string;
}

export const paymentApi = {
  list: (params: { page?: number; limit?: number; paymentMethod?: string; status?: string; customerId?: string } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') searchParams.append(key, String(val));
    });
    return api.get<{
      success: boolean;
      data: Payment[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/payments?${searchParams.toString()}`);
  },

  getStats: () =>
    api.get<{
      success: boolean;
      stats: { totalRevenue: number; byMethod: any[]; recentPayments: Payment[] };
    }>('/payments/stats'),

  create: (data: any) => api.post<{ success: boolean; payment: Payment }>('/payments', data),
};
