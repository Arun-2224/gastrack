import { api } from './client';
import { Cylinder } from './cylinders';

export interface MaintenanceJob {
  _id: string;
  maintenanceId: string;
  cylinder: Cylinder;
  maintenanceType:
    | 'VALVE_REPLACEMENT'
    | 'HYDROSTATIC_TEST'
    | 'RE_PAINTING'
    | 'COLLAR_REPAIR'
    | 'FOOT_RING_REPAIR'
    | 'INTERNAL_CLEANING'
    | 'OTHER';
  description: string;
  technician: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  startDate: string;
  completionDate?: string;
  cost: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
}

export const maintenanceApi = {
  list: (params: { page?: number; limit?: number; status?: string; maintenanceType?: string; technicianId?: string } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') searchParams.append(key, String(val));
    });
    return api.get<{
      success: boolean;
      data: MaintenanceJob[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/maintenance?${searchParams.toString()}`);
  },

  getStats: () =>
    api.get<{
      success: boolean;
      stats: { total: number; byStatus: Record<string, number>; totalCost: number };
    }>('/maintenance/stats'),

  create: (data: any) => api.post<{ success: boolean; job: MaintenanceJob }>('/maintenance', data),

  updateStatus: (id: string, data: { status: string; cost?: number; notes?: string }) =>
    api.put<{ success: boolean; job: MaintenanceJob }>(`/maintenance/${id}/status`, data),
};
