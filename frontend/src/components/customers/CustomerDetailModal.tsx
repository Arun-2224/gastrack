import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { customerApi, Customer } from '../../api/customers';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Boxes, Truck, Phone, Mail, MapPin, DollarSign } from 'lucide-react';

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['customer-detail', customer?._id],
    queryFn: () => customerApi.getById(customer!._id),
    enabled: !!customer && isOpen,
  });

  if (!customer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${customer.name} (${customer.customerId})`}
      description={`Type: ${customer.customerType} • Status: ${customer.status}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Contact & Balance Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-teal-400" /> Phone
            </span>
            <p className="text-sm font-semibold text-slate-200 mt-1">{customer.phone}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Boxes className="w-3.5 h-3.5 text-blue-400" /> Cylinders Held
            </span>
            <p className="text-sm font-semibold text-blue-300 mt-1">
              {customer.cylinderCount || 0} units
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-rose-400" /> Outstanding Balance
            </span>
            <p className="text-sm font-semibold text-rose-300 mt-1">
              ${(customer.outstandingBalance || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-slate-200">Delivery Address</p>
            <p className="text-slate-400">{customer.address}, {customer.city} {customer.postalCode}</p>
          </div>
        </div>

        {/* Assigned Cylinders */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-teal-400" /> Cylinders Currently At Customer Location
          </h4>
          {isLoading ? (
            <p className="text-xs text-slate-400">Loading cylinders...</p>
          ) : data?.cylinders?.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              No cylinders currently recorded in customer custody.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data?.cylinders?.map((cyl) => (
                <div
                  key={cyl._id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-100 font-mono">{cyl.serialNumber}</span>
                    <p className="text-slate-400 text-[11px]">
                      {cyl.capacity}kg • {cyl.cylinderType.replace('_', ' ')}
                    </p>
                  </div>
                  <Badge status={cyl.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Deliveries */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-blue-400" /> Recent Deliveries
          </h4>
          {isLoading ? (
            <p className="text-xs text-slate-400">Loading deliveries...</p>
          ) : data?.deliveries?.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No delivery history found.</p>
          ) : (
            <div className="divide-y divide-slate-800/80 rounded-xl bg-slate-950/50 border border-slate-800/60 overflow-hidden">
              {data?.deliveries?.map((d: any) => (
                <div key={d._id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 font-mono">{d.deliveryId}</span>
                      <Badge status={d.deliveryStatus} />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Scheduled: {new Date(d.scheduledDate).toLocaleDateString()} • Staff: {d.deliveryStaff?.name || 'Unassigned'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-200">${d.paymentAmount}</span>
                    <p className="text-[10px]">
                      <Badge status={d.paymentStatus} className="px-1.5 py-0 text-[10px]" />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
