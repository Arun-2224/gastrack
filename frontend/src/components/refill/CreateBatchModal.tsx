import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { refillApi } from '../../api/refill';
import { cylinderApi } from '../../api/cylinders';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../ui/Badge';

interface CreateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBatchModal: React.FC<CreateBatchModalProps> = ({ isOpen, onClose }) => {
  const [refillPlantId, setRefillPlantId] = useState('');
  const [selectedCylinders, setSelectedCylinders] = useState<string[]>([]);
  const [expectedDate, setExpectedDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const { data: plantsData } = useQuery({
    queryKey: ['refill-plants'],
    queryFn: () => refillApi.getPlants(),
    enabled: isOpen,
  });

  // Query empty / returned cylinders waiting for refill
  const { data: emptyCylinders } = useQuery({
    queryKey: ['cylinders-empty-for-refill'],
    queryFn: () => cylinderApi.list({ status: 'EMPTY', limit: 50 }),
    enabled: isOpen,
  });

  const toggleCylinder = (id: string) => {
    if (selectedCylinders.includes(id)) {
      setSelectedCylinders(selectedCylinders.filter((c) => c !== id));
    } else {
      setSelectedCylinders([...selectedCylinders, id]);
    }
  };

  const selectAll = () => {
    if (!emptyCylinders?.data) return;
    if (selectedCylinders.length === emptyCylinders.data.length) {
      setSelectedCylinders([]);
    } else {
      setSelectedCylinders(emptyCylinders.data.map((c) => c._id));
    }
  };

  const mutation = useMutation({
    mutationFn: (data: any) => refillApi.createBatch(data),
    onSuccess: (res) => {
      success('Batch Dispatched', `Refill batch ${res.batch.batchId} created and sent to plant.`);
      queryClient.invalidateQueries({ queryKey: ['refill-batches'] });
      queryClient.invalidateQueries({ queryKey: ['cylinders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
      setSelectedCylinders([]);
    },
    onError: (err: any) => {
      error('Batch Creation Failed', err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refillPlantId) {
      error('Validation', 'Please select a refill plant.');
      return;
    }
    if (selectedCylinders.length === 0) {
      error('Validation', 'Please select at least one cylinder to refill.');
      return;
    }

    mutation.mutate({
      refillPlantId,
      cylinderIds: selectedCylinders,
      expectedCompletionDate: expectedDate,
      notes,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create & Dispatch Refill Batch"
      description="Consolidate empty cylinders and dispatch to bottling plant for refilling"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Destination Bottling Plant"
          value={refillPlantId}
          onChange={(e) => setRefillPlantId(e.target.value)}
          required
        >
          <option value="">Select plant...</option>
          {plantsData?.plants?.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.code}) • Cap: {p.capacity}
            </option>
          ))}
        </Select>

        <Input
          label="Expected Completion Date"
          type="date"
          value={expectedDate}
          onChange={(e) => setExpectedDate(e.target.value)}
          required
        />

        {/* Cylinder Selection Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Select Empty Cylinders ({selectedCylinders.length} selected)
            </label>
            {emptyCylinders?.data && emptyCylinders.data.length > 0 && (
              <button
                type="button"
                onClick={selectAll}
                className="text-xs text-teal-400 hover:text-teal-300 font-medium"
              >
                {selectedCylinders.length === emptyCylinders.data.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>

          <div className="max-h-52 overflow-y-auto rounded-xl bg-slate-950/70 border border-slate-800 p-2 space-y-1.5">
            {emptyCylinders?.data?.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 text-center">
                No empty cylinders currently awaiting refill. (Check inventory to mark cylinders as EMPTY or RETURNED).
              </p>
            ) : (
              emptyCylinders?.data?.map((cyl) => {
                const isChecked = selectedCylinders.includes(cyl._id);
                return (
                  <div
                    key={cyl._id}
                    onClick={() => toggleCylinder(cyl._id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition text-xs ${
                      isChecked
                        ? 'bg-teal-500/15 border-teal-500/40 text-teal-200'
                        : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded bg-slate-950 border-slate-700 text-teal-500"
                      />
                      <span className="font-mono font-bold">{cyl.serialNumber}</span>
                      <span className="text-slate-400">{cyl.capacity}kg • {cyl.cylinderType.replace('_', ' ')}</span>
                    </div>
                    <Badge status={cyl.status} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        <Input
          label="Batch Notes"
          placeholder="e.g. Standard 14.2kg bulk refill cycle, high-purity LPG"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={mutation.isPending}>
            Dispatch Batch ({selectedCylinders.length} units)
          </Button>
        </div>
      </form>
    </Modal>
  );
};
