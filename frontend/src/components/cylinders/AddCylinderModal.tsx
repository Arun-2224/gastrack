import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cylinderApi } from '../../api/cylinders';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

interface AddCylinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCylinderModal: React.FC<AddCylinderModalProps> = ({ isOpen, onClose }) => {
  const [serialNumber, setSerialNumber] = useState('');
  const [cylinderType, setCylinderType] = useState('DOMESTIC_14_2KG');
  const [capacity, setCapacity] = useState('14.2');
  const [brand, setBrand] = useState('GasTrack SuperGas');
  const [condition, setCondition] = useState('GOOD');

  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const handleTypeChange = (type: string) => {
    setCylinderType(type);
    if (type === 'DOMESTIC_14_2KG') setCapacity('14.2');
    else if (type === 'COMMERCIAL_19KG') setCapacity('19.0');
    else if (type === 'INDUSTRIAL_47_5KG') setCapacity('47.5');
    else if (type === 'CAMPING_5KG') setCapacity('5.0');
  };

  const mutation = useMutation({
    mutationFn: (data: any) => cylinderApi.create(data),
    onSuccess: (res) => {
      success('Cylinder Registered', `Serial: ${res.cylinder.serialNumber} added to inventory.`);
      queryClient.invalidateQueries({ queryKey: ['cylinders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
      setSerialNumber('');
    },
    onError: (err: any) => {
      error('Registration Failed', err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialNumber.trim()) {
      error('Validation Error', 'Serial Number is required.');
      return;
    }

    mutation.mutate({
      serialNumber: serialNumber.trim().toUpperCase(),
      cylinderType,
      capacity: parseFloat(capacity),
      brand,
      condition,
      status: 'AVAILABLE',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Cylinder"
      description="Commission a new LPG cylinder into the fleet management database"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Serial Number (Unique)"
          placeholder="e.g. GT-LPG-0106"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          required
        />

        <Select
          label="Cylinder Classification"
          value={cylinderType}
          onChange={(e) => handleTypeChange(e.target.value)}
          options={[
            { value: 'DOMESTIC_14_2KG', label: '14.2 kg Domestic Cylinder' },
            { value: 'COMMERCIAL_19KG', label: '19.0 kg Commercial Cylinder' },
            { value: 'INDUSTRIAL_47_5KG', label: '47.5 kg Industrial Heavy Duty' },
            { value: 'CAMPING_5KG', label: '5.0 kg Compact Camping' },
          ]}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Capacity (kg)"
            type="number"
            step="0.1"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
          <Input
            label="Brand / Manufacturer"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>

        <Select
          label="Initial Inspection Condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          options={[
            { value: 'GOOD', label: 'GOOD - Passed Factory Quality Check' },
            { value: 'FAIR', label: 'FAIR - Minor Scratches' },
          ]}
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={mutation.isPending}>
            Commission Cylinder
          </Button>
        </div>
      </form>
    </Modal>
  );
};
