import React, { useEffect, useState } from 'react';
import { Download, Filter, Printer, QrCode, Search } from 'lucide-react';
import { CarnetView } from '../components/carnets/CarnetView';
import { LoadingState } from '../components/common/LoadingState';
import { SearchInput } from '../components/common/SearchInput';
import { employeeService } from '../services/employeeService';
import { Employee } from '../types';

export const CarnetsPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employeeService.getAll().then((list) => {
      setEmployees(list);
      if (list.length > 0) setSelectedEmp(list[0]);
      setLoading(false);
    });
  }, []);

  const filteredEmployees = employees.filter((e) => {
    const fullName = `${e.nombres} ${e.apellidos}`.toLowerCase();
    return !searchTerm || fullName.includes(searchTerm.toLowerCase()) || e.employee_code.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Carnetización & Credenciales QR</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Generador e impresor de carnets de identificación corporativa con tokens de acceso únicos.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Cargando generador de carnets..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Employee Picker Column */}
          <div className="lg:col-span-5 space-y-3">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar colaborador..."
            />

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredEmployees.map((emp) => {
                const isSelected = selectedEmp?.employee_id === emp.employee_id;
                return (
                  <button
                    key={emp.employee_id}
                    onClick={() => setSelectedEmp(emp)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-sky-950/40 border-sky-500/50 shadow-md ring-1 ring-sky-500/30'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={emp.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                      alt={emp.nombres}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-sky-300' : 'text-slate-200'}`}>
                        {emp.nombres} {emp.apellidos}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{emp.cargo}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-sky-400">{emp.employee_code}</span>
                        <span className="text-[10px] text-slate-400">• {emp.sede}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Carnet Preview Column */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm min-h-[500px]">
            {selectedEmp ? (
              <CarnetView employee={selectedEmp} />
            ) : (
              <p className="text-xs text-slate-400">Selecciona un colaborador para previsualizar su carnet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
