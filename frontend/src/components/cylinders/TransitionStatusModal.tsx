import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Cylinder, cylinderApi } from '../../api/cylinders';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

interface TransitionStatusModalProps {
  cylinder: Cylinder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransitionStatusModal: React.FC<TransitionStatusModalProps> = ({
  cylinder,
  isOpen,
  onClose,
}) => {
  const [newStatus, setNewStatus] = useState<string>('AVAILABLE');
  const [newCondition, setNewCondition] = useState<string>('GOOD');
  const [notes, setNotes] = useState<string>('');
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  React.useEffect(() => {
    if (cylinder) {
      setNewStatus(cylinder.status);
      setNewCondition(cylinder.condition);
      setNotes('');
    }
  }, [cylinder]);

  const mutation = useMutation({
    mutationFn: (data: { status: string; condition: string; notes: string }) =>
      cylinderApi.transitionStatus(cylinder!._id, data),
    onSuccess: (res) => {
      success('Status Updated', res.message);
      queryClient.invalidateQueries({ queryKey: ['cylinders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    },
    onError: (err: any) => {
      error('Transition Rejected', err.message);
    },
  });

  if (!cylinder) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      status: newStatus,
      condition: newCondition,
      notes,
    });
  };

  const statusOptions = [
    { value: 'AVAILABLE', label: 'AVAILABLE (Ready for Dispatch)' },
    { value: 'FILLED', label: 'FILLED (Stock at Warehouse)' },
    { value: 'EMPTY', label: 'EMPTY (Awaiting Refill)' },
    { value: 'ASSIGNED', label: 'ASSIGNED (Allocated to Delivery Route)' },
    { value: 'DELIVERED', label: 'DELIVERED (At Customer Premises)' },
    { value: 'RETURNED', label: 'RETURNED (Empty Received from Customer)' },
    { value: 'IN_REFILL', label: 'IN_REFILL (At Bottling Plant)' },
    { value: 'INSPECTION', label: 'INSPECTION (Safety & Leak Testing)' },
    { value: 'MAINTENANCE', label: 'MAINTENANCE (Repair / Valve Overhaul)' },
    { value: 'DAMAGED', label: 'DAMAGED (Safety Defect Flagged)' },
    { value: 'LOST', label: 'LOST (Reported Missing)' },
    { value: 'RETIRED', label: 'RETIRED (Decommissioned from Service)' },
  ];

  const conditionOptions = [
    { value: 'GOOD', label: 'GOOD - Clean & Passable' },
    { value: 'FAIR', label: 'FAIR - Minor Scratches' },
    { value: 'DAMAGED', label: 'DAMAGED - Dented / Leaking' },
    { value: 'CRITICAL', label: 'CRITICAL - Urgent Hazard' },
    { value: 'REJECTED', label: 'REJECTED - Structural Failure' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cylinder Lifecycle Transition"
      description={`Update status & record audit movement for ${cylinder.serialNumber}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
          <p>
            Current Status: <span className="font-bold text-teal-400">{cylinder.status}</span>
          </p>
          <p>
            Current Condition: <span className="font-bold text-slate-200">{cylinder.condition}</span>
          </p>
        </div>

        <Select
          label="New Lifecycle Status"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          options={statusOptions}
        />

        <Select
          label="Cylinder Physical Condition"
          value={newCondition}
          onChange={(e) => setNewCondition(e.target.value)}
          options={conditionOptions}
        />

        <Input
          label="Reason / Audit Notes"
          placeholder="e.g. Returned by customer, scheduled for annual hydro-test"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={mutation.isPending}>
            Apply Status Change
          </Button>
        </div>
      </form>
    </Modal>
  );
};
