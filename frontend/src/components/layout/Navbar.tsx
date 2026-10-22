import React, { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../../api/notifications';
import { Bell, Flame, UserCheck, LogOut, ChevronDown, CheckCheck, Shield } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, logout, quickSwitch } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list(),
    refetchInterval: 15000,
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'ADMIN', title: 'Alexander Pierce (Admin)', desc: 'Complete access to fleet, users, finances & audit' },
    { role: 'MANAGER', title: 'Sarah Jenkins (Ops Manager)', desc: 'Fleet dispatch, customer management, inventory' },
    { role: 'DELIVERY_STAFF', title: 'Carlos Mendez (Delivery)', desc: 'Delivery routing, customer handoffs & collections' },
    { role: 'INVENTORY_STAFF', title: 'Rajesh Patel (Inventory)', desc: 'Warehouse tracking, batching, cylinder intake' },
    { role: 'MAINTENANCE_STAFF', title: 'Viktor Kowalski (Tech)', desc: 'Safety tests, leak inspections & overhauls' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/25">
          <Flame className="w-5 h-5 fill-current" />
        </div>
        <div>
          <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
            GasTrack <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">PRO</span>
          </span>
          <p className="text-[10px] text-slate-400 font-medium hidden sm:block">MongoDB Atlas • Mongoose ODM</p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Quick Demo Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRolePicker(!showRolePicker);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition"
          >
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">Role Persona:</span>
            <span className="font-semibold text-teal-300">{user?.role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRolePicker && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1.5 border-b border-slate-800 mb-2">
                <p className="text-xs font-semibold text-white">Switch Demo User Role</p>
                <p className="text-[11px] text-slate-400">Instantly experience role-based controls</p>
              </div>
              <div className="space-y-1">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={async () => {
                      await quickSwitch(r.role);
                      setShowRolePicker(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs transition flex items-center justify-between ${
                      user?.role === r.role
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{r.title}</p>
                      <p className="text-[10px] text-slate-400">{r.desc}</p>
                    </div>
                    {user?.role === r.role && <UserCheck className="w-4 h-4 text-teal-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRolePicker(false);
            }}
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition"
          >
            <Bell className="w-4 h-4" />
            {(notifData?.unreadCount || 0) > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg">
                {notifData?.unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold text-white">Notifications & Alerts</span>
                <button
                  onClick={() => markAllReadMutation.mutate()}
                  className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/50 mt-2">
                {notifData?.notifications?.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No active notifications</p>
                ) : (
                  notifData?.notifications?.slice(0, 8).map((n) => (
                    <div key={n._id} className="py-2.5 text-xs text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{n.title}</span>
                        <Badge status={n.isRead ? 'PASSED' : 'DAMAGED'} className="text-[10px] px-1.5 py-0">
                          {n.isRead ? 'Read' : 'New'}
                        </Badge>
                      </div>
                      <p className="text-slate-400 mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-slate-200">{user?.name}</p>
            <p className="text-[10px] text-teal-400 font-mono">{user?.role}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Sign Out">
            <LogOut className="w-4 h-4 text-slate-400 hover:text-rose-400 transition" />
          </Button>
        </div>
      </div>
    </header>
  );
};
