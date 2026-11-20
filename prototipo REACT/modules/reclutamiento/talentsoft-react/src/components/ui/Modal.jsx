/* =========================================================
   Modal accesible: cierra con Esc o al hacer clic fuera,
   bloquea el scroll del fondo y enfoca el primer campo.
   ========================================================= */
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, title, onClose, children }) {
  const panelRef = useRef(null);

  // Guardamos onClose en una ref: así el efecto solo se ejecuta al abrir/cerrar
  // y no vuelve a enfocar el primer campo cada vez que el padre se re-renderiza.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => e.key === 'Escape' && onCloseRef.current();
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Enfoca el primer campo del formulario.
    panelRef.current?.querySelector('input, select, textarea, button')?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="card w-full max-w-md p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-ink/10 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
