import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Building2, Download, Printer, ShieldCheck } from 'lucide-react';
import { Employee } from '../../types';
import { maskCedula } from '../../utils/formatters';

interface CarnetViewProps {
  employee: Employee;
  companyName?: string;
  onPrint?: () => void;
}

export const CarnetView: React.FC<CarnetViewProps> = ({
  employee,
  companyName = 'YORDEV S.A.S.',
  onPrint,
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* The Printable ID Card (Standard CR80 Badge Dimensions Aspect) */}
      <div
        id="printable-carnet"
        className="w-72 sm:w-80 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-sky-500/40 p-6 shadow-2xl relative overflow-hidden text-center select-none"
      >
        {/* Top Header Glow */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-400" />

        {/* Brand Header */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-white text-xs">
              YD
            </div>
            <div className="text-left">
              <span className="text-xs font-extrabold text-white tracking-wider block">YORDEV</span>
              <span className="text-[9px] text-sky-400 font-semibold tracking-widest uppercase">CONTROL</span>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
            {employee.estado}
          </span>
        </div>

        {/* Employee Photo with ring */}
        <div className="relative inline-block mx-auto mb-3">
          <img
            src={employee.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt={employee.nombres}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-sky-500/30 shadow-xl mx-auto"
          />
        </div>

        {/* Name & Title */}
        <h3 className="font-extrabold text-base text-white tracking-tight leading-snug">
          {employee.nombres} {employee.apellidos}
        </h3>
        <p className="text-xs font-semibold text-sky-400 mt-0.5">{employee.cargo}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{employee.departamento}</p>

        {/* QR Code Container */}
        <div className="my-4 p-3 bg-white rounded-2xl shadow-inner inline-block mx-auto">
          <QRCodeSVG
            value={employee.qr_token || employee.employee_code}
            size={110}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* ID Details */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="text-left">
            <span className="text-[9px] text-slate-400 block uppercase font-semibold">Cód. Empleado</span>
            <span className="font-mono font-bold text-sky-400">{employee.employee_code}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-400 block uppercase font-semibold">Documento</span>
            <span className="font-mono text-slate-300">C.C. {maskCedula(employee.cedula)}</span>
          </div>
        </div>

        {/* Watermark Footer */}
        <div className="mt-3 text-[9px] text-slate-400 font-medium">
          {companyName} • {employee.sede}
        </div>
      </div>

      {/* Print / Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onPrint || (() => window.print())}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-900/30 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Carnet</span>
        </button>
      </div>
    </div>
  );
};
