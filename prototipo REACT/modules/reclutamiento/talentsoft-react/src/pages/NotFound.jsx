import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        <SearchX size={48} className="mx-auto mb-4 text-brand" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-ink">Página no encontrada</h1>
        <p className="mb-6 mt-2 text-sm text-muted">La dirección que buscas no existe o fue movida.</p>
        <Link to="/" className="btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
