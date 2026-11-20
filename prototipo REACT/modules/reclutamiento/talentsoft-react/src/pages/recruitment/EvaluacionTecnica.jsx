/* =========================================================
   Evaluación Técnica — lista de candidatos evaluados + panel de detalle.
   El candidato seleccionado vive en la URL (/evaluacion/:candidatoId),
   así los enlaces desde el Banco y el Pipeline abren directo su perfil.
   Contratar / Descartar requieren recruitment:manage.
   ========================================================= */
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { History, Search, UserX } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import CandidateAvatar from '../../components/recruitment/CandidateAvatar';
import StatusBadge from '../../components/recruitment/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { useRecruitment } from '../../contexts/RecruitmentContext';
import { useToast } from '../../contexts/ToastContext';
import { PERMISSIONS } from '../../config/roles';

function InfoCard({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-panel-alt p-4">
      <span className="text-xs text-muted">{label}</span>
      <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}

export default function EvaluacionTecnica() {
  const { candidatoId } = useParams();
  const navigate = useNavigate();
  const { candidates, loading, hireCandidate, discardCandidate } = useRecruitment();
  const { can } = useAuth();
  const { showToast } = useToast();

  const canManage = can(PERMISSIONS.RECRUITMENT_MANAGE);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Solo los candidatos que ya tienen una evaluación técnica.
  const evaluated = useMemo(() => candidates.filter((c) => c.match !== null), [candidates]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return evaluated.filter(
      (c) =>
        (!term || c.name.toLowerCase().includes(term)) && (filter === 'all' || c.evalStatus === filter),
    );
  }, [evaluated, search, filter]);

  // Candidato mostrado: el de la URL o, si no hay, el primero evaluado.
  const selected = candidatoId
    ? candidates.find((c) => c.id === candidatoId) ?? null
    : evaluated[0] ?? null;
  const hasEvaluation = selected && selected.match !== null;

  const handleHire = () => {
    hireCandidate(selected.id);
    showToast(`${selected.name} fue marcado como contratado`);
  };
  const handleDiscard = () => {
    discardCandidate(selected.id);
    showToast(`${selected.name} fue descartado del proceso`);
  };

  return (
    <>
      <PageHeader
        title="Evaluación Técnica"
        description="Resultados de la prueba práctica de los candidatos en proceso."
      />

      {loading ? (
        <p className="text-sm text-muted">Cargando evaluaciones…</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          {/* ---------- Lista ---------- */}
          <section aria-label="Candidatos evaluados" className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar candidatos..."
                  aria-label="Buscar candidatos"
                  className="field pl-9"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filtrar por resultado"
                className="field w-32"
              >
                <option value="all">Todos</option>
                <option value="aceptado">Aceptados</option>
                <option value="pendiente">Pendientes</option>
                <option value="rechazado">Rechazados</option>
              </select>
            </div>

            <ul className="space-y-2">
              {visible.length === 0 && (
                <li className="card p-6 text-center text-sm text-muted">No hay candidatos con esos filtros.</li>
              )}
              {visible.map((c) => {
                const active = selected?.id === c.id;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => navigate(`/reclutamiento/evaluacion/${c.id}`)}
                      aria-current={active ? 'true' : undefined}
                      className={[
                        'card flex w-full items-center gap-3 p-3.5 text-left transition',
                        active ? 'border-brand ring-1 ring-brand/50' : 'hover:border-brand/60',
                      ].join(' ')}
                    >
                      <CandidateAvatar candidate={c} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-ink">{c.name}</p>
                        <p className="mb-1 truncate text-xs text-muted">{c.email}</p>
                        <StatusBadge status={c.evalStatus} />
                      </div>
                      <span
                        className={`text-lg font-bold ${
                          c.match >= 70 ? 'text-emerald-500' : 'text-red-500'
                        }`}
                      >
                        {c.match}%
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* ---------- Detalle ---------- */}
          <section aria-label="Detalle del candidato" className="card min-w-0 p-6">
            {!selected || !hasEvaluation ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <UserX size={36} className="text-muted" aria-hidden="true" />
                <p className="max-w-xs text-sm text-muted">
                  {selected
                    ? `${selected.name} todavía no tiene una evaluación técnica registrada.`
                    : 'Selecciona un candidato para ver su evaluación.'}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-wrap items-center gap-4">
                  <CandidateAvatar candidate={selected} size="lg" />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold text-ink">{selected.name}</h2>
                    <p className="text-sm text-muted">{selected.role}</p>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      <StatusBadge status={selected.evalStatus} />
                      {selected.status === 'contratado' && <StatusBadge status="contratado" />}
                    </div>
                  </div>
                  {canManage && (
                    <div className="flex gap-2">
                      <button type="button" onClick={handleDiscard} className="btn-secondary">
                        Descartar
                      </button>
                      <button
                        type="button"
                        onClick={handleHire}
                        disabled={selected.status === 'contratado'}
                        className="btn-primary"
                      >
                        Contratar
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-6 grid gap-3 sm:grid-cols-2">
                  <InfoCard label="Teléfono" value={selected.phone} />
                  <InfoCard label="Experiencia" value={`${selected.experience} en confección`} />
                  <InfoCard label="Ubicación" value={selected.location} />
                  <InfoCard label="Disponibilidad" value={selected.availability} />
                </div>

                <h3 className="mb-2 font-semibold text-ink">Habilidades Destacadas</h3>
                <div className="mb-6 flex flex-wrap gap-2">
                  {selected.skillTags.map((tag) => (
                    <span key={tag} className="skill-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="mb-2 font-semibold text-ink">Perfil Profesional</h3>
                <p className="mb-6 text-sm leading-relaxed text-muted">{selected.about}</p>

                <Link to={`/reclutamiento/historial/${selected.id}`} className="btn-secondary">
                  <History size={16} aria-hidden="true" /> Ver historial del proceso
                </Link>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
