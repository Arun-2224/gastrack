import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryApi } from '../../api/deliveries';
import { customerApi } from '../../api/customers';
import { cylinderApi } from '../../api/cylinders';
import { api } from '../../api/client';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

interface CreateDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDeliveryModal: React.FC<CreateDeliveryModalProps> = ({ isOpen, onClose }) => {
  const [customerId, setCustomerId] = useState('');
  const [cylinderId, setCylinderId] = useState('');
  const [deliveryStaffId, setDeliveryStaffId] = useState('');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('45');
  const [notes, setNotes] = useState('');

  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const { data: customerData } = useQuery({
    queryKey: ['customers-list-all'],
    queryFn: () => customerApi.list({ limit: 100 }),
    enabled: isOpen,
  });

  const { data: availableCylinders } = useQuery({
    queryKey: ['cylinders-available'],
    queryFn: () => cylinderApi.list({ status: 'AVAILABLE', limit: 50 }),
    enabled: isOpen,
  });

  const { data: staffData } = useQuery({
    queryKey: ['delivery-staff-users'],
    queryFn: () => api.get<{ success: boolean; users: any[] }>('/auth/users?role=DELIVERY_STAFF'),
    enabled: isOpen,
  });

  const handleCustomerSelect = (id: string) => {
    setCustomerId(id);
    const selected = customerData?.data.find((c) => c._id === id);
    if (selected) {
      setDeliveryAddress(`${selected.address}, ${selected.city}`);
      if (selected.customerType === 'INDUSTRIAL') setPaymentAmount('180');
      else if (selected.customerType === 'COMMERCIAL') setPaymentAmount('85');
      else setPaymentAmount('45');
    }
  };

  const mutation = useMutation({
    mutationFn: (data: any) => deliveryApi.create(data),
    onSuccess: (res) => {
      success('Delivery Scheduled', `Dispatch order ${res.delivery.deliveryId} created.`);
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['cylinders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    },
    onError: (err: any) => {
      error('Failed to Schedule', err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
      error('Validation', 'Please select a customer.');
      return;
    }
    if (!cylinderId) {
      error('Validation', 'Please allocate an available cylinder.');
      return;
    }

    mutation.mutate({
      customerId,
      cylinderId,
      deliveryStaffId: deliveryStaffId || undefined,
      scheduledDate,
      deliveryAddress,
      paymentAmount: parseFloat(paymentAmount),
      notes,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Delivery Dispatch"
      description="Create a delivery order and allocate an available cylinder to the route"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Select
            label="Customer Client"
            value={customerId}
            onChange={(e) => handleCustomerSelect(e.target.value)}
            required
          >
            <option value="">Select customer...</option>
            {customerData?.data.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.customerId}) - {c.customerType}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Allocate Cylinder"
            value={cylinderId}
            onChange={(e) => setCylinderId(e.target.value)}
            required
          >
            <option value="">Select available cylinder...</option>
            {availableCylinders?.data.map((cyl) => (
              <option key={cyl._id} value={cyl._id}>
                {cyl.serialNumber} ({cyl.capacity}kg • {cyl.cylinderType.replace('_', ' ')})
              </option>
            ))}
          </Select>

          <Select
            label="Assign Delivery Driver"
            value={deliveryStaffId}
            onChange={(e) => setDeliveryStaffId(e.target.value)}
          >
            <option value="">Unassigned (Route Pool)</option>
            {staffData?.users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.phone || 'Driver'})
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Scheduled Delivery Date"
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
          />

          <Input
            label="Order Amount ($)"
            type="number"
            step="0.01"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            required
          />
        </div>

        <Input
          label="Delivery Address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          required
        />

        <Input
          label="Dispatch Notes / Instructions"
          placeholder="e.g. Ring gate bell, exchange 1 empty 14.2kg cylinder"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={mutation.isPending}>
            Confirm Delivery
          </Button>
        </div>
      </form>
    </Modal>
  );
};
