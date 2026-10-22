import { api } from './client';

export interface AuditLogItem {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  entity: string;
  entityId?: string;
  description: string;
  ipAddress?: string;
  createdAt: string;
}

export const auditApi = {
  list: (params: { page?: number; limit?: number; entity?: string; action?: string; search?: string } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') searchParams.append(key, String(val));
    });
    return api.get<{
      success: boolean;
      data: AuditLogItem[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/audit-logs?${searchParams.toString()}`);
  },
};
