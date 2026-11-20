/* =========================================================
   RecruitmentLayout — barra de pestañas del módulo de Reclutamiento
   (Vacantes · Pipeline · Banco · Evaluación · Historial) + <Outlet />.
   ========================================================= */
import { NavLink, Outlet } from 'react-router-dom';

const TABS = [
  { to: '/reclutamiento', label: 'Vacantes', end: true },
  { to: '/reclutamiento/pipeline', label: 'Pipeline' },
  { to: '/reclutamiento/banco', label: 'Banco de Candidatos' },
  { to: '/reclutamiento/evaluacion', label: 'Evaluación Técnica' },
  { to: '/reclutamiento/historial', label: 'Historial de Procesos' },
];

export default function RecruitmentLayout() {
  return (
    <div>
      <nav
        aria-label="Secciones de Reclutamiento"
        className="-mx-1 mb-6 flex gap-1 overflow-x-auto border-b border-line px-1 pb-px"
      >
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              [
                '-mb-px shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand',
                isActive
                  ? 'border-brand text-brand'
                  : 'border-transparent text-muted hover:border-line hover:text-ink',
              ].join(' ')
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
