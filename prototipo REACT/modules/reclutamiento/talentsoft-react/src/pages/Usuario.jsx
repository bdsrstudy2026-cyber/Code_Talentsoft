/* =========================================================
   Usuario — perfil de la persona que inició sesión
   (datos tomados del AuthContext).
   ========================================================= */
import { Briefcase, Mail, MapPin, Phone } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { useAuth } from '../contexts/AuthContext';

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-line bg-panel-alt p-4">
      <Icon size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="break-words text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}

export default function Usuario() {
  const { user } = useAuth();
  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('');

  return (
    <>
      <PageHeader title="Mi perfil" description="Información de tu cuenta en Talentsoft." />

      <div className="card p-6">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-xl font-bold text-white"
          >
            {initials}
          </span>
          <div>
            <h2 className="text-xl font-bold text-ink">{user.name}</h2>
            <p className="text-sm text-muted">{user.position}</p>
            <span className="mt-1.5 inline-block rounded-full bg-brand/15 px-2.5 py-0.5 text-xs font-medium text-brand">
              {user.role}
            </span>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <InfoItem icon={Mail} label="Correo" value={user.email} />
          <InfoItem icon={Phone} label="Teléfono" value={user.phone} />
          <InfoItem icon={MapPin} label="Ubicación" value={user.location} />
          <InfoItem icon={Briefcase} label="Área · Experiencia" value={`${user.area} · ${user.experience}`} />
        </div>

        <h3 className="mb-2 font-semibold text-ink">Perfil profesional</h3>
        <p className="mb-5 text-sm leading-relaxed text-muted">{user.about}</p>

        <h3 className="mb-2 font-semibold text-ink">Habilidades</h3>
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill) => (
            <span key={skill} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
