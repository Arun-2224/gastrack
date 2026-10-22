import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { paymentApi, Payment } from '../api/payments';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { CreatePaymentModal } from '../components/payments/CreatePaymentModal';
import {
  CreditCard,
  Plus,
  DollarSign,
  TrendingUp,
  RotateCw,
  QrCode,
  Banknote,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PaymentsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ['payments', page, methodFilter],
    queryFn: () =>
      paymentApi.list({
        page,
        limit: 20,
        paymentMethod: methodFilter,
      }),
  });

  const { data: statsData } = useQuery({
    queryKey: ['payment-stats'],
    queryFn: () => paymentApi.getStats(),
  });

  const stats = statsData?.stats;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-teal-400" /> Revenue & Financial Ledger
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Reconciled payments, multi-channel receipts (UPI, Cash, Card, Bank), and audit logs
          </p>
        </div>

        {hasRole('ADMIN', 'MANAGER', 'DELIVERY_STAFF') && (
          <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4" /> Record Payment
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 bg-slate-900/60 border-teal-500/20">
          <span className="text-xs text-teal-400 font-medium flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" /> Total Realized Revenue
          </span>
          <p className="text-2xl font-bold text-white mt-1">
            ${(stats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-emerald-500/20">
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5" /> Instant UPI Volume
          </span>
          <p className="text-2xl font-bold text-emerald-300 mt-1">
            $
            {(
              stats?.byMethod?.find((m: any) => m._id === 'UPI')?.total || 0
            ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-blue-500/20">
          <span className="text-xs text-blue-400 font-medium flex items-center gap-1">
            <Banknote className="w-3.5 h-3.5" /> Cash on Delivery
          </span>
          <p className="text-2xl font-bold text-blue-300 mt-1">
            $
            {(
              stats?.byMethod?.find((m: any) => m._id === 'CASH')?.total || 0
            ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-purple-500/20">
          <span className="text-xs text-purple-400 font-medium flex items-center gap-1">
            <Building className="w-3.5 h-3.5" /> Card & Bank Wire
          </span>
          <p className="text-2xl font-bold text-purple-300 mt-1">
            $
            {(
              (stats?.byMethod?.find((m: any) => m._id === 'CARD')?.total || 0) +
              (stats?.byMethod?.find((m: any) => m._id === 'BANK_TRANSFER')?.total || 0)
            ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 bg-slate-900/70 border-slate-800">
        <div className="max-w-xs">
          <Select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Payment Channels' },
              { value: 'UPI', label: 'UPI / Scan QR' },
              { value: 'CASH', label: 'Cash' },
              { value: 'CARD', label: 'Credit / Debit Card' },
              { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
            ]}
          />
        </div>
      </Card>

      {/* Payments Ledger Table */}
      <Card className="p-0 overflow-hidden bg-slate-900/60 border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Receipt ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Delivery Ref</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Transaction Ref</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RotateCw className="w-6 h-6 animate-spin mx-auto text-teal-400 mb-2" />
                    Loading payment records...
                  </td>
                </tr>
              ) : paymentsData?.data?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                paymentsData?.data?.map((pay) => (
                  <tr key={pay._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                      {pay.paymentId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-200">{pay.customer?.name}</p>
                      <p className="text-[11px] text-slate-500">{pay.customer?.customerId}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {pay.delivery ? (pay.delivery as any).deliveryId : 'Direct Ledger'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400 text-sm">
                      ${pay.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          pay.paymentMethod === 'UPI'
                            ? 'success'
                            : pay.paymentMethod === 'CARD'
                            ? 'purple'
                            : 'info'
                        }
                      >
                        {pay.paymentMethod}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {pay.transactionReference || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {new Date(pay.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {pay.recordedBy?.name || 'Cashier'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <CreatePaymentModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
