/* =========================================================
   ToastContext — avisos breves (equivalente a showToast del prototipo)

   Uso:
     const { showToast } = useToast();
     showToast('Vacante creada correctamente');
     showToast('No se pudo guardar', 'error');
   ========================================================= */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    clearTimeout(timerRef.current);
    setToast({ id: Date.now(), message, type });
    timerRef.current = setTimeout(() => setToast(null), 2800);
  }, []);

  // Limpia el temporizador al desmontar.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const value = useMemo(() => ({ showToast }), [showToast]);
  const Icon = toast?.type === 'error' ? XCircle : CheckCircle2;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* aria-live: los lectores de pantalla anuncian el mensaje */}
      <div aria-live="polite" className="pointer-events-none fixed bottom-6 right-6 z-[60]">
        {toast && (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-2.5 rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink shadow-xl"
          >
            <Icon
              size={18}
              className={toast.type === 'error' ? 'text-red-500' : 'text-emerald-500'}
              aria-hidden="true"
            />
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>.');
  return ctx;
}
