import { api } from './client';
import { Cylinder } from './cylinders';

export interface Customer {
  _id: string;
  customerId: string;
  name: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  customerType: 'HOUSEHOLD' | 'COMMERCIAL' | 'INDUSTRIAL';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  cylinderCount: number;
  outstandingBalance: number;
  createdAt: string;
  updatedAt: string;
}

export const customerApi = {
  list: (params: { page?: number; limit?: number; search?: string; customerType?: string; status?: string } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') searchParams.append(key, String(val));
    });
    return api.get<{
      success: boolean;
      data: Customer[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/customers?${searchParams.toString()}`);
  },

  getById: (id: string) =>
    api.get<{
      success: boolean;
      customer: Customer;
      cylinders: Cylinder[];
      deliveries: any[];
    }>(`/customers/${id}`),

  getStats: () =>
    api.get<{
      success: boolean;
      stats: { total: number; byType: Record<string, number>; totalOutstanding: number };
    }>('/customers/stats'),

  create: (data: any) => api.post<{ success: boolean; customer: Customer }>('/customers', data),

  update: (id: string, data: any) => api.put<{ success: boolean; customer: Customer }>(`/customers/${id}`, data),
};
