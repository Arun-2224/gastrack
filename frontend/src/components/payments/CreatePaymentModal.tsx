import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../../api/payments';
import { customerApi } from '../../api/customers';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

interface CreatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePaymentModal: React.FC<CreatePaymentModalProps> = ({ isOpen, onClose }) => {
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('85');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'OTHER'>('UPI');
  const [transactionReference, setTransactionReference] = useState('');

  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const { data: customerData } = useQuery({
    queryKey: ['customers-for-payment'],
    queryFn: () => customerApi.list({ limit: 100 }),
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: (data: any) => paymentApi.create(data),
    onSuccess: (res) => {
      success('Payment Recorded', `Receipt ${res.payment.paymentId} issued.`);
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    },
    onError: (err: any) => {
      error('Payment Error', err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
      error('Validation', 'Please select customer.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      error('Validation', 'Payment amount must be greater than zero.');
      return;
    }

    mutation.mutate({
      customerId,
      amount: numAmount,
      paymentMethod,
      transactionReference: transactionReference || `TXN-${paymentMethod}-${Date.now().toString().slice(-6)}`,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Customer Payment"
      description="Issue payment receipt and reconcile against client outstanding balance"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Paying Customer"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
        >
          <option value="">Select customer...</option>
          {customerData?.data.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.customerId}) - Balance: ${c.outstandingBalance || 0}
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Amount Paid ($)"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            options={[
              { value: 'UPI', label: 'UPI / Instant QR' },
              { value: 'CASH', label: 'Cash on Counter' },
              { value: 'CARD', label: 'Debit / Credit Card' },
              { value: 'BANK_TRANSFER', label: 'Direct Bank Wire' },
              { value: 'OTHER', label: 'Check / Other' },
            ]}
          />
        </div>

        <Input
          label="Transaction Reference / Cheque #"
          placeholder="e.g. UPI-REF-992144 or Wire Ref"
          value={transactionReference}
          onChange={(e) => setTransactionReference(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={mutation.isPending}>
            Record Payment Receipt
          </Button>
        </div>
      </form>
    </Modal>
  );
};
