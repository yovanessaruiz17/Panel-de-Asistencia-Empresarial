import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Fingerprint,
  QrCode,
  Sparkles,
  UserCheck,
  Zap,
} from 'lucide-react';
import { AttendanceStatusBadge } from '../components/common/AttendanceStatusBadge';
import { QRCodeScannerModal } from '../components/qr/QRCodeScannerModal';
import { useApp } from '../contexts/AppContext';
import { attendanceService } from '../services/attendanceService';
import { employeeService } from '../services/employeeService';
import { AttendancePunchResult, Employee } from '../types';
import { getCurrentTimeString, getFormattedFullDate } from '../utils/dateUtils';
import { maskCedula } from '../utils/formatters';

interface PunchClockPageProps {
  onBackToDashboard: () => void;
}

export const PunchClockPage: React.FC<PunchClockPageProps> = ({ onBackToDashboard }) => {
  const { isOnline } = useApp();
  const [time, setTime] = useState<string>(getCurrentTimeString());
  const [date, setDate] = useState<string>(getFormattedFullDate());
  const [cedulaInput, setCedulaInput] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AttendancePunchResult | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getCurrentTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    employeeService.getAll().then(setEmployees);
  }, []);

  // Auto-reset confirmation result after 5 seconds
  useEffect(() => {
    if (result) {
      const resetTimer = setTimeout(() => {
        setResult(null);
        setCedulaInput('');
      }, 5000);
      return () => clearTimeout(resetTimer);
    }
  }, [result]);

  const handleRegister = async (identifier: string, method: 'QR' | 'CEDULA') => {
    if (!identifier.trim()) return;

    if (!isOnline) {
      setResult({
        success: false,
        error: {
          code: 'NETWORK_OFFLINE',
          message: 'Sin conexión a internet. No podemos confirmar tu registro de asistencia.',
        },
      });
      return;
    }

    try {
      setLoading(true);
      const res = await attendanceService.registerPunch(identifier.trim(), method);
      setResult(res);
    } catch (err: any) {
      setResult({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: err.message || 'Error al procesar la marcación de asistencia.',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCedulaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister(cedulaInput, 'CEDULA');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between z-10 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-extrabold text-lg">
            YD
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              YORDEV <span className="text-sky-400 font-semibold text-xs px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">CONTROL</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Control Inteligente de Asistencia</p>
          </div>
        </div>

        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Panel Administrativo</span>
        </button>
      </div>

      {/* Center Punch Interface or Confirmation */}
      <div className="my-auto py-8 z-10 max-w-xl mx-auto w-full">
        {result ? (
          /* Confirmation Screen */
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-2xl backdrop-blur-xl text-center animate-in fade-in zoom-in-95 duration-200 ${
              result.success
                ? 'bg-slate-900/90 border-emerald-500/40 shadow-emerald-950/20'
                : 'bg-slate-900/90 border-rose-500/40 shadow-rose-950/20'
            }`}
          >
            {result.success ? (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                    Marcación Exitosa
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    {result.tipo_marcacion === 'ENTRADA' ? '¡Entrada Registrada!' : '¡Salida Registrada!'}
                  </h2>
                </div>

                {/* Empleado Info Box */}
                {result.empleado && (
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-4 text-left max-w-md mx-auto">
                    <img
                      src={result.empleado.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={result.empleado.nombre_completo}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/30 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-slate-100 truncate">
                        {result.empleado.nombre_completo}
                      </p>
                      <p className="text-xs text-sky-400 font-semibold truncate">{result.empleado.cargo}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{result.empleado.employee_code}</p>
                    </div>
                  </div>
                )}

                {/* Status & Time Grid */}
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto pt-2">
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hora Registrada</span>
                    <span className="text-base font-mono font-extrabold text-emerald-400">{result.hora}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-center flex flex-col items-center justify-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Estado</span>
                    {result.estado && <AttendanceStatusBadge status={result.estado} size="sm" />}
                  </div>
                </div>

                <p className="text-xs text-slate-400 pt-2">Regresando automáticamente en unos segundos...</p>
                <button
                  onClick={() => setResult(null)}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800"
                >
                  Registrar otra asistencia
                </button>
              </div>
            ) : (
              /* Error Screen */
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
                  <AlertCircle className="w-9 h-9" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-rose-400">Atención</span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                    No fue posible registrar la asistencia
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  {result.error?.message || 'Por favor verifica los datos o solicita asistencia a Recursos Humanos.'}
                </p>
                <button
                  onClick={() => setResult(null)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Intentar de nuevo
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Main Punch Screen */
          <div className="space-y-6">
            {/* Big Real-Time Clock */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-sky-400 font-semibold mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Hora Oficial Bogotá (UTC-5)</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-extrabold text-white font-mono tracking-tight drop-shadow-md">
                {time}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 capitalize font-medium">{date}</p>
            </div>

            {/* Action Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
              {/* Big QR Scan Button */}
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl text-white font-extrabold text-base sm:text-lg bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-xl shadow-sky-900/40 hover:shadow-sky-900/60 hover:scale-[1.01] active:scale-[0.99] transition-all group"
              >
                <QrCode className="w-6 h-6 group-hover:rotate-6 transition-transform" />
                <span>Escanear Carnet QR</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  O ingresa con tu cédula
                </span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              {/* Manual Cédula Input Form */}
              <form onSubmit={handleCedulaSubmit} className="space-y-3">
                <div className="relative flex items-center">
                  <Fingerprint className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={cedulaInput}
                    onChange={(e) => setCedulaInput(e.target.value)}
                    placeholder="Número de cédula o código..."
                    disabled={loading}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl pl-11 pr-4 py-3.5 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-mono transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !cedulaInput.trim()}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-100 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-sky-400" />
                  <span>{loading ? 'Validando...' : 'Registrar Asistencia'}</span>
                </button>
              </form>

              {/* Fast Test Chips for Immediate Evaluation */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Prueba Rápida con Empleados Demo:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {employees.slice(0, 4).map((emp) => (
                    <button
                      key={emp.employee_id}
                      type="button"
                      onClick={() => handleRegister(emp.employee_code, 'QR')}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
                    >
                      {emp.nombres.split(' ')[0]} ({emp.employee_code})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 z-10">
        <p>YORDEV CONTROL • Sistema de Gestión de Asistencia y Acceso Empresarial</p>
      </div>

      {/* QR Scanner Camera Modal */}
      <QRCodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(token) => handleRegister(token, 'QR')}
        availableEmployees={employees}
      />
    </div>
  );
};
