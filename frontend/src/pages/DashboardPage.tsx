import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  Boxes,
  Truck,
  RotateCw,
  Wrench,
  Users,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Flame,
  Activity,
  Layers,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardApi.getSummary(),
    refetchInterval: 30000,
  });

  const summary = data?.summary;
  const distribution = data?.cylinderDistribution || [];
  const deliveryTrends = data?.deliveryTrends || [];
  const revenueTrends = data?.revenueTrends || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            Real-Time Telemetry Active
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-2">
            GasTrack Operational Command
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Live telemetry for fleet distribution, client delivery fulfillment, bottling refill cycles, and statutory hydrostatic leak inspections.
          </p>
        </div>

        {/* Quick Jump Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 z-10">
          <Link to="/cylinders">
            <Button variant="secondary" size="sm">
              <Boxes className="w-4 h-4 text-teal-400" /> Manage Fleet
            </Button>
          </Link>
          <Link to="/customers">
            <Button variant="primary" size="sm">
              <Truck className="w-4 h-4" /> Deliveries
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4 bg-slate-900/60 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Fleet</span>
            <Boxes className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">{summary?.totalCylinders || 0}</p>
          <span className="text-[11px] text-teal-400 mt-1 block">Indexed in MongoDB</span>
        </Card>

        <Card className="p-4 bg-slate-900/60 border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-medium">Ready Stock</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-300 mt-2">{summary?.availableCylinders || 0}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">In Warehouses</span>
        </Card>

        <Card className="p-4 bg-slate-900/60 border-blue-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400 font-medium">With Clients</span>
            <Truck className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-blue-300 mt-2">{summary?.inCustomerHands || 0}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Active Custody</span>
        </Card>

        <Card className="p-4 bg-slate-900/60 border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-medium">In Refill Cycle</span>
            <RotateCw className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-300 mt-2">{summary?.inRefill || 0}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">At Bottling Plants</span>
        </Card>

        <Card className="p-4 bg-slate-900/60 border-cyan-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cyan-400 font-medium">Testing & Repair</span>
            <Wrench className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-cyan-300 mt-2">
            {(summary?.inInspection || 0) + (summary?.inMaintenance || 0)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Quality Assured</span>
        </Card>

        <Card className="p-4 bg-slate-900/60 border-teal-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-teal-400 font-medium">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100 mt-2">
            ${(summary?.totalRevenue || 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-rose-400 mt-1 block">
            ${(summary?.totalOutstanding || 0).toFixed(0)} unpaid
          </span>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Distribution Donut Chart */}
        <Card className="p-5 bg-slate-900/60 border-slate-800 flex flex-col justify-between">
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" /> Lifecycle Fleet Distribution
              </span>
              <span className="text-xs font-normal text-slate-400">{summary?.totalCylinders || 0} Units</span>
            </CardTitle>
          </CardHeader>

          <div className="h-60 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-white">{summary?.totalCylinders}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Fleet</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-3 border-t border-slate-800 text-[11px]">
            {distribution.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-400 truncate">{d.name}</span>
                </div>
                <span className="font-semibold text-slate-200 ml-1 font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 7-Day Delivery & Scheduled Flow Bar Chart */}
        <Card className="p-5 bg-slate-900/60 border-slate-800 lg:col-span-2 flex flex-col justify-between">
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" /> Delivery Route Throughput (7 Days)
              </span>
              <Badge variant="info">
                {summary?.completedToday || 0} Fulfilled Today
              </Badge>
            </CardTitle>
          </CardHeader>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="_id" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="totalScheduled" name="Scheduled Orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delivered" name="Delivered / Exchanged" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-slate-300">Scheduled Routes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-slate-300">Successfully Delivered</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Trend Area Chart */}
      <Card className="p-5 bg-slate-900/60 border-slate-800">
        <CardHeader className="p-0 mb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" /> Revenue Inflow Velocity
            </span>
            <span className="text-xs text-slate-400">Reconciled via UPI, Cash, Cards</span>
          </CardTitle>
        </CardHeader>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrends}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="_id" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Revenue']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bottom Grids: Recent Deliveries & Real-time Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deliveries */}
        <Card className="p-5 bg-slate-900/60 border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" /> Recent Dispatch Deliveries
            </h3>
            <Link to="/customers" className="text-xs text-teal-400 hover:text-teal-300 font-medium">
              View all →
            </Link>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
            {data?.recentDeliveries?.map((d: any) => (
              <div key={d._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-200">{d.deliveryId}</span>
                    <Badge status={d.deliveryStatus} />
                  </div>
                  <p className="text-slate-300 font-medium mt-0.5">{d.customer?.name}</p>
                  <p className="text-[11px] text-slate-500">
                    Cylinder: {d.cylinder?.serialNumber || 'Pending'} • Driver: {d.deliveryStaff?.name || 'Unassigned'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-200">${d.paymentAmount}</span>
                  <div>
                    <Badge status={d.paymentStatus} className="text-[10px] px-1.5 py-0 mt-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Operational Alerts */}
        <Card className="p-5 bg-slate-900/60 border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Critical Operational Alerts
            </h3>
            <span className="text-xs text-slate-400">Automated Telemetry</span>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
            {data?.recentAlerts?.map((a: any) => (
              <div key={a._id} className="py-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {a.title}
                  </span>
                  <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                    {a.type.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-slate-400 mt-1">{a.message}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {new Date(a.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
