/* =========================================================
   Gestión de Vacantes — búsqueda, filtro por área y alta de vacantes.
   "Nueva Vacante" solo aparece con el permiso recruitment:manage.
   ========================================================= */
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import StatusBadge from '../../components/recruitment/StatusBadge';
import NewVacancyModal from '../../components/recruitment/NewVacancyModal';
import { useAuth } from '../../contexts/AuthContext';
import { useRecruitment } from '../../contexts/RecruitmentContext';
import { useToast } from '../../contexts/ToastContext';
import { AREAS } from '../../data/mockRecruitment';
import { PERMISSIONS } from '../../config/roles';

export default function Vacantes() {
  const { vacancies, loading, addVacancy } = useRecruitment();
  const { can } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [area, setArea] = useState('todas');
  const [modalOpen, setModalOpen] = useState(false);

  const canManage = can(PERMISSIONS.RECRUITMENT_MANAGE);

  // Filtrado derivado: se recalcula solo cuando cambian los datos o los filtros.
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return vacancies.filter(
      (v) => (!term || v.title.toLowerCase().includes(term)) && (area === 'todas' || v.area === area),
    );
  }, [vacancies, search, area]);

  const handleCreate = async (data) => {
    await addVacancy(data);
    showToast('Vacante creada correctamente');
  };

  return (
    <>
      <PageHeader
        title="Gestión de Vacantes"
        description="Administra las ofertas laborales activas y crea nuevas convocatorias."
      >
        {canManage && (
          <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={18} aria-hidden="true" /> Nueva Vacante
          </button>
        )}
      </PageHeader>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar vacante por cargo..."
            aria-label="Buscar vacante por cargo"
            className="field pl-10"
          />
        </div>
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          aria-label="Filtrar vacantes por área"
          className="field w-full sm:w-56"
        >
          <option value="todas">Todas las áreas</option>
          {Object.entries(AREAS).map(([key, name]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Tarjetas */}
      {loading ? (
        <p className="text-sm text-muted">Cargando vacantes…</p>
      ) : filtered.length === 0 ? (
        <p className="card p-8 text-center text-sm text-muted">No hay vacantes que coincidan con tu búsqueda.</p>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((v) => {
            const isClosed = v.status === 'cerrada';
            return (
              <article key={v.id} className="card flex flex-col p-5">
                <div className="mb-3 flex items-center justify-between">
                  <StatusBadge status={v.status} />
                  <span className="text-xs text-muted">{v.postedLabel}</span>
                </div>
                <h3 className="text-lg font-semibold text-ink">{v.title}</h3>
                <p className="mb-4 text-sm text-muted">Área: {AREAS[v.area] ?? v.area}</p>

                <div className="mb-5 grid grid-cols-2 gap-3 rounded-lg bg-panel-alt p-3 text-sm">
                  <div>
                    <span className="block text-xs text-muted">Postulantes</span>
                    <strong className="text-ink">{v.applicants}</strong>
                  </div>
                  <div>
                    <span className="block text-xs text-muted">Vacantes</span>
                    <strong className="text-ink">{v.slots}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isClosed}
                  onClick={() => navigate(`/reclutamiento/pipeline/${v.id}`)}
                  className="btn-secondary mt-auto w-full"
                >
                  {isClosed ? 'Proceso finalizado' : 'Ver proceso'}
                </button>
              </article>
            );
          })}
        </section>
      )}

      <NewVacancyModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreate} />
    </>
  );
}
