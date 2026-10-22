import { api } from './client';

export interface DashboardSummary {
  totalCylinders: number;
  availableCylinders: number;
  inCustomerHands: number;
  inRefill: number;
  inInspection: number;
  inMaintenance: number;
  damagedOrLost: number;
  totalCustomers: number;
  deliveriesToday: number;
  completedToday: number;
  totalRevenue: number;
  totalOutstanding: number;
}

export interface DashboardResponse {
  success: boolean;
  summary: DashboardSummary;
  cylinderDistribution: { name: string; value: number; color: string }[];
  deliveryTrends: { _id: string; totalScheduled: number; delivered: number }[];
  revenueTrends: { _id: string; revenue: number }[];
  inspectionSummary: Record<string, number>;
  recentDeliveries: any[];
  recentAlerts: any[];
}

export const dashboardApi = {
  getSummary: () => api.get<DashboardResponse>('/dashboard/summary'),
};
