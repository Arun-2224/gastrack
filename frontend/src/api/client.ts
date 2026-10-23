import { handleMockApi } from './mockData';

const RAW_URL = (import.meta.env.VITE_API_URL as string | undefined) || '';
const isStaticHost =
  typeof window !== 'undefined' &&
  (window.location.hostname.endsWith('github.io') || window.location.protocol === 'file:');

const shouldUseMock = !RAW_URL && isStaticHost;

const BASE_URL = RAW_URL
  ? (RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api`)
  : '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (shouldUseMock) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return handleMockApi(endpoint, options) as T;
  }

  const token = localStorage.getItem('gastrack_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if ((response.status === 405 || response.status === 404) && !RAW_URL) {
      console.warn(`[GasTrack] Received ${response.status} on static host. Serving from interactive demo data.`);
      return handleMockApi(endpoint, options) as T;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const error: any = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err: any) {
    if (!RAW_URL) {
      console.warn('[GasTrack] Network request failed on static host. Serving from interactive demo data.');
      return handleMockApi(endpoint, options) as T;
    }
    throw err;
  }
}

export const api = {
  get: <T = any>(url: string) => apiRequest<T>(url, { method: 'GET' }),
  post: <T = any>(url: string, body?: any) =>
    apiRequest<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T = any>(url: string, body?: any) =>
    apiRequest<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T = any>(url: string) => apiRequest<T>(url, { method: 'DELETE' }),
};
