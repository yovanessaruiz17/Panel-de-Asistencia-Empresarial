import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Building2,
  Calendar,
  Clock,
  Download,
  Mail,
  MapPin,
  Phone,
  Printer,
  QrCode,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { Employee, Schedule } from '../../types';
import { maskCedula } from '../../utils/formatters';
import { Modal } from '../common/Modal';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  schedule?: Schedule | null;
  onRegenerateQR?: (id: string) => Promise<string>;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
  schedule,
  onRegenerateQR,
}) => {
  const [regenerating, setRegenerating] = useState(false);
  const [currentQrToken, setCurrentQrToken] = useState(employee?.qr_token || '');

  if (!employee) return null;

  const handleRegenerate = async () => {
    if (!onRegenerateQR) return;
    try {
      setRegenerating(true);
      const newToken = await onRegenerateQR(employee.employee_id);
      setCurrentQrToken(newToken);
    } catch (e) {
      console.error(e);
    } finally {
      setRegenerating(false);
    }
  };

  const handlePrintBadge = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Perfil del Colaborador" maxWidth="2xl">
      <div className="space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
          <img
            src={employee.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={employee.nombres}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-sky-500/40 shadow-lg shrink-0"
          />

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h3 className="text-lg font-bold text-white">
                {employee.nombres} {employee.apellidos}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {employee.estado}
              </span>
            </div>

            <p className="text-xs text-sky-400 font-semibold mb-2">{employee.cargo}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-mono">C.C. {maskCedula(employee.cedula)}</span>
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-mono font-bold text-sky-400">{employee.employee_code}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{employee.departamento}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{employee.sede}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" /> Horario Asignado
            </h4>
            <p className="text-xs font-bold text-white">{schedule?.nombre || 'Horario General'}</p>
            <p className="text-xs text-slate-400 font-mono">
              Jornada: {schedule?.hora_entrada || '08:00'} - {schedule?.hora_salida || '17:00'}
            </p>
            <p className="text-[11px] text-slate-400">
              Tolerancia entrada: {schedule?.tolerancia_entrada_minutos || 10} min
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-400" /> Datos de Contacto
            </h4>
            <p className="text-xs text-slate-300 flex items-center gap-2 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-500" /> {employee.email}
            </p>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500" /> {employee.telefono || 'Sin registrar'}
            </p>
            <p className="text-[11px] text-slate-400 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Ingreso: {employee.fecha_ingreso}
            </p>
          </div>
        </div>

        {/* QR Code & Carnet Badge Section */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-sky-400/50 shrink-0">
              <QRCodeSVG
                value={currentQrToken || employee.qr_token || employee.employee_code}
                size={110}
                level="H"
                includeMargin={false}
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">Carnet Digital QR</span>
              <h4 className="text-sm font-bold text-white mt-0.5">Token de Acceso Único</h4>
              <p className="text-xs font-mono text-slate-400 mt-1 bg-slate-900 px-2 py-1 rounded border border-slate-800 inline-block">
                {currentQrToken || employee.qr_token || employee.employee_code}
              </p>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Utilizado para registrar asistencia en el Kiosco /marcar mediante la cámara.
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
            {onRegenerateQR && (
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
                <span>Regenerar QR</span>
              </button>
            )}
            <button
              onClick={handlePrintBadge}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-lg shadow-sky-900/30 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Carnet</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
