import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RefillBatch, refillApi } from '../../api/refill';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useToast } from '../../context/ToastContext';
import { Boxes, Factory, CheckCircle2, RotateCw } from 'lucide-react';

interface BatchDetailModalProps {
  batch: RefillBatch | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BatchDetailModal: React.FC<BatchDetailModalProps> = ({
  batch,
  isOpen,
  onClose,
}) => {
  const [newStatus, setNewStatus] = useState<string>('IN_PROGRESS');
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  React.useEffect(() => {
    if (batch) setNewStatus(batch.status);
  }, [batch]);

  const mutation = useMutation({
    mutationFn: (status: string) =>
      refillApi.updateBatchStatus(batch!._id, { status }),
    onSuccess: (res) => {
      success('Batch Status Updated', `Batch ${res.batch.batchId} updated to ${res.batch.status}.`);
      queryClient.invalidateQueries({ queryKey: ['refill-batches'] });
      queryClient.invalidateQueries({ queryKey: ['cylinders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    },
    onError: (err: any) => {
      error('Update Error', err.message);
    },
  });

  if (!batch) return null;

  const statusPipeline = [
    'CREATED',
    'SENT',
    'IN_PROGRESS',
    'COMPLETED',
    'QUALITY_CHECK',
    'APPROVED',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Batch ${batch.batchId}`}
      description={`Plant: ${batch.refillPlant?.name || 'Refill Plant'} (${batch.refillPlant?.code})`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Pipeline Stepper */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Refill Pipeline Progress
          </p>
          <div className="flex items-center justify-between gap-1 overflow-x-auto text-[11px]">
            {statusPipeline.map((st, idx) => {
              const isCurrent = batch.status === st;
              return (
                <div key={st} className="flex items-center gap-1 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-lg border font-medium ${
                      isCurrent
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    {st}
                  </span>
                  {idx < statusPipeline.length - 1 && <span className="text-slate-700">→</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Batch Status Update Control */}
        <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Update Refill Phase
            </span>
            <Badge status={batch.status} />
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              options={[
                { value: 'SENT', label: 'SENT (Dispatched to Plant)' },
                { value: 'IN_PROGRESS', label: 'IN_PROGRESS (Filling in Tanks)' },
                { value: 'COMPLETED', label: 'COMPLETED (Refill Finished)' },
                { value: 'QUALITY_CHECK', label: 'QUALITY_CHECK (Seal & Weight Check)' },
                { value: 'APPROVED', label: 'APPROVED (Ready for Safety Inspection)' },
                { value: 'REJECTED', label: 'REJECTED (Failed Plant Quality)' },
              ]}
            />
            <Button
              variant="primary"
              onClick={() => mutation.mutate(newStatus)}
              isLoading={mutation.isPending}
              disabled={newStatus === batch.status}
              className="shrink-0"
            >
              Update Stage
            </Button>
          </div>
        </div>

        {/* Cylinders inside batch */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-teal-400" /> Cylinders in Batch ({batch.cylinders?.length || 0} units)
          </h4>

          <div className="max-h-56 overflow-y-auto divide-y divide-slate-800/80 rounded-xl bg-slate-950/60 border border-slate-800">
            {batch.cylinders?.map((cyl: any) => (
              <div key={cyl._id} className="p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-100">{cyl.serialNumber}</span>
                  <p className="text-slate-400 text-[11px]">
                    {cyl.capacity}kg • {cyl.cylinderType?.replace('_', ' ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge status={cyl.condition || 'GOOD'} />
                  <Badge status={cyl.status || 'IN_REFILL'} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
