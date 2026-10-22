import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../../api/customers';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [customerType, setCustomerType] = useState('HOUSEHOLD');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Metro City');
  const [postalCode, setPostalCode] = useState('560001');

  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => customerApi.create(data),
    onSuccess: (res) => {
      success('Customer Registered', `${res.customer.name} (${res.customer.customerId}) added.`);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
    },
    onError: (err: any) => {
      error('Registration Failed', err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      error('Validation', 'Name, phone, and address are required.');
      return;
    }

    mutation.mutate({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      customerType,
      address: address.trim(),
      city,
      state: 'Metro State',
      postalCode,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Customer"
      description="Create a client profile for gas deliveries and cylinder assignment"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Customer / Business Name"
          placeholder="e.g. Blue Lagoon Hotel or Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Primary Phone"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <Select
            label="Customer Category"
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
            options={[
              { value: 'HOUSEHOLD', label: 'Household / Domestic' },
              { value: 'COMMERCIAL', label: 'Commercial (Hotel, Bakery)' },
              { value: 'INDUSTRIAL', label: 'Industrial (Factory, Plant)' },
            ]}
          />
        </div>

        <Input
          label="Email Address (Optional)"
          type="email"
          placeholder="contact@business.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Street Delivery Address"
          placeholder="Building, street, door number"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <Input
            label="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={mutation.isPending}>
            Register Customer
          </Button>
        </div>
      </form>
    </Modal>
  );
};
