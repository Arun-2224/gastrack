import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryApi, Delivery } from '../api/deliveries';
import { customerApi, Customer } from '../api/customers';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { CreateDeliveryModal } from '../components/deliveries/CreateDeliveryModal';
import { CompleteDeliveryModal } from '../components/deliveries/CompleteDeliveryModal';
import { CreateCustomerModal } from '../components/customers/CreateCustomerModal';
import { CustomerDetailModal } from '../components/customers/CustomerDetailModal';
import { useToast } from '../context/ToastContext';
import {
  Truck,
  Users,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  RotateCw,
  Eye,
  DollarSign,
  AlertCircle,
  Navigation,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CustomersPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'deliveries' | 'customers'>('deliveries');
  const [search, setSearch] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('ALL');
  const [customerType, setCustomerType] = useState('ALL');
  const [page, setPage] = useState(1);

  const [isCreateDeliveryOpen, setIsCreateDeliveryOpen] = useState(false);
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isCompleteDeliveryOpen, setIsCompleteDeliveryOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerDetailOpen, setIsCustomerDetailOpen] = useState(false);

  const queryClient = useQueryClient();
  const { success, error } = useToast();

  // Deliveries query
  const { data: deliveryData, isLoading: loadingDeliveries } = useQuery({
    queryKey: ['deliveries', page, search, deliveryStatus],
    queryFn: () =>
      deliveryApi.list({
        page,
        limit: 15,
        search,
        deliveryStatus,
      }),
    enabled: activeTab === 'deliveries',
  });

  // Customers query
  const { data: customerData, isLoading: loadingCustomers } = useQuery({
    queryKey: ['customers', page, search, customerType],
    queryFn: () =>
      customerApi.list({
        page,
        limit: 15,
        search,
        customerType,
      }),
    enabled: activeTab === 'customers',
  });

  // Quick dispatch mutation: mark OUT_FOR_DELIVERY
  const dispatchMutation = useMutation({
    mutationFn: (id: string) =>
      deliveryApi.updateStatus(id, { deliveryStatus: 'OUT_FOR_DELIVERY' }),
    onSuccess: (res) => {
      success('Order Dispatched', `Delivery ${res.delivery.deliveryId} is now out for delivery.`);
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
    },
    onError: (err: any) => {
      error('Dispatch Error', err.message);
    },
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Truck className="w-7 h-7 text-teal-400" /> Deliveries & Customer Accounts
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dispatch routes, cylinder exchange fulfillment, client accounts, and receivables
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasRole('ADMIN', 'MANAGER', 'DELIVERY_STAFF', 'INVENTORY_STAFF') && (
            <Button variant="outline" onClick={() => setIsCreateCustomerOpen(true)}>
              <Users className="w-4 h-4" /> New Customer
            </Button>
          )}
          {hasRole('ADMIN', 'MANAGER', 'DELIVERY_STAFF') && (
            <Button variant="primary" onClick={() => setIsCreateDeliveryOpen(true)}>
              <Plus className="w-4 h-4" /> Schedule Delivery
            </Button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => {
            setActiveTab('deliveries');
            setPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition ${
            activeTab === 'deliveries'
              ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Truck className="w-4 h-4" /> Dispatch Deliveries
        </button>
        <button
          onClick={() => {
            setActiveTab('customers');
            setPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition ${
            activeTab === 'customers'
              ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Users className="w-4 h-4" /> Customer Directory
        </button>
      </div>

      {/* TAB 1: DELIVERIES */}
      {activeTab === 'deliveries' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <Card className="p-4 bg-slate-900/70 border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Input
                  placeholder="Search delivery ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>

              <Select
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Delivery Statuses' },
                  { value: 'PENDING', label: 'PENDING' },
                  { value: 'ASSIGNED', label: 'ASSIGNED' },
                  { value: 'OUT_FOR_DELIVERY', label: 'OUT_FOR_DELIVERY' },
                  { value: 'DELIVERED', label: 'DELIVERED' },
                  { value: 'FAILED', label: 'FAILED' },
                  { value: 'CANCELLED', label: 'CANCELLED' },
                ]}
              />
            </div>
          </Card>

          {/* Deliveries Table */}
          <Card className="p-0 overflow-hidden bg-slate-900/60 border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Allocated Cylinder</th>
                    <th className="py-3.5 px-4">Scheduled Date</th>
                    <th className="py-3.5 px-4">Driver / Staff</th>
                    <th className="py-3.5 px-4">Amount / Payment</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loadingDeliveries ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <RotateCw className="w-6 h-6 animate-spin mx-auto text-teal-400 mb-2" />
                        Loading delivery orders...
                      </td>
                    </tr>
                  ) : deliveryData?.data?.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No delivery orders found.
                      </td>
                    </tr>
                  ) : (
                    deliveryData?.data?.map((del) => (
                      <tr key={del._id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                          {del.deliveryId}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-200">{del.customer?.name}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">{del.deliveryAddress}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          {del.cylinder ? (
                            <div>
                              <span className="font-mono font-bold text-teal-300">
                                {del.cylinder.serialNumber}
                              </span>
                              <p className="text-[11px] text-slate-400">{del.cylinder.capacity}kg</p>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {new Date(del.scheduledDate).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {del.deliveryStaff?.name || <span className="text-slate-500 italic">Pending Assignment</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-100">${del.paymentAmount}</span>
                          <div>
                            <Badge status={del.paymentStatus} className="text-[10px] px-1.5 py-0 mt-0.5" />
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge status={del.deliveryStatus} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {del.deliveryStatus === 'ASSIGNED' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => dispatchMutation.mutate(del._id)}
                                title="Mark Out For Delivery"
                              >
                                <Navigation className="w-3.5 h-3.5 text-blue-400" /> Dispatch
                              </Button>
                            )}
                            {del.deliveryStatus !== 'DELIVERED' && del.deliveryStatus !== 'CANCELLED' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  setSelectedDelivery(del);
                                  setIsCompleteDeliveryOpen(true);
                                }}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: CUSTOMER DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <Card className="p-4 bg-slate-900/70 border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Input
                  placeholder="Search customer name, phone, address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>

              <Select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Customer Categories' },
                  { value: 'HOUSEHOLD', label: 'Household (Domestic)' },
                  { value: 'COMMERCIAL', label: 'Commercial (Hotels, Eateries)' },
                  { value: 'INDUSTRIAL', label: 'Industrial (Plants, Welding)' },
                ]}
              />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden bg-slate-900/60 border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Client ID</th>
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Cylinders Held</th>
                    <th className="py-3.5 px-4">Outstanding Balance</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loadingCustomers ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <RotateCw className="w-6 h-6 animate-spin mx-auto text-teal-400 mb-2" />
                        Loading customer records...
                      </td>
                    </tr>
                  ) : customerData?.data?.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No customers found.
                      </td>
                    </tr>
                  ) : (
                    customerData?.data?.map((cust) => (
                      <tr key={cust._id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                          {cust.customerId}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-100">{cust.name}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">{cust.address}, {cust.city}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-slate-200">{cust.phone}</p>
                          <p className="text-[11px] text-slate-400">{cust.email || 'No email'}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            variant={
                              cust.customerType === 'INDUSTRIAL'
                                ? 'purple'
                                : cust.customerType === 'COMMERCIAL'
                                ? 'info'
                                : 'default'
                            }
                          >
                            {cust.customerType}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-teal-400">{cust.cylinderCount || 0}</span> units
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-semibold ${
                              cust.outstandingBalance > 0 ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            ${(cust.outstandingBalance || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCustomer(cust);
                              setIsCustomerDetailOpen(true);
                            }}
                          >
                            <Eye className="w-3.5 h-3.5 text-teal-400" /> Profile
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Modals */}
      <CreateDeliveryModal
        isOpen={isCreateDeliveryOpen}
        onClose={() => setIsCreateDeliveryOpen(false)}
      />

      <CompleteDeliveryModal
        delivery={selectedDelivery}
        isOpen={isCompleteDeliveryOpen}
        onClose={() => setIsCompleteDeliveryOpen(false)}
      />

      <CreateCustomerModal
        isOpen={isCreateCustomerOpen}
        onClose={() => setIsCreateCustomerOpen(false)}
      />

      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isCustomerDetailOpen}
        onClose={() => setIsCustomerDetailOpen(false)}
      />
    </div>
  );
};
