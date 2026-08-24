import React, { useEffect, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Fingerprint,
  Menu,
  Moon,
  Sparkles,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentTimeString, getFormattedFullDate } from '../../utils/dateUtils';

interface TopbarProps {
  onOpenMobile: () => void;
  onNavigate: (path: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobile, onNavigate }) => {
  const { isOnline, isDemoMode } = useApp();
  const { currentRole } = useAuth();
  const [time, setTime] = useState<string>(getCurrentTimeString());
  const [date, setDate] = useState<string>(getFormattedFullDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getCurrentTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Mobile burger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 lg:hidden transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Live Clock Header */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <Clock className="w-4 h-4 text-sky-400" />
          <span className="font-mono text-xs font-bold text-slate-200 tracking-wider">{time}</span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-400 capitalize">{date}</span>
        </div>
      </div>

      {/* Right side: Status indicators & Fast Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Network / Offline Indicator */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
            isOnline
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
          title={isOnline ? 'Conexión activa' : 'Sin conexión'}
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          <span className="hidden md:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        {/* Demo Mode Badge */}
        {isDemoMode && (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modo Demo Mock</span>
          </div>
        )}

        {/* Quick Kiosk / Marcar button */}
        <button
          onClick={() => onNavigate('/marcar')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 shadow-md shadow-sky-600/20 hover:shadow-sky-600/30 transition-all"
        >
          <Fingerprint className="w-4 h-4" />
          <span className="hidden sm:inline">Marcar Asistencia</span>
        </button>
      </div>
    </header>
  );
};
