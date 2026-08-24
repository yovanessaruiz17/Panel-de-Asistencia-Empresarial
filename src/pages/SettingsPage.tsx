import React, { useState } from 'react';
import {
  Building2,
  Database,
  Download,
  Globe,
  Lock,
  RefreshCw,
  Save,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, showToast, isOnline } = useApp();

  const [companyName, setCompanyName] = useState(settings?.company_name || 'YORDEV S.A.S.');
  const [nit, setNit] = useState(settings?.nit || '901.458.789-2');
  const [direccion, setDireccion] = useState(settings?.direccion || 'Calle 100 # 8A - 55, Bogotá');
  const [telefono, setTelefono] = useState(settings?.telefono || '+57 (1) 745-8900');
  const [toleranciaEntrada, setToleranciaEntrada] = useState(settings?.tolerancia_entrada_default || 10);
  const [toleranciaSalida, setToleranciaSalida] = useState(settings?.tolerancia_salida_default || 10);
  const [modoDemo, setModoDemo] = useState(settings?.modo_demo ?? true);
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState(settings?.google_sheets_url || '');

  const handleSave = () => {
    updateSettings({
      company_name: companyName,
      nit,
      direccion,
      telefono,
      tolerancia_entrada_default: Number(toleranciaEntrada),
      tolerancia_salida_default: Number(toleranciaSalida),
      modo_demo: modoDemo,
      google_sheets_url: googleSheetsUrl,
    });
    showToast({
      type: 'success',
      title: 'Configuración guardada',
      message: 'Los cambios fueron aplicados al sistema.',
    });
  };

  const handleExportBackup = () => {
    const backupData = {
      settings,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yordev_control_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast({
      type: 'success',
      title: 'Backup generado',
      message: 'Archivo JSON descargado exitosamente.',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">Configuración del Sistema</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Parámetros institucionales, reglas globales de tolerancia y conexión con bases de datos.
        </p>
      </div>

      {/* Company Info */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-sky-400" /> Información Institucional
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Razón Social</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">NIT / Identificación Tributaria</label>
            <input
              type="text"
              value={nit}
              onChange={(e) => setNit(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección Principal</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Corporativo</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Global Tolerances */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-400" /> Reglas de Tolerancia Globales
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tolerancia de Entrada por Defecto (minutos)
            </label>
            <input
              type="number"
              value={toleranciaEntrada}
              onChange={(e) => setToleranciaEntrada(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Minutos permitidos después de la hora antes de clasificar como Llegada Tarde.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tolerancia de Salida por Defecto (minutos)
            </label>
            <input
              type="number"
              value={toleranciaSalida}
              onChange={(e) => setToleranciaSalida(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Minutos antes de la hora pactada para registrar como Salida Temprana.
            </p>
          </div>
        </div>
      </div>

      {/* Persistence & Data Engine */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-sky-400" /> Motor de Almacenamiento & Integración
        </h3>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Modo Demostración Activo</p>
              <p className="text-[11px] text-slate-400">
                Usa el proveedor de almacenamiento local simulado (LocalStorage) para pruebas y auditoría.
              </p>
            </div>
            <input
              type="checkbox"
              checked={modoDemo}
              onChange={(e) => setModoDemo(e.target.checked)}
              className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-sky-600 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              URL del Web App de Google Apps Script (Google Sheets Backend)
            </label>
            <input
              type="url"
              value={googleSheetsUrl}
              onChange={(e) => setGoogleSheetsUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Backup JSON</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-900/30 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Configuración</span>
        </button>
      </div>
    </div>
  );
};
