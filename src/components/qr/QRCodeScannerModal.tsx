import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Camera, Check, RefreshCw, X, Zap } from 'lucide-react';
import { Employee } from '../../types';
import { Modal } from '../common/Modal';

interface QRCodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (token: string) => void;
  availableEmployees?: Employee[];
}

export const QRCodeScannerModal: React.FC<QRCodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  availableEmployees = [],
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const startCamera = async () => {
      if (!isOpen) return;

      try {
        setCameraError('');
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        console.warn('Camera access error:', err);
        setHasCamera(false);
        setCameraError('No se pudo acceder a la cámara o el permiso fue denegado.');
      }
    };

    if (isOpen) {
      startCamera();
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleSimulateScan = (token: string) => {
    onScanSuccess(token);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Escáner de Carnet QR" maxWidth="md">
      <div className="space-y-4">
        {/* Camera Preview Box */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 flex items-center justify-center">
          {hasCamera && !cameraError ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Scanning Target Reticle */}
              <div className="absolute inset-8 border-2 border-dashed border-sky-400/80 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-pulse" />
              </div>

              <div className="absolute bottom-3 inset-x-3 bg-slate-950/80 backdrop-blur-md py-1.5 px-3 rounded-xl border border-slate-800 text-center">
                <p className="text-[11px] text-slate-300 font-medium">Apunta la cámara al código QR de tu carnet</p>
              </div>
            </>
          ) : (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-200">Cámara no disponible</h4>
              <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                {cameraError || 'Selecciona un colaborador de prueba abajo para simular la lectura instantánea.'}
              </p>
            </div>
          )}
        </div>

        {/* Test Quick Scan Simulator for Developer/Device Convenience */}
        {availableEmployees.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Simular Escaneo Rápido
              </span>
              <span className="text-[10px] text-slate-400">Prueba con 1 clic</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
              {availableEmployees.slice(0, 6).map((emp) => (
                <button
                  key={emp.employee_id}
                  onClick={() => handleSimulateScan(emp.qr_token || emp.employee_code)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800 text-left transition-all group"
                >
                  <img
                    src={emp.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                    alt={emp.nombres}
                    className="w-6 h-6 rounded-md object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-200 truncate group-hover:text-sky-300">
                      {emp.nombres.split(' ')[0]} {emp.apellidos.split(' ')[0]}
                    </p>
                    <span className="text-[9px] font-mono text-slate-400 block truncate">{emp.employee_code}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cerrar Escáner
          </button>
        </div>
      </div>
    </Modal>
  );
};
