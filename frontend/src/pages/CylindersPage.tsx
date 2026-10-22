import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cylinderApi, Cylinder } from '../api/cylinders';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { CylinderDetailModal } from '../components/cylinders/CylinderDetailModal';
import { TransitionStatusModal } from '../components/cylinders/TransitionStatusModal';
import { AddCylinderModal } from '../components/cylinders/AddCylinderModal';
import {
  Boxes,
  Plus,
  Search,
  RotateCw,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  Truck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CylindersPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [condition, setCondition] = useState('ALL');
  const [cylinderType, setCylinderType] = useState('ALL');

  const [selectedCylinder, setSelectedCylinder] = useState<Cylinder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isTransitionOpen, setIsTransitionOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['cylinders', page, search, status, condition, cylinderType],
    queryFn: () =>
      cylinderApi.list({
        page,
        limit: 15,
        search,
        status,
        condition,
        cylinderType,
      }),
  });

  const { data: statsData } = useQuery({
    queryKey: ['cylinder-stats'],
    queryFn: () => cylinderApi.getStats(),
  });

  const stats = statsData?.stats;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Boxes className="w-7 h-7 text-teal-400" /> Cylinder Fleet Inventory
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete lifecycle tracking, location tracking, and status transitions for all LPG cylinders
          </p>
        </div>

        {hasRole('ADMIN', 'MANAGER', 'INVENTORY_STAFF') && (
          <Button variant="primary" onClick={() => setIsAddOpen(true)} className="shrink-0">
            <Plus className="w-4 h-4" /> Register Cylinder
          </Button>
        )}
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4 bg-slate-900/60 border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Fleet</span>
          <p className="text-2xl font-bold text-white mt-1">{stats?.total || 0}</p>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-emerald-500/20">
          <span className="text-xs text-emerald-400 font-medium">Available</span>
          <p className="text-2xl font-bold text-emerald-300 mt-1">
            {(stats?.byStatus?.AVAILABLE || 0) + (stats?.byStatus?.FILLED || 0)}
          </p>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-blue-500/20">
          <span className="text-xs text-blue-400 font-medium">Delivered / Customer</span>
          <p className="text-2xl font-bold text-blue-300 mt-1">{stats?.byStatus?.DELIVERED || 0}</p>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-amber-500/20">
          <span className="text-xs text-amber-400 font-medium">In Refill Cycle</span>
          <p className="text-2xl font-bold text-amber-300 mt-1">{stats?.byStatus?.IN_REFILL || 0}</p>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-cyan-500/20">
          <span className="text-xs text-cyan-400 font-medium">Testing & Maint</span>
          <p className="text-2xl font-bold text-cyan-300 mt-1">
            {(stats?.byStatus?.INSPECTION || 0) + (stats?.byStatus?.MAINTENANCE || 0)}
          </p>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-rose-500/20">
          <span className="text-xs text-rose-400 font-medium">Damaged / Retired</span>
          <p className="text-2xl font-bold text-rose-300 mt-1">
            {(stats?.byStatus?.DAMAGED || 0) + (stats?.byStatus?.RETIRED || 0) + (stats?.byStatus?.LOST || 0)}
          </p>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 space-y-3 bg-slate-900/70 border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Input
              placeholder="Search serial no, ID, brand..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          </div>

          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Lifecycle Statuses' },
              { value: 'AVAILABLE', label: 'AVAILABLE' },
              { value: 'FILLED', label: 'FILLED' },
              { value: 'EMPTY', label: 'EMPTY' },
              { value: 'ASSIGNED', label: 'ASSIGNED' },
              { value: 'DELIVERED', label: 'DELIVERED' },
              { value: 'RETURNED', label: 'RETURNED' },
              { value: 'IN_REFILL', label: 'IN_REFILL' },
              { value: 'INSPECTION', label: 'INSPECTION' },
              { value: 'MAINTENANCE', label: 'MAINTENANCE' },
              { value: 'DAMAGED', label: 'DAMAGED' },
              { value: 'LOST', label: 'LOST' },
              { value: 'RETIRED', label: 'RETIRED' },
            ]}
          />

          <Select
            value={condition}
            onChange={(e) => {
              setCondition(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Physical Conditions' },
              { value: 'GOOD', label: 'Condition: GOOD' },
              { value: 'FAIR', label: 'Condition: FAIR' },
              { value: 'DAMAGED', label: 'Condition: DAMAGED' },
              { value: 'CRITICAL', label: 'Condition: CRITICAL' },
              { value: 'REJECTED', label: 'Condition: REJECTED' },
            ]}
          />

          <Select
            value={cylinderType}
            onChange={(e) => {
              setCylinderType(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Cylinder Types' },
              { value: 'DOMESTIC_14_2KG', label: '14.2 kg Domestic' },
              { value: 'COMMERCIAL_19KG', label: '19.0 kg Commercial' },
              { value: 'INDUSTRIAL_47_5KG', label: '47.5 kg Industrial' },
              { value: 'CAMPING_5KG', label: '5.0 kg Camping' },
            ]}
          />
        </div>
      </Card>

      {/* Cylinders Table */}
      <Card className="p-0 overflow-hidden bg-slate-900/60 border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Serial Number</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Condition</th>
                <th className="py-3.5 px-4">Location / Customer</th>
                <th className="py-3.5 px-4">Refills</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RotateCw className="w-6 h-6 animate-spin mx-auto text-teal-400 mb-2" />
                    Loading cylinders from MongoDB...
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No cylinders found matching criteria.
                  </td>
                </tr>
              ) : (
                data?.data?.map((cyl) => (
                  <tr key={cyl._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100 font-mono text-sm">{cyl.serialNumber}</div>
                      <div className="text-[11px] text-slate-500">{cyl.cylinderId} • {cyl.brand}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-200">{cyl.capacity} kg</span>
                      <div className="text-[11px] text-slate-400">{cyl.cylinderType.replace('_', ' ')}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={cyl.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={cyl.condition} />
                    </td>
                    <td className="py-3.5 px-4">
                      {cyl.currentCustomer ? (
                        <div>
                          <p className="font-medium text-blue-300">{cyl.currentCustomer.name}</p>
                          <p className="text-[11px] text-slate-500">Customer site</p>
                        </div>
                      ) : cyl.currentLocation ? (
                        <div>
                          <p className="font-medium text-slate-300">{cyl.currentLocation.name}</p>
                          <p className="text-[11px] text-slate-500">{cyl.currentLocation.type}</p>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Not Assigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-teal-400 font-medium">{cyl.refillCount || 0} cycles</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCylinder(cyl);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-400" /> Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCylinder(cyl);
                            setIsTransitionOpen(true);
                          }}
                        >
                          <RotateCw className="w-3.5 h-3.5" /> Transition
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {data && data.pagination && data.pagination.pages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing page {data.pagination.page} of {data.pagination.pages} ({data.pagination.total} cylinders)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.pagination.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      <CylinderDetailModal
        cylinder={selectedCylinder}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onTransitionClick={(cyl) => {
          setSelectedCylinder(cyl);
          setIsTransitionOpen(true);
        }}
      />

      <TransitionStatusModal
        cylinder={selectedCylinder}
        isOpen={isTransitionOpen}
        onClose={() => setIsTransitionOpen(false)}
      />

      <AddCylinderModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </div>
  );
};
