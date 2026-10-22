import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  Truck,
  RotateCw,
  Wrench,
  CreditCard,
  History,
  Database,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { hasRole } = useAuth();

  const navItems = [
    {
      to: '/',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      module: 'Overview',
    },
    {
      to: '/cylinders',
      label: 'Cylinder Inventory',
      icon: Boxes,
      module: 'Module 1',
    },
    {
      to: '/customers',
      label: 'Deliveries & Clients',
      icon: Truck,
      module: 'Module 2',
    },
    {
      to: '/refill',
      label: 'Refilling Cycle',
      icon: RotateCw,
      module: 'Module 3',
    },
    {
      to: '/maintenance',
      label: 'Safety & Inspections',
      icon: Wrench,
      module: 'Module 4',
    },
    {
      to: '/payments',
      label: 'Revenue Ledger',
      icon: CreditCard,
      module: 'Finance',
    },
  ];

  if (hasRole('ADMIN', 'MANAGER')) {
    navItems.push({
      to: '/audit-logs',
      label: 'Audit Security Log',
      icon: History,
      module: 'Security',
    });
  }

  return (
    <aside className="w-64 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="p-4 space-y-6">
        <div className="px-3 pt-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Operational Modules
          </p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-lg shadow-teal-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 bg-slate-800/50'
                    }`}
                  >
                    {item.module}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Database Connection Footer */}
      <div className="p-4 m-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
        <div className="flex items-center gap-2 mb-1.5">
          <Database className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">Database Engine</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-slate-400">MongoDB Atlas / gastrack</span>
        </div>
      </div>
    </aside>
  );
};
