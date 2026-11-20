/* =========================================================
   Banco de Candidatos — tabla con búsqueda, filtros y exportación CSV.
   ========================================================= */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Eye, FileDown, Search } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import CandidateAvatar from '../../components/recruitment/CandidateAvatar';
import StatusBadge from '../../components/recruitment/StatusBadge';
import { useRecruitment } from '../../contexts/RecruitmentContext';
import { useToast } from '../../contexts/ToastContext';
import { CANDIDATE_STATUS_LABEL } from '../../data/mockRecruitment';

// Valor del <select> → texto que se busca dentro de las habilidades.
const SKILL_FILTERS = {
  plana: 'máquina plana',
  fileteadora: 'fileteadora',
  calidad: 'calidad',
};

/** Escapa un campo para CSV ("" dentro de comillas). */
const csvField = (value) => `"${String(value).replace(/"/g, '""')}"`;

export default function BancoCandidatos() {
  const { candidates, loading } = useRecruitment();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('todos');
  const [status, setStatus] = useState('todos');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return candidates.filter((c) => {
      const matchesTerm =
        !term || c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term);
      const matchesSkill = skill === 'todos' || c.skills.toLowerCase().includes(SKILL_FILTERS[skill]);
      const matchesStatus = status === 'todos' || c.status === status;
      return matchesTerm && matchesSkill && matchesStatus;
    });
  }, [candidates, search, skill, status]);

  // Exporta solo lo que se ve en pantalla (respeta los filtros).
  const handleExport = () => {
    const header = ['Candidato', 'Correo', 'Habilidades', 'Experiencia', 'Estado'];
    const rows = filtered.map((c) =>
      [c.name, c.email, c.skills, c.experience, CANDIDATE_STATUS_LABEL[c.status]].map(csvField).join(','),
    );
    // "﻿" (BOM) para que Excel muestre bien las tildes.
    const csv = '﻿' + [header.map(csvField).join(','), ...rows].join('\n');

    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'banco_candidatos.csv';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Datos exportados a CSV');
  };

  return (
    <>
      <PageHeader
        title="Banco de Candidatos"
        description="Directorio general de talento y aspirantes registrados en el sistema."
      >
        <button type="button" onClick={handleExport} disabled={filtered.length === 0} className="btn-primary">
          <FileDown size={18} aria-hidden="true" /> Exportar Datos
        </button>
      </PageHeader>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            aria-label="Buscar por nombre o correo"
            className="field pl-10"
          />
        </div>
        <select value={skill} onChange={(e) => setSkill(e.target.value)} aria-label="Filtrar por habilidad" className="field w-full sm:w-52">
          <option value="todos">Cualquier habilidad</option>
          <option value="plana">Máquina Plana</option>
          <option value="fileteadora">Fileteadora</option>
          <option value="calidad">Control de Calidad</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filtrar por estado" className="field w-full sm:w-48">
          <option value="todos">Cualquier estado</option>
          <option value="disponible">Disponible</option>
          <option value="proceso">En Proceso</option>
          <option value="contratado">Contratado</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Candidato</th>
              <th className="px-5 py-3 font-medium">Habilidades Clave</th>
              <th className="px-5 py-3 font-medium">Experiencia</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted">
                  Cargando candidatos…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted">
                  No se encontraron candidatos con esos filtros.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-ink/5">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <CandidateAvatar candidate={c} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{c.name}</p>
                      <p className="truncate text-xs text-muted">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted">{c.skills}</td>
                <td className="px-5 py-3.5 text-muted">{c.experience}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-1">
                    <Link
                      to={`/reclutamiento/evaluacion/${c.id}`}
                      title="Ver perfil"
                      aria-label={`Ver perfil de ${c.name}`}
                      className="rounded-lg p-2 text-muted transition-colors hover:bg-ink/10 hover:text-brand"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      type="button"
                      title="Descargar CV"
                      aria-label={`Descargar CV de ${c.name}`}
                      onClick={() => showToast(`Descargando CV de ${c.name}...`)}
                      className="rounded-lg p-2 text-muted transition-colors hover:bg-ink/10 hover:text-brand"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
