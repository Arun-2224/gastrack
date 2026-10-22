import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'purple'
    | 'outline'
    | 'status';
  status?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  status,
  children,
  ...props
}) => {
  let variantStyles = 'bg-slate-800 text-slate-300 border-slate-700';

  if (status) {
    switch (status.toUpperCase()) {
      case 'AVAILABLE':
      case 'FILLED':
      case 'PASSED':
      case 'APPROVED':
      case 'PAID':
      case 'COMPLETED':
      case 'ACTIVE':
      case 'GOOD':
        variantStyles = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
        break;

      case 'IN_REFILL':
      case 'SENT':
      case 'IN_PROGRESS':
      case 'PENDING':
      case 'PARTIAL':
      case 'FAIR':
      case 'QUALITY_CHECK':
        variantStyles = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
        break;

      case 'ASSIGNED':
      case 'OUT_FOR_DELIVERY':
      case 'DELIVERED':
        variantStyles = 'bg-blue-500/15 text-blue-300 border-blue-500/30';
        break;

      case 'RETURNED':
      case 'EMPTY':
        variantStyles = 'bg-purple-500/15 text-purple-300 border-purple-500/30';
        break;

      case 'INSPECTION':
        variantStyles = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
        break;

      case 'MAINTENANCE':
      case 'NEEDS_MAINTENANCE':
        variantStyles = 'bg-pink-500/15 text-pink-300 border-pink-500/30';
        break;

      case 'DAMAGED':
      case 'FAILED':
      case 'REJECTED':
      case 'LOST':
      case 'RETIRED':
      case 'CANCELLED':
      case 'CRITICAL':
      case 'UNPAID':
        variantStyles = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
        break;

      default:
        variantStyles = 'bg-slate-800 text-slate-300 border-slate-700';
    }
  } else {
    switch (variant) {
      case 'success':
        variantStyles = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
        break;
      case 'warning':
        variantStyles = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
        break;
      case 'danger':
        variantStyles = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
        break;
      case 'info':
        variantStyles = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
        break;
      case 'purple':
        variantStyles = 'bg-purple-500/15 text-purple-300 border-purple-500/30';
        break;
      case 'outline':
        variantStyles = 'bg-transparent text-slate-300 border-slate-600';
        break;
    }
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variantStyles,
        className
      )}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {children || status}
    </span>
  );
};
