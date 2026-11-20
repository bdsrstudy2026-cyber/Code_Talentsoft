/* Marcador de posición para módulos que aún no se migran a React. */
import { Construction } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';

export default function ModulePlaceholder({ title, description }) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
        <Construction size={36} className="text-brand" aria-hidden="true" />
        <p className="font-medium text-ink">Este módulo aún no se ha migrado a React.</p>
        <p className="max-w-md text-sm text-muted">
          La ruta y el control de acceso por rol ya están listos: solo falta reemplazar este componente por
          la vista real.
        </p>
      </div>
    </>
  );
}
