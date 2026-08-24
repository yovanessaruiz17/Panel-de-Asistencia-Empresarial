import React from 'react';
import { AttendanceStatus } from '../../types';
import { getStatusLabel } from '../../utils/attendanceRules';
import { cn } from '../../utils/cn';

interface Props {
  status: AttendanceStatus;
  size?: 'sm' | 'md' | 'lg';
  showSymbol?: boolean;
  className?: string;
}

export const AttendanceStatusBadge: React.FC<Props> = ({
  status,
  size = 'md',
  showSymbol = true,
  className,
}) => {
  const { label, symbol, badgeClass } = getStatusLabel(status);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border whitespace-nowrap transition-all duration-150',
        badgeClass,
        sizeClasses[size],
        className
      )}
    >
      {showSymbol && <span className="font-mono leading-none opacity-90">{symbol}</span>}
      <span>{label}</span>
    </span>
  );
};
