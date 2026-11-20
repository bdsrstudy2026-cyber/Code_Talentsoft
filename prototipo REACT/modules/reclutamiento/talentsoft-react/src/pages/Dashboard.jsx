/* =========================================================
   Dashboard — resumen del módulo de reclutamiento
   (estadísticas calculadas desde RecruitmentContext).
   ========================================================= */
import { Link } from 'react-router-dom';
import { BriefcaseBusiness, ClipboardCheck, Clock, Contact, GitBranch, UserCheck, Users } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { useRecruitment } from '../contexts/RecruitmentContext';

const MODULE_LINKS = [
  {
    to: '/reclutamiento',
    icon: BriefcaseBusiness,
    title: 'Gestión de Vacantes',
    text: 'Crea y administra las convocatorias activas.',
  },
  {
    to: '/reclutamiento/pipeline',
    icon: GitBranch,
    title: 'Pipeline',
    text: 'Sigue a los candidatos etapa por etapa.',
  },
  {
    to: '/reclutamiento/banco',
    icon: Contact,
    title: 'Banco de Candidatos',
    text: 'Directorio completo de talento disponible.',
  },
  {
    to: '/reclutamiento/evaluacion',
    icon: ClipboardCheck,
    title: 'Evaluación Técnica',
    text: 'Revisa resultados y perfiles evaluados.',
  },
];

function StatCard({ icon: Icon, value, label, loading }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
        <Icon size={22} aria-hidden="true" />
      </span>
      <div>
        <p className="text-2xl font-bold leading-none text-ink">{loading ? '–' : value}</p>
        <p className="mt-1 text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { stats, loading } = useRecruitment();

  return (
    <>
      <PageHeader title="Dashboard" description="Resumen general del módulo de reclutamiento." />

      <section aria-label="Indicadores" className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} value={stats.total} label="Candidatos registrados" loading={loading} />
        <StatCard icon={Clock} value={stats.inProcess} label="En proceso" loading={loading} />
        <StatCard icon={UserCheck} value={stats.available} label="Disponibles" loading={loading} />
        <StatCard icon={BriefcaseBusiness} value={stats.hired} label="Contratados" loading={loading} />
      </section>

      <PageHeader title="Accesos del módulo" description="Entra directamente a cada pantalla de Reclutamiento." />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MODULE_LINKS.map(({ to, icon: Icon, title, text }) => (
          <Link
            key={to}
            to={to}
            className="card group p-5 transition hover:-translate-y-0.5 hover:border-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            <Icon size={22} className="mb-4 text-brand" aria-hidden="true" />
            <h3 className="font-semibold text-ink">{title}</h3>
            <p className="mt-1 text-sm text-muted">{text}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
