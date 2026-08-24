import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Cargando información...',
  className = 'py-16',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-slate-400 ${className}`}>
      <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      <p className="text-xs font-medium text-slate-400">{message}</p>
    </div>
  );
};
