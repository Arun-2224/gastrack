import { api } from './client';
import { Cylinder } from './cylinders';

export interface Inspection {
  _id: string;
  inspectionId: string;
  cylinder: Cylinder;
  inspector: {
    _id: string;
    name: string;
    role: string;
    email: string;
  };
  inspectionDate: string;
  inspectionType: 'ROUTINE' | 'POST_REFILL' | 'PERIODIC_STATUTORY' | 'INCIDENT_CHECK';
  leakTest: 'PASSED' | 'FAILED';
  valveCondition: 'GOOD' | 'FAIR' | 'DEFECTIVE';
  bodyCondition: 'GOOD' | 'DENTED' | 'CORRODED' | 'DAMAGED';
  corrosion: 'NONE' | 'SURFACE' | 'SEVERE';
  pressureTest: 'PASSED' | 'FAILED' | 'NOT_APPLICABLE';
  safetySeal: 'INTACT' | 'BROKEN' | 'MISSING';
  overallCondition: 'GOOD' | 'FAIR' | 'POOR' | 'REJECTED';
  result: 'PASSED' | 'FAILED' | 'NEEDS_MAINTENANCE' | 'REJECTED';
  remarks?: string;
  nextInspectionDate?: string;
  createdAt: string;
}

export const inspectionApi = {
  list: (params: { page?: number; limit?: number; result?: string; inspectionType?: string; cylinderId?: string } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') searchParams.append(key, String(val));
    });
    return api.get<{
      success: boolean;
      data: Inspection[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/inspections?${searchParams.toString()}`);
  },

  getStats: () =>
    api.get<{
      success: boolean;
      stats: { total: number; byResult: Record<string, number> };
    }>('/inspections/stats'),

  create: (data: any) => api.post<{ success: boolean; inspection: Inspection }>('/inspections', data),
};
