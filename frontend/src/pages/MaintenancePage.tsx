import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inspectionApi, Inspection } from '../api/inspections';
import { maintenanceApi, MaintenanceJob } from '../api/maintenance';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { CreateInspectionModal } from '../components/maintenance/CreateInspectionModal';
import { CreateMaintenanceModal } from '../components/maintenance/CreateMaintenanceModal';
import { useToast } from '../context/ToastContext';
import {
  Wrench,
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MaintenancePage: React.FC = () => {
  const { hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'inspections' | 'maintenance'>('inspections');
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('ALL');
  const [maintStatus, setMaintStatus] = useState('ALL');

  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);

  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const { data: inspectionData, isLoading: loadingInspections } = useQuery({
    queryKey: ['inspections', resultFilter],
    queryFn: () => inspectionApi.list({ result: resultFilter, limit: 30 }),
    enabled: activeTab === 'inspections',
  });

  const { data: maintenanceData, isLoading: loadingMaintenance } = useQuery({
    queryKey: ['maintenance', maintStatus],
    queryFn: () => maintenanceApi.list({ status: maintStatus, limit: 30 }),
    enabled: activeTab === 'maintenance',
  });

  const { data: inspStats } = useQuery({
    queryKey: ['inspection-stats'],
    queryFn: () => inspectionApi.getStats(),
  });

  const { data: maintStats } = useQuery({
    queryKey: ['maintenance-stats'],
    queryFn: () => maintenanceApi.getStats(),
  });

  const completeMaintMutation = useMutation({
    mutationFn: (id: string) =>
      maintenanceApi.updateStatus(id, { status: 'COMPLETED' }),
    onSuccess: (res) => {
      success('Work Order Completed', `Job ${res.job.maintenanceId} marked complete. Cylinder routed to inspection.`);
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['cylinders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err: any) => {
      error('Update Error', err.message);
    },
  });

  const totalInspections = inspStats?.stats?.total || 0;
  const passedInspections = inspStats?.stats?.byResult?.PASSED || 0;
  const passRate = totalInspections > 0 ? Math.round((passedInspections / totalInspections) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Wrench className="w-7 h-7 text-teal-400" /> Maintenance & Safety Inspections
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Mandatory hydrostatic leak testing, valve overhaul workflows, and statutory safety records
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasRole('ADMIN', 'MANAGER', 'MAINTENANCE_STAFF', 'INVENTORY_STAFF') && (
            <Button variant="outline" onClick={() => setIsInspectionOpen(true)}>
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Log Inspection
            </Button>
          )}
          {hasRole('ADMIN', 'MANAGER', 'MAINTENANCE_STAFF') && (
            <Button variant="primary" onClick={() => setIsMaintenanceOpen(true)}>
              <Plus className="w-4 h-4" /> Open Work Order
            </Button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 bg-slate-900/60 border-slate-800">
          <span className="text-xs text-slate-400">Total Safety Inspections</span>
          <p className="text-2xl font-bold text-white mt-1">{totalInspections}</p>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-emerald-500/20">
          <span className="text-xs text-emerald-400">Compliance Pass Rate</span>
          <p className="text-2xl font-bold text-emerald-300 mt-1">{passRate}%</p>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-amber-500/20">
          <span className="text-xs text-amber-400">Active Work Orders</span>
          <p className="text-2xl font-bold text-amber-300 mt-1">
            {(maintStats?.stats?.byStatus?.PENDING || 0) + (maintStats?.stats?.byStatus?.IN_PROGRESS || 0)}
          </p>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-cyan-500/20">
          <span className="text-xs text-cyan-400">Cumulative Repair Costs</span>
          <p className="text-2xl font-bold text-cyan-300 mt-1">
            ${(maintStats?.stats?.totalCost || 0).toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('inspections')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition ${
            activeTab === 'inspections'
              ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Leak & Safety Inspections
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition ${
            activeTab === 'maintenance'
              ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Wrench className="w-4 h-4" /> Maintenance Work Orders
        </button>
      </div>

      {/* TAB 1: INSPECTIONS */}
      {activeTab === 'inspections' && (
        <div className="space-y-4">
          <Card className="p-4 bg-slate-900/70 border-slate-800">
            <div className="max-w-xs">
              <Select
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Inspection Results' },
                  { value: 'PASSED', label: 'Result: PASSED' },
                  { value: 'NEEDS_MAINTENANCE', label: 'Result: NEEDS_MAINTENANCE' },
                  { value: 'FAILED', label: 'Result: FAILED' },
                  { value: 'REJECTED', label: 'Result: REJECTED' },
                ]}
              />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden bg-slate-900/60 border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Inspection ID</th>
                    <th className="py-3.5 px-4">Cylinder Tested</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Scope</th>
                    <th className="py-3.5 px-4">Immersion Leak Test</th>
                    <th className="py-3.5 px-4">Valve / Body</th>
                    <th className="py-3.5 px-4">Verdict Result</th>
                    <th className="py-3.5 px-4">Inspector</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loadingInspections ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <RotateCw className="w-6 h-6 animate-spin mx-auto text-teal-400 mb-2" />
                        Loading safety inspections...
                      </td>
                    </tr>
                  ) : inspectionData?.data?.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No inspection records found.
                      </td>
                    </tr>
                  ) : (
                    inspectionData?.data?.map((insp) => (
                      <tr key={insp._id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                          {insp.inspectionId}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-teal-300">
                            {insp.cylinder?.serialNumber}
                          </span>
                          <p className="text-[11px] text-slate-400">
                            {insp.cylinder?.capacity}kg • {insp.cylinder?.cylinderType?.replace('_', ' ')}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {new Date(insp.inspectionDate).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {insp.inspectionType.replace('_', ' ')}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge status={insp.leakTest} />
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          <span>Valve: {insp.valveCondition}</span>
                          <div className="text-[11px] text-slate-500">Body: {insp.bodyCondition}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge status={insp.result} />
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {insp.inspector?.name || 'Safety Staff'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: MAINTENANCE WORK ORDERS */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <Card className="p-4 bg-slate-900/70 border-slate-800">
            <div className="max-w-xs">
              <Select
                value={maintStatus}
                onChange={(e) => setMaintStatus(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Ticket Statuses' },
                  { value: 'PENDING', label: 'PENDING' },
                  { value: 'IN_PROGRESS', label: 'IN_PROGRESS' },
                  { value: 'COMPLETED', label: 'COMPLETED' },
                  { value: 'CANCELLED', label: 'CANCELLED' },
                ]}
              />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden bg-slate-900/60 border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Work Order ID</th>
                    <th className="py-3.5 px-4">Cylinder</th>
                    <th className="py-3.5 px-4">Maintenance Scope</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4">Lead Technician</th>
                    <th className="py-3.5 px-4">Repair Cost</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loadingMaintenance ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <RotateCw className="w-6 h-6 animate-spin mx-auto text-teal-400 mb-2" />
                        Loading maintenance jobs...
                      </td>
                    </tr>
                  ) : maintenanceData?.data?.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No maintenance jobs recorded.
                      </td>
                    </tr>
                  ) : (
                    maintenanceData?.data?.map((job) => (
                      <tr key={job._id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                          {job.maintenanceId}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-teal-300">
                            {job.cylinder?.serialNumber}
                          </span>
                          <p className="text-[11px] text-slate-400">{job.cylinder?.capacity}kg</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-medium">
                          {job.maintenanceType.replace('_', ' ')}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 truncate max-w-xs">
                          {job.description}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {job.technician?.name || 'Technician'}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-200">
                          ${(job.cost || 0).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge status={job.status} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {job.status !== 'COMPLETED' && job.status !== 'CANCELLED' && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => completeMaintMutation.mutate(job._id)}
                              isLoading={completeMaintMutation.isPending}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Modals */}
      <CreateInspectionModal
        isOpen={isInspectionOpen}
        onClose={() => setIsInspectionOpen(false)}
      />

      <CreateMaintenanceModal
        isOpen={isMaintenanceOpen}
        onClose={() => setIsMaintenanceOpen(false)}
      />
    </div>
  );
};
