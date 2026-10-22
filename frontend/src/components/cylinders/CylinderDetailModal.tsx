import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cylinder, cylinderApi } from '../../api/cylinders';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RotateCw, MapPin, User, Calendar, History, ArrowRightLeft, ShieldCheck, Flame } from 'lucide-react';

interface CylinderDetailModalProps {
  cylinder: Cylinder | null;
  isOpen: boolean;
  onClose: () => void;
  onTransitionClick: (cylinder: Cylinder) => void;
}

export const CylinderDetailModal: React.FC<CylinderDetailModalProps> = ({
  cylinder,
  isOpen,
  onClose,
  onTransitionClick,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'movements'>('details');

  const { data: historyData, isLoading: loadingHistory } = useQuery({
    queryKey: ['cylinder-history', cylinder?._id],
    queryFn: () => cylinderApi.getHistory(cylinder!._id),
    enabled: !!cylinder && activeTab === 'history',
  });

  const { data: movementData, isLoading: loadingMovements } = useQuery({
    queryKey: ['cylinder-movements', cylinder?._id],
    queryFn: () => cylinderApi.getMovements(cylinder!._id),
    enabled: !!cylinder && activeTab === 'movements',
  });

  if (!cylinder) return null;

  // Complete cylinder lifecycle pipeline steps
  const lifecycleSteps = [
    { label: 'Received', status: 'RECEIVED' },
    { label: 'Available', status: 'AVAILABLE' },
    { label: 'Assigned', status: 'ASSIGNED' },
    { label: 'Delivered', status: 'DELIVERED' },
    { label: 'Returned', status: 'RETURNED' },
    { label: 'In Refill', status: 'IN_REFILL' },
    { label: 'Inspection', status: 'INSPECTION' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${cylinder.serialNumber} (${cylinder.cylinderId})`}
      description={`Brand: ${cylinder.brand} • ${cylinder.capacity} kg Capacity`}
      maxWidth="3xl"
    >
      {/* Lifecycle Stepper */}
      <div className="mb-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-teal-400" /> Current Lifecycle Progression
        </p>
        <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2 text-xs">
          {lifecycleSteps.map((step, idx) => {
            const isCurrent = cylinder.status === step.status;
            return (
              <div key={step.status} className="flex items-center gap-2 shrink-0">
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium ${
                    isCurrent
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-md shadow-teal-500/20 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCurrent ? 'bg-teal-400 animate-pulse' : 'bg-slate-600'
                    }`}
                  />
                  {step.label}
                </div>
                {idx < lifecycleSteps.length - 1 && (
                  <span className="text-slate-600 font-mono">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'details'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          General Specs
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" /> Status History
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
            activeTab === 'movements'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" /> Inventory Movements
        </button>
      </div>

      {/* Tab: Details */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">Current Status</span>
              <div className="mt-1">
                <Badge status={cylinder.status} />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">Physical Condition</span>
              <div className="mt-1">
                <Badge status={cylinder.condition} />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">Cylinder Type</span>
              <p className="text-sm font-semibold text-slate-200 mt-1">
                {cylinder.cylinderType.replace('_', ' ')}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">Total Refill Cycles</span>
              <p className="text-sm font-semibold text-teal-400 mt-1 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> {cylinder.refillCount || 0} refills
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">Last Inspection</span>
              <p className="text-sm font-semibold text-slate-300 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {cylinder.lastInspectionDate
                  ? new Date(cylinder.lastInspectionDate).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">Next Safety Inspection</span>
              <p className="text-sm font-semibold text-amber-400 mt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {cylinder.nextInspectionDate
                  ? new Date(cylinder.nextInspectionDate).toLocaleDateString()
                  : 'Pending'}
              </p>
            </div>
          </div>

          {/* Current Custody / Location */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Current Custody & Location
            </h4>
            {cylinder.currentCustomer ? (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    {cylinder.currentCustomer.name} ({cylinder.currentCustomer.customerId})
                  </p>
                  <p className="text-xs text-slate-400">
                    Phone: {cylinder.currentCustomer.phone} • Type: {cylinder.currentCustomer.customerType}
                  </p>
                </div>
              </div>
            ) : cylinder.currentLocation ? (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-teal-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-100">{cylinder.currentLocation.name}</p>
                  <p className="text-xs text-slate-400">Type: {cylinder.currentLocation.type}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No active assignment location recorded</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onTransitionClick(cylinder);
              }}
            >
              Update Cylinder Status
            </Button>
          </div>
        </div>
      )}

      {/* Tab: History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {loadingHistory ? (
            <p className="text-xs text-slate-400 py-6 text-center">Loading audit history...</p>
          ) : historyData?.history?.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No status history found.</p>
          ) : (
            <div className="divide-y divide-slate-800">
              {historyData?.history?.map((h: any) => (
                <div key={h._id} className="py-3 flex items-start justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {h.previousStatus ? (
                        <>
                          <Badge status={h.previousStatus} />
                          <span className="text-slate-500">→</span>
                          <Badge status={h.newStatus} />
                        </>
                      ) : (
                        <Badge status={h.newStatus} />
                      )}
                    </div>
                    <p className="text-slate-300 font-medium">{h.notes}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Changed by: {h.changedBy?.name || 'System'} ({h.changedBy?.role || 'Staff'})
                    </p>
                  </div>
                  <span className="text-slate-500 text-[11px] shrink-0">
                    {new Date(h.timestamp || h.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Movements */}
      {activeTab === 'movements' && (
        <div className="space-y-3">
          {loadingMovements ? (
            <p className="text-xs text-slate-400 py-6 text-center">Loading movement log...</p>
          ) : movementData?.movements?.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No inventory movements found.</p>
          ) : (
            <div className="divide-y divide-slate-800">
              {movementData?.movements?.map((m: any) => (
                <div key={m._id} className="py-3 flex items-start justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded font-mono font-semibold bg-slate-800 text-teal-300 border border-slate-700">
                        {m.movementType}
                      </span>
                      {m.fromLocation && (
                        <span className="text-slate-400">from {m.fromLocation.name}</span>
                      )}
                      {m.toLocation && (
                        <span className="text-slate-400">to {m.toLocation.name}</span>
                      )}
                    </div>
                    <p className="text-slate-300">{m.notes}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Logged by: {m.performedBy?.name || 'Staff'}
                    </p>
                  </div>
                  <span className="text-slate-500 text-[11px] shrink-0">
                    {new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
