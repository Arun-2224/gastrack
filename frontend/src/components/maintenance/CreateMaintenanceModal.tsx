import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenanceApi } from '../../api/maintenance';
import { cylinderApi } from '../../api/cylinders';
import { api } from '../../api/client';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

interface CreateMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateMaintenanceModal: React.FC<CreateMaintenanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [cylinderId, setCylinderId] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('VALVE_REPLACEMENT');
  const [description, setDescription] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [cost, setCost] = useState('45');
  const [notes, setNotes] = useState('');

  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const { data: cylindersData } = useQuery({
    queryKey: ['cylinders-for-maint'],
    queryFn: () => cylinderApi.list({ limit: 50 }),
    enabled: isOpen,
  });

  const { data: techData } = useQuery({
    queryKey: ['maint-technicians'],
    queryFn: () => api.get<{ success: boolean; users: any[] }>('/auth/users?role=MAINTENANCE_STAFF'),
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: (data: any) => maintenanceApi.create(data),
    onSuccess: (res) => {
      success('Ticket Opened', `Maintenance job ${res.job.maintenanceId} created.`);
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['cylinders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    },
    onError: (err: any) => {
      error('Creation Error', err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cylinderId || !description || !technicianId) {
      error('Validation', 'Please select cylinder, technician, and provide a description.');
      return;
    }

    mutation.mutate({
      cylinderId,
      maintenanceType,
      description,
      technicianId,
      cost: parseFloat(cost) || 0,
      notes,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Open Maintenance Work Order"
      description="Route defective or overdue cylinder to maintenance workshop for overhaul"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Cylinder Requiring Service"
          value={cylinderId}
          onChange={(e) => setCylinderId(e.target.value)}
          required
        >
          <option value="">Select cylinder...</option>
          {cylindersData?.data.map((cyl) => (
            <option key={cyl._id} value={cyl._id}>
              {cyl.serialNumber} ({cyl.status} • {cyl.condition} • {cyl.capacity}kg)
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Service Scope"
            value={maintenanceType}
            onChange={(e) => setMaintenanceType(e.target.value)}
            options={[
              { value: 'VALVE_REPLACEMENT', label: 'Valve Replacement' },
              { value: 'HYDROSTATIC_TEST', label: 'Hydrostatic Pressure Test' },
              { value: 'RE_PAINTING', label: 'Shot-blasting & Re-painting' },
              { value: 'COLLAR_REPAIR', label: 'Valve Guard Collar Repair' },
              { value: 'FOOT_RING_REPAIR', label: 'Foot Ring Straightening' },
              { value: 'INTERNAL_CLEANING', label: 'Internal Sludge Cleaning' },
              { value: 'OTHER', label: 'General Overhaul' },
            ]}
          />

          <Select
            label="Assigned Lead Technician"
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
            required
          >
            <option value="">Select technician...</option>
            {techData?.users.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>

        <Input
          label="Estimated Cost ($)"
          type="number"
          step="0.01"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />

        <Input
          label="Work Order Description"
          placeholder="e.g. Replace worn brass relief valve; re-torque to standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <Input
          label="Notes / Special Instructions"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={mutation.isPending}>
            Issue Work Order
          </Button>
        </div>
      </form>
    </Modal>
  );
};
