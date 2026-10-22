import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { refillApi, RefillBatch } from '../api/refill';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CreateBatchModal } from '../components/refill/CreateBatchModal';
import { BatchDetailModal } from '../components/refill/BatchDetailModal';
import {
  RotateCw,
  Factory,
  Plus,
  Boxes,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RefillPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<RefillBatch | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data: plantsData } = useQuery({
    queryKey: ['refill-plants'],
    queryFn: () => refillApi.getPlants(),
  });

  const { data: batchesData, isLoading } = useQuery({
    queryKey: ['refill-batches'],
    queryFn: () => refillApi.getBatches({ limit: 25 }),
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <RotateCw className="w-7 h-7 text-teal-400" /> Refilling Cycle Operations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Bulk refill batch creation, bottling terminal dispatch, and quality assurance pipeline
          </p>
        </div>

        {hasRole('ADMIN', 'MANAGER', 'INVENTORY_STAFF') && (
          <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4" /> Dispatch Refill Batch
          </Button>
        )}
      </div>

      {/* Refill Plants Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plantsData?.plants?.map((plant) => (
          <Card key={plant._id} className="p-5 bg-slate-900/60 border-slate-800 flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0">
              <Factory className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-100 truncate">{plant.name}</h3>
                <Badge variant="success">{plant.status}</Badge>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{plant.code}</p>
              <p className="text-xs text-slate-400 mt-1">{plant.address}</p>

              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500">Rated Capacity:</span>
                  <span className="ml-1 font-semibold text-slate-200">{plant.capacity} cyl/day</span>
                </div>
                <div>
                  <span className="text-slate-500">Contact:</span>
                  <span className="ml-1 font-semibold text-slate-300">{plant.phone || plant.contactPerson}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Refill Batches Pipeline Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" /> Active Refill Batches Pipeline
          </h2>
          <span className="text-xs text-slate-400">
            {batchesData?.data?.length || 0} batches recorded
          </span>
        </div>

        <Card className="p-0 overflow-hidden bg-slate-900/60 border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Batch ID</th>
                  <th className="py-3.5 px-4">Bottling Plant</th>
                  <th className="py-3.5 px-4">Cylinders Count</th>
                  <th className="py-3.5 px-4">Dispatched Date</th>
                  <th className="py-3.5 px-4">Target Date</th>
                  <th className="py-3.5 px-4">Stage Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <RotateCw className="w-6 h-6 animate-spin mx-auto text-teal-400 mb-2" />
                      Loading refill batches...
                    </td>
                  </tr>
                ) : batchesData?.data?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No refill batches recorded. Dispatch a new batch above!
                    </td>
                  </tr>
                ) : (
                  batchesData?.data?.map((batch) => (
                    <tr key={batch._id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                        {batch.batchId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200">{batch.refillPlant?.name}</span>
                        <div className="text-[11px] text-slate-500">{batch.refillPlant?.code}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-teal-300 font-mono text-sm">
                          {batch.cylinders?.length || 0}
                        </span>{' '}
                        cylinders
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {new Date(batch.createdDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {batch.expectedCompletionDate
                          ? new Date(batch.expectedCompletionDate).toLocaleDateString()
                          : 'Standard'}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={batch.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedBatch(batch);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-400" /> Manage Batch
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modals */}
      <CreateBatchModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      <BatchDetailModal
        batch={selectedBatch}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};
