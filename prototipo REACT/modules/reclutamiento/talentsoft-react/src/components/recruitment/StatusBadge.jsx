/* Etiqueta de color para estados de candidatos, evaluaciones y vacantes. */
const TONES = {
  proceso: { label: 'En Proceso', cls: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  disponible: { label: 'Disponible', cls: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  contratado: { label: 'Contratado', cls: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  aceptado: { label: 'Aceptado', cls: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  rechazado: { label: 'Rechazado', cls: 'bg-red-500/15 text-red-600 dark:text-red-400' },
  pendiente: { label: 'Pendiente', cls: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  activa: { label: 'Activa', cls: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  cerrada: { label: 'Cerrada', cls: 'bg-slate-500/15 text-slate-600 dark:text-slate-400' },
};

export default function StatusBadge({ status, label }) {
  const tone = TONES[status] ?? TONES.pendiente;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tone.cls}`}>
      {label ?? tone.label}
    </span>
  );
}
