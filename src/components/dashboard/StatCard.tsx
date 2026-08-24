import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-sky-400',
  badge,
  badgeType = 'info',
  className,
  onClick,
}) => {
  const badgeStyles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-5 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-sm relative overflow-hidden transition-all duration-200',
        onClick && 'cursor-pointer hover:border-slate-700 hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1.5 tracking-tight">{value}</h3>
        </div>
        <div className={cn('p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 shadow-inner', iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-800/60">
        <p className="text-xs text-slate-400 truncate">{subtitle || 'Hoy'}</p>
        {badge && (
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', badgeStyles[badgeType])}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
