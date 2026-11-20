/* =========================================================
   Historial de Procesos — línea de tiempo de un candidato.
   Los pasos (PROCESS_STEPS) son fijos; su estado se deriva de la etapa
   actual del candidato en el pipeline (STAGE_TO_STEP).
   Ruta: /reclutamiento/historial/:candidatoId  (sin id → primer candidato).
   ========================================================= */
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Clock, MoreHorizontal } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { useRecruitment } from '../../contexts/RecruitmentContext';
import { PROCESS_STEPS, STAGE_TO_STEP } from '../../data/mockRecruitment';

// Apariencia de cada estado del paso.
const STEP_STYLES = {
  completed: {
    icon: Check,
    label: 'Completado',
    marker: 'bg-emerald-500 text-white',
    badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  active: {
    icon: Clock,
    label: 'En Curso',
    marker: 'bg-brand text-white',
    badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  },
  pending: {
    icon: MoreHorizontal,
    label: 'Pendiente',
    marker: 'bg-panel-alt text-muted border border-line',
    badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
};

export default function HistorialProceso() {
  const { candidatoId } = useParams();
  const navigate = useNavigate();
  const { candidates, vacancies, loading } = useRecruitment();

  // Candidato de la URL o, si no hay, el primero que esté en un proceso.
  const candidate = candidatoId
    ? candidates.find((c) => c.id === candidatoId) ?? null
    : candidates.find((c) => c.pipelineStage) ?? candidates[0] ?? null;

  const vacancy = candidate ? vacancies.find((v) => v.id === candidate.vacancyId) : null;
  const currentStep = candidate?.pipelineStage != null ? STAGE_TO_STEP[candidate.pipelineStage] : 1;

  const stepState = (index) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  return (
    <>
      <PageHeader
        title="Historial del Proceso"
        description={
          candidate
            ? `Seguimiento de las etapas de selección de ${candidate.name}.`
            : 'Seguimiento detallado de las etapas de selección del candidato.'
        }
      >
        <button type="button" onClick={() => navigate(-1)} className="btn-primary">
          <ArrowLeft size={16} aria-hidden="true" /> Volver
        </button>
      </PageHeader>

      {loading ? (
        <p className="text-sm text-muted">Cargando historial…</p>
      ) : !candidate ? (
        <p className="card p-8 text-center text-sm text-muted">No se encontró el candidato solicitado.</p>
      ) : (
        <>
          {/* Selector para cambiar de candidato sin salir de la pantalla */}
          <div className="mb-6 max-w-sm">
            <label htmlFor="historialCandidato" className="mb-1.5 block text-xs font-medium text-muted">
              Candidato
            </label>
            <select
              id="historialCandidato"
              value={candidate.id}
              onChange={(e) => navigate(`/reclutamiento/historial/${e.target.value}`, { replace: true })}
              className="field"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {candidate.pipelineStage === null && (
            <p className="mb-6 rounded-lg border border-line bg-panel-alt px-4 py-3 text-sm text-muted">
              Este candidato no está en un proceso activo; se muestra el historial desde su postulación.
            </p>
          )}

          <ol className="relative ml-4 max-w-3xl space-y-8 border-l-2 border-line pl-8">
            {PROCESS_STEPS.map((step, index) => {
              const state = stepState(index);
              const style = STEP_STYLES[state];
              const Icon = style.icon;
              const date = index === 0 ? candidate.appliedAt : state === 'pending' ? 'Próximamente' : step.date;

              return (
                <li key={step.id} className="relative">
                  {/* Marcador sobre la línea */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[3.15rem] top-1 flex h-9 w-9 items-center justify-center rounded-full ring-4 ring-[rgb(var(--ts-bg))] ${style.marker}`}
                  >
                    <Icon size={18} />
                  </span>

                  <div className="card p-5">
                    <span className="text-xs text-muted">{date}</span>
                    <h3 className="mb-1 mt-0.5 font-semibold text-ink">{step.title}</h3>
                    <p className="mb-3 text-sm text-muted">{step.description(vacancy?.title ?? candidate.role)}</p>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${style.badge}`}>
                      {style.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}
