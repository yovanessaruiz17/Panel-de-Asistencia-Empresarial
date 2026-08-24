import React, { useState } from 'react';
import { Schedule } from '../../types';
import { Modal } from '../common/Modal';

interface ScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  schedule?: Schedule | null;
}

export const ScheduleFormModal: React.FC<ScheduleFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  schedule,
}) => {
  const [nombre, setNombre] = useState(schedule?.nombre || '');
  const [horaEntrada, setHoraEntrada] = useState(schedule?.hora_entrada || '08:00');
  const [horaSalida, setHoraSalida] = useState(schedule?.hora_salida || '17:00');
  const [toleranciaEntrada, setToleranciaEntrada] = useState(schedule?.tolerancia_entrada_minutos || 10);
  const [toleranciaSalida, setToleranciaSalida] = useState(schedule?.tolerancia_salida_minutos || 10);
  const [permiteHorasExtra, setPermiteHorasExtra] = useState(schedule?.permite_horas_extra ?? true);
  const [diasLaborales, setDiasLaborales] = useState<number[]>(schedule?.dias_laborales || [1, 2, 3, 4, 5]);
  const [loading, setLoading] = useState(false);

  const days = [
    { num: 1, label: 'Lunes' },
    { num: 2, label: 'Martes' },
    { num: 3, label: 'Miércoles' },
    { num: 4, label: 'Jueves' },
    { num: 5, label: 'Viernes' },
    { num: 6, label: 'Sábado' },
    { num: 7, label: 'Domingo' },
  ];

  const toggleDay = (num: number) => {
    if (diasLaborales.includes(num)) {
      setDiasLaborales(diasLaborales.filter((d) => d !== num));
    } else {
      setDiasLaborales([...diasLaborales, num].sort());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) return;

    try {
      setLoading(true);
      await onSave({
        nombre,
        hora_entrada: horaEntrada,
        hora_salida: horaSalida,
        tolerancia_entrada_minutos: Number(toleranciaEntrada),
        tolerancia_salida_minutos: Number(toleranciaSalida),
        permite_horas_extra: permiteHorasExtra,
        dias_laborales: diasLaborales,
        estado: 'ACTIVO',
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={schedule ? 'Editar Horario Laboral' : 'Nuevo Horario Laboral'}
      subtitle="Define los turnos, tolerancias y reglas de horas extras."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Horario *</label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            placeholder="Ej. Horario Administrativo General"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hora Entrada *</label>
            <input
              type="time"
              required
              value={horaEntrada}
              onChange={(e) => setHoraEntrada(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hora Salida *</label>
            <input
              type="time"
              required
              value={horaSalida}
              onChange={(e) => setHoraSalida(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tolerancia Entrada (min)</label>
            <input
              type="number"
              min="0"
              max="60"
              value={toleranciaEntrada}
              onChange={(e) => setToleranciaEntrada(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tolerancia Salida (min)</label>
            <input
              type="number"
              min="0"
              max="60"
              value={toleranciaSalida}
              onChange={(e) => setToleranciaSalida(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Días Laborales</label>
          <div className="flex flex-wrap gap-1.5">
            {days.map((d) => {
              const selected = diasLaborales.includes(d.num);
              return (
                <button
                  type="button"
                  key={d.num}
                  onClick={() => toggleDay(d.num)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    selected
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="permiteHorasExtra"
            checked={permiteHorasExtra}
            onChange={(e) => setPermiteHorasExtra(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-sky-600 focus:ring-sky-500"
          />
          <label htmlFor="permiteHorasExtra" className="text-xs font-medium text-slate-300">
            Habilitar cálculo y registro de horas extras para este horario
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-lg shadow-sky-900/30 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : schedule ? 'Actualizar Horario' : 'Crear Horario'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
