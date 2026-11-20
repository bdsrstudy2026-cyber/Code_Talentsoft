/* =========================================================
   Pipeline — tablero kanban con arrastrar y soltar (HTML5 DnD).

   - Cada vacante tiene su propio pipeline (/reclutamiento/pipeline/:vacanteId).
   - Mover candidatos requiere recruitment:manage; con solo "ver" el
     tablero es de lectura.
   - Como el drag & drop nativo no funciona en pantallas táctiles, cada
     tarjeta incluye también un selector "Mover a…".
   ========================================================= */
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import CandidateAvatar from '../../components/recruitment/CandidateAvatar';
import { useAuth } from '../../contexts/AuthContext';
import { useRecruitment } from '../../contexts/RecruitmentContext';
import { useToast } from '../../contexts/ToastContext';
import { PIPELINE_STAGES } from '../../data/mockRecruitment';
import { PERMISSIONS } from '../../config/roles';

function CandidateCard({ candidate, canManage, onDragStart, onDragEnd, onMove, isDragging }) {
  const isHired = candidate.pipelineStage === 'contratados';

  return (
    <div
      draggable={canManage}
      onDragStart={(e) => onDragStart(e, candidate.id)}
      onDragEnd={onDragEnd}
      className={[
        'rounded-lg border p-3 transition',
        isHired ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-line bg-panel-alt',
        canManage ? 'cursor-grab active:cursor-grabbing' : '',
        isDragging ? 'opacity-40' : '',
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        <CandidateAvatar candidate={candidate} size="sm" />
        <div className="min-w-0">
          <Link
            to={`/reclutamiento/evaluacion/${candidate.id}`}
            draggable={false}
            className="block truncate text-sm font-semibold text-ink hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            {candidate.name}
          </Link>
          {candidate.match !== null ? (
            <span
              className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                candidate.match >= 70
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/15 text-red-600 dark:text-red-400'
              }`}
            >
              Perfil: {candidate.match}%
            </span>
          ) : (
            <p className="truncate text-xs text-muted">
              Exp: {candidate.experience} • {candidate.skills.split(',')[0]}
            </p>
          )}
        </div>
      </div>

      {canManage && (
        <select
          aria-label={`Mover a ${candidate.name} a otra etapa`}
          value={candidate.pipelineStage}
          onChange={(e) => onMove(candidate.id, e.target.value)}
          className="mt-3 w-full rounded-md border border-line bg-panel px-2 py-1 text-xs text-muted focus:border-brand focus:outline-none"
        >
          {PIPELINE_STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              Mover a: {s.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default function Pipeline() {
  const { vacanteId } = useParams();
  const { candidates, vacancies, loading, moveCandidate } = useRecruitment();
  const { can } = useAuth();
  const { showToast } = useToast();

  const canManage = can(PERMISSIONS.RECRUITMENT_MANAGE);

  const [draggingId, setDraggingId] = useState(null);
  const [overStage, setOverStage] = useState(null);

  // Vacante indicada en la URL o, si no hay, la primera activa.
  const vacancy =
    vacancies.find((v) => v.id === vacanteId) ?? vacancies.find((v) => v.status === 'activa') ?? null;

  const stageLabel = (id) => PIPELINE_STAGES.find((s) => s.id === id)?.label ?? id;

  const handleMove = (id, stage) => {
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate || candidate.pipelineStage === stage) return;
    moveCandidate(id, stage);
    showToast(`${candidate.name} movido a "${stageLabel(stage)}"`);
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(id);
  };

  const handleDrop = (e, stage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggingId;
    setOverStage(null);
    setDraggingId(null);
    if (id) handleMove(id, stage);
  };

  return (
    <>
      <PageHeader
        title={vacancy ? `Pipeline: ${vacancy.title}` : 'Pipeline'}
        description={
          canManage
            ? 'Arrastra y suelta a los candidatos entre las diferentes etapas del proceso.'
            : 'Consulta en qué etapa del proceso se encuentra cada candidato.'
        }
      >
        <Link to="/reclutamiento" className="btn-secondary">
          <ArrowLeft size={16} aria-hidden="true" /> Volver a Vacantes
        </Link>
      </PageHeader>

      {loading ? (
        <p className="text-sm text-muted">Cargando pipeline…</p>
      ) : !vacancy ? (
        <p className="card p-8 text-center text-sm text-muted">No hay vacantes activas.</p>
      ) : (
        <section className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PIPELINE_STAGES.map((stage) => {
            const items = candidates.filter(
              (c) => c.vacancyId === vacancy.id && c.pipelineStage === stage.id,
            );
            const isOver = overStage === stage.id;

            return (
              <div
                key={stage.id}
                onDragOver={(e) => {
                  if (!canManage) return;
                  e.preventDefault(); // necesario para permitir el "drop"
                  setOverStage(stage.id);
                }}
                onDragLeave={(e) => {
                  // Ignora los dragleave que ocurren al pasar sobre los hijos.
                  if (!e.currentTarget.contains(e.relatedTarget)) setOverStage(null);
                }}
                onDrop={(e) => canManage && handleDrop(e, stage.id)}
                className={[
                  'card overflow-hidden border-t-[3px] transition-colors',
                  stage.accent ? 'border-t-emerald-500' : 'border-t-transparent',
                  isOver ? 'ring-2 ring-brand/60' : '',
                ].join(' ')}
              >
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <h3 className="text-sm font-semibold text-ink">{stage.label}</h3>
                  <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-semibold text-muted">
                    {items.length}
                  </span>
                </div>

                <div className="min-h-[88px] space-y-3 p-3">
                  {items.length === 0 && (
                    <p className="py-4 text-center text-xs text-muted">Sin candidatos</p>
                  )}
                  {items.map((c) => (
                    <CandidateCard
                      key={c.id}
                      candidate={c}
                      canManage={canManage}
                      isDragging={draggingId === c.id}
                      onDragStart={handleDragStart}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setOverStage(null);
                      }}
                      onMove={handleMove}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}
    </>
  );
}
