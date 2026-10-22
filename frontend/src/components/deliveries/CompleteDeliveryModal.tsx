import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Delivery, deliveryApi } from '../../api/deliveries';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, RotateCcw, CreditCard } from 'lucide-react';

interface CompleteDeliveryModalProps {
  delivery: Delivery | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CompleteDeliveryModal: React.FC<CompleteDeliveryModalProps> = ({
  delivery,
  isOpen,
  onClose,
}) => {
  const [paymentReceived, setPaymentReceived] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [returnedCylinderSerial, setReturnedCylinderSerial] = useState('');
  const [notes, setNotes] = useState('');

  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) =>
      deliveryApi.updateStatus(delivery!._id, {
        deliveryStatus: 'DELIVERED',
        ...data,
      }),
    onSuccess: (res) => {
      success('Delivery Completed', `Order ${res.delivery.deliveryId} successfully fulfilled.`);
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['cylinders'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    },
    onError: (err: any) => {
      error('Fulfillment Error', err.message);
    },
  });

  if (!delivery) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      paymentReceived,
      paymentMethod: paymentReceived ? paymentMethod : undefined,
      returnedCylinderSerial: returnedCylinderSerial.trim().toUpperCase() || undefined,
      notes: notes || `Delivered to customer ${delivery.customer.name}`,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Delivery Fulfillment"
      description={`Confirm delivery for order ${delivery.deliveryId} • Client: ${delivery.customer.name}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Allocated Cylinder:</span>
            <span className="font-mono font-bold text-teal-300">
              {delivery.cylinder?.serialNumber || 'N/A'} ({delivery.cylinder?.capacity}kg)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Order Amount:</span>
            <span className="font-bold text-slate-100">${delivery.paymentAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Delivery Address:</span>
            <span className="text-slate-300 truncate max-w-xs">{delivery.deliveryAddress}</span>
          </div>
        </div>

        {/* Payment Confirmation */}
        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-teal-400" /> Payment Collection
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
              <input
                type="checkbox"
                checked={paymentReceived}
                onChange={(e) => setPaymentReceived(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-400"
              />
              Collected Now (${delivery.paymentAmount})
            </label>
          </div>

          {paymentReceived && (
            <Select
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              options={[
                { value: 'UPI', label: 'UPI / QR Code Scan' },
                { value: 'CASH', label: 'Cash on Delivery' },
                { value: 'CARD', label: 'Debit / Credit Card (POS)' },
                { value: 'BANK_TRANSFER', label: 'Direct Bank Wire' },
              ]}
            />
          )}

          {!paymentReceived && (
            <p className="text-[11px] text-amber-400">
              Note: Uncollected amount (${delivery.paymentAmount}) will be added to customer's outstanding balance.
            </p>
          )}
        </div>

        {/* Cylinder Exchange */}
        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-purple-400" /> Empty Cylinder Return (Optional)
          </label>
          <Input
            placeholder="e.g. GT-LPG-0072 (Scan / enter serial if exchanging)"
            value={returnedCylinderSerial}
            onChange={(e) => setReturnedCylinderSerial(e.target.value)}
            helperText="If customer returned an empty cylinder, enter its serial to update inventory status to RETURNED."
          />
        </div>

        <Input
          label="Completion Notes"
          placeholder="e.g. Handed to building superintendent"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="success" isLoading={mutation.isPending}>
            <CheckCircle2 className="w-4 h-4" /> Finalize Delivery
          </Button>
        </div>
      </form>
    </Modal>
  );
};
