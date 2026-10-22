import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditApi } from '../api/audit';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { History, Search, RotateCw, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [entity, setEntity] = useState('ALL');
  const [action, setAction] = useState('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', page, search, entity, action],
    queryFn: () =>
      auditApi.list({
        page,
        limit: 30,
        search,
        entity,
        action,
      }),
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <History className="w-7 h-7 text-teal-400" /> System Audit & Security Trail
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Cryptographically immutable audit records tracking every cylinder lifecycle shift, user login, and financial transaction
        </p>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 bg-slate-900/70 border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Input
              placeholder="Search description, entity ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          </div>

          <Select
            value={entity}
            onChange={(e) => {
              setEntity(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Tracked Entities' },
              { value: 'Cylinder', label: 'Cylinder' },
              { value: 'Delivery', label: 'Delivery' },
              { value: 'Customer', label: 'Customer' },
              { value: 'RefillBatch', label: 'RefillBatch' },
              { value: 'Inspection', label: 'Inspection' },
              { value: 'Maintenance', label: 'Maintenance' },
              { value: 'Payment', label: 'Payment' },
              { value: 'User', label: 'User Auth' },
            ]}
          />

          <Select
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Operation Types' },
              { value: 'USER_LOGIN', label: 'USER_LOGIN' },
              { value: 'CYLINDER_STATUS_CHANGE', label: 'CYLINDER_STATUS_CHANGE' },
              { value: 'CYLINDER_CREATE', label: 'CYLINDER_CREATE' },
              { value: 'DELIVERY_CREATE', label: 'DELIVERY_CREATE' },
              { value: 'DELIVERY_STATUS_CHANGE', label: 'DELIVERY_STATUS_CHANGE' },
              { value: 'REFILL_BATCH_CREATE', label: 'REFILL_BATCH_CREATE' },
              { value: 'INSPECTION_COMPLETE', label: 'INSPECTION_COMPLETE' },
              { value: 'PAYMENT_CREATE', label: 'PAYMENT_CREATE' },
            ]}
          />
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card className="p-0 overflow-hidden bg-slate-900/60 border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">User Operator</th>
                <th className="py-3.5 px-4">Operation</th>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Entity Target ID</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RotateCw className="w-6 h-6 animate-spin mx-auto text-teal-400 mb-2" />
                    Querying audit trail from MongoDB...
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No audit records matching query.
                  </td>
                </tr>
              ) : (
                data?.data?.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-200">
                        {log.user?.name || 'Automated System'}
                      </span>
                      <div className="text-[11px] text-teal-400 font-mono">
                        {log.user?.role || 'SYSTEM'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-mono font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-300">
                      {log.entity}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-teal-300">
                      {log.entityId || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-sm truncate">
                      {log.description}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {data && data.pagination && data.pagination.pages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Page {data.pagination.page} of {data.pagination.pages} ({data.pagination.total} audit records)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.pagination.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
