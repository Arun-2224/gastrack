import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Flame, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
        <Flame className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-white">404</h1>
      <p className="text-base text-slate-400 max-w-sm">
        The requested operational route does not exist in the GasTrack management console.
      </p>
      <Link to="/">
        <Button variant="primary">
          <Home className="w-4 h-4" /> Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
