/* Pantalla "Acceso denegado": el rol no tiene el permiso requerido. */
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_HOME } from '../config/roles';

export default function Forbidden() {
  const { user } = useAuth();

  return (
    <div className="mx-auto mt-16 max-w-md text-center">
      <ShieldAlert size={48} className="mx-auto mb-4 text-brand" aria-hidden="true" />
      <h1 className="text-2xl font-bold text-ink">Acceso denegado</h1>
      <p className="mb-6 mt-2 text-sm text-muted">
        Tu rol{user ? ` (${user.role})` : ''} no tiene permiso para ver esta sección. Si crees que es un
        error, comunícate con el administrador del sistema.
      </p>
      <Link to={ROLE_HOME[user?.role] ?? '/'} className="btn-primary">
        Ir a mi pantalla de inicio
      </Link>
    </div>
  );
}
