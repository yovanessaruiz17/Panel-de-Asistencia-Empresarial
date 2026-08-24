import React from 'react';
import {
  Activity,
  Award,
  Building2,
  CalendarDays,
  Clock,
  FileSpreadsheet,
  FileText,
  Fingerprint,
  History,
  LayoutDashboard,
  LogOut,
  MapPin,
  QrCode,
  Shield,
  Sliders,
  UserCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { cn } from '../../utils/cn';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles: Role[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ['SUPER_ADMIN', 'HR', 'BOSS'],
  },
  {
    name: 'Mi Asistencia',
    path: '/mi-asistencia',
    icon: UserCheck,
    roles: ['EMPLOYEE'],
  },
  {
    name: 'Centro de Asistencia',
    path: '/asistencia',
    icon: Activity,
    roles: ['SUPER_ADMIN', 'HR', 'BOSS'],
  },
  {
    name: 'Empleados',
    path: '/empleados',
    icon: Users,
    roles: ['SUPER_ADMIN', 'HR', 'BOSS'],
  },
  {
    name: 'Horarios',
    path: '/horarios',
    icon: CalendarDays,
    roles: ['SUPER_ADMIN', 'HR', 'BOSS'],
  },
  {
    name: 'Horas Extras',
    path: '/horas-extras',
    icon: Clock,
    roles: ['SUPER_ADMIN', 'HR', 'BOSS'],
    badge: 'OVT',
  },
  {
    name: 'Incidencias',
    path: '/incidencias',
    icon: Shield,
    roles: ['SUPER_ADMIN', 'HR', 'BOSS'],
  },
  {
    name: 'Carnets & QR',
    path: '/carnets',
    icon: QrCode,
    roles: ['SUPER_ADMIN', 'HR'],
  },
  {
    name: 'Reportes',
    path: '/reportes',
    icon: FileSpreadsheet,
    roles: ['SUPER_ADMIN', 'HR', 'BOSS'],
  },
  {
    name: 'Departamentos',
    path: '/departamentos',
    icon: Building2,
    roles: ['SUPER_ADMIN'],
  },
  {
    name: 'Sedes',
    path: '/sedes',
    icon: MapPin,
    roles: ['SUPER_ADMIN'],
  },
  {
    name: 'Usuarios & Roles',
    path: '/usuarios',
    icon: Shield,
    roles: ['SUPER_ADMIN'],
  },
  {
    name: 'Auditoría',
    path: '/auditoria',
    icon: History,
    roles: ['SUPER_ADMIN'],
  },
  {
    name: 'Configuración',
    path: '/configuracion',
    icon: Sliders,
    roles: ['SUPER_ADMIN'],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { currentUser, currentRole, logout, switchRole } = useAuth();

  const filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(currentRole));

  const roleLabelMap: Record<Role, { label: string; color: string }> = {
    SUPER_ADMIN: { label: 'Super Admin', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    HR: { label: 'Recursos Humanos', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
    BOSS: { label: 'Jefe de Área', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    EMPLOYEE: { label: 'Empleado', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  };

  const handleNavClick = (path: string) => {
    onNavigate(path);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-extrabold text-lg tracking-wider">
              YD
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                YORDEV <span className="text-sky-400 font-semibold text-xs px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">CONTROL</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">Acceso & Asistencia</p>
            </div>
          </div>
        </div>

        {/* Punch Clock Direct Kiosk Shortcut */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={() => handleNavClick('/marcar')}
            className={cn(
              'w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group text-left shadow-sm',
              currentPath === '/marcar'
                ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/60 text-slate-200'
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 group-hover:scale-105 transition-transform">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold block text-slate-100">Kiosco de Marcación</span>
                <span className="text-[10px] text-slate-400">Registrar Entrada / Salida</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded">/marcar</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navegación
          </div>
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group text-left',
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200')} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 group-hover:bg-slate-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Role Switcher in Demo Mode */}
        <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cambiar Rol Demo</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            {(['SUPER_ADMIN', 'HR', 'BOSS', 'EMPLOYEE'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={cn(
                  'py-1 px-1.5 rounded text-center font-semibold transition-colors border',
                  currentRole === r
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                )}
              >
                {r === 'SUPER_ADMIN' ? 'Admin' : r === 'HR' ? 'RRHH' : r === 'BOSS' ? 'Jefe' : 'Empleado'}
              </button>
            ))}
          </div>
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentUser?.foto_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
              alt={currentUser?.nombre}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{currentUser?.nombre || 'Usuario'}</p>
              <span
                className={cn(
                  'inline-block text-[10px] font-medium px-1.5 py-0.2 rounded-full border',
                  roleLabelMap[currentRole].color
                )}
              >
                {roleLabelMap[currentRole].label}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
