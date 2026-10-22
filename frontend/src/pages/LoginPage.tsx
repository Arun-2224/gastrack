import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useToast } from '../context/ToastContext';
import {
  Flame,
  ShieldCheck,
  Truck,
  Boxes,
  Wrench,
  Lock,
  Mail,
  ArrowRight,
  Database,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@gastrack.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);

  const { login, quickSwitch } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      success('Welcome to GasTrack', 'Signed in successfully.');
      navigate('/');
    } catch (err: any) {
      error('Login Failed', err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRole = async (role: UserRole) => {
    setLoading(true);
    try {
      await quickSwitch(role);
      success('Persona Activated', `Logged in as ${role}`);
      navigate('/');
    } catch (err: any) {
      error('Quick Switch Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const demoRoles: { role: UserRole; title: string; subtitle: string; icon: any; color: string }[] = [
    {
      role: 'ADMIN',
      title: 'Alexander Pierce',
      subtitle: 'System Administrator',
      icon: ShieldCheck,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    },
    {
      role: 'MANAGER',
      title: 'Sarah Jenkins',
      subtitle: 'Operations Manager',
      icon: Flame,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    },
    {
      role: 'DELIVERY_STAFF',
      title: 'Carlos Mendez',
      subtitle: 'Delivery Fleet Driver',
      icon: Truck,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      role: 'INVENTORY_STAFF',
      title: 'Rajesh Patel',
      subtitle: 'Warehouse & Intake Officer',
      icon: Boxes,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
    {
      role: 'MAINTENANCE_STAFF',
      title: 'Viktor Kowalski',
      subtitle: 'Inspection & Safety Tech',
      icon: Wrench,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background glow ornaments */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10 items-center">
        {/* Left hero branding */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 shadow-xl shadow-teal-500/30">
              <Flame className="w-7 h-7 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">GasTrack</h1>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                Enterprise LPG Lifecycle System
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Next-generation full-stack cylinder inventory management, route delivery dispatch, plant refilling cycle automation, and statutory leak safety testing.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Full MongoDB & Mongoose transactional schema</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>JWT + bcrypt authentication with 5 role-based security levels</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Complete cylinder state machine tracking and audit trail</span>
            </div>
          </div>

          {/* Quick Demo Personas */}
          <div className="space-y-2 pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Instant 1-Click Role Personas:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {demoRoles.map((dr) => (
                <button
                  key={dr.role}
                  type="button"
                  onClick={() => handleQuickRole(dr.role)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all hover:scale-[1.01] text-left text-xs ${dr.color}`}
                >
                  <div className="flex items-center gap-2.5">
                    <dr.icon className="w-4 h-4 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-100">{dr.title}</p>
                      <p className="text-[11px] text-slate-400">{dr.subtitle} • {dr.role}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right login card */}
        <Card className="p-8 bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">System Sign In</h2>
            <p className="text-xs text-slate-400 mt-1">Enter credentials to authenticate into GasTrack</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="user@gastrack.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full py-3" isLoading={loading}>
                Sign In to GasTrack
              </Button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 text-center">
              Default password for all demo accounts is <span className="font-mono text-teal-400 font-bold">Password123!</span>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
