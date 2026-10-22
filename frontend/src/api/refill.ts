import { api } from './client';
import { Cylinder } from './cylinders';

export interface RefillPlant {
  _id: string;
  name: string;
  code: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface RefillBatch {
  _id: string;
  batchId: string;
  refillPlant: RefillPlant;
  cylinders: Cylinder[];
  createdDate: string;
  startDate?: string;
  expectedCompletionDate?: string;
  completionDate?: string;
  status:
    | 'CREATED'
    | 'SENT'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'QUALITY_CHECK'
    | 'APPROVED'
    | 'REJECTED';
  notes?: string;
  createdAt: string;
}

export const refillApi = {
  getPlants: () => api.get<{ success: boolean; plants: RefillPlant[] }>('/refill/plants'),

  createPlant: (data: any) => api.post<{ success: boolean; plant: RefillPlant }>('/refill/plants', data),

  getBatches: (params: { page?: number; limit?: number; status?: string; plantId?: string } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') searchParams.append(key, String(val));
    });
    return api.get<{
      success: boolean;
      data: RefillBatch[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/refill/batches?${searchParams.toString()}`);
  },

  getBatchById: (id: string) => api.get<{ success: boolean; batch: RefillBatch }>(`/refill/batches/${id}`),

  createBatch: (data: { refillPlantId: string; cylinderIds: string[]; expectedCompletionDate?: string; notes?: string }) =>
    api.post<{ success: boolean; batch: RefillBatch }>('/refill/batches', data),

  updateBatchStatus: (id: string, data: { status: string; notes?: string }) =>
    api.put<{ success: boolean; batch: RefillBatch }>(`/refill/batches/${id}/status`, data),
};
