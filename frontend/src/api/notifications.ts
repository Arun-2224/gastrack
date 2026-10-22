import { api } from './client';

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  list: (isRead?: boolean) => {
    const query = isRead !== undefined ? `?isRead=${isRead}` : '';
    return api.get<{ success: boolean; unreadCount: number; notifications: NotificationItem[] }>(
      `/notifications${query}`
    );
  },

  markAsRead: (id: string) => api.put<{ success: boolean }>(`/notifications/${id}/read`),

  markAllAsRead: () => api.put<{ success: boolean }>('/notifications/read-all'),
};
