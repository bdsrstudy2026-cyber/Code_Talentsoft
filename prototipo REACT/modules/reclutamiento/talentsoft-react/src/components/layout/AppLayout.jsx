/* =========================================================
   AppLayout — estructura común de todas las pantallas autenticadas:
   Navbar (lateral en escritorio / superior en móvil) + contenido.
   Aquí se monta RecruitmentProvider para que los datos de
   Reclutamiento solo se carguen cuando hay sesión iniciada.
   ========================================================= */
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { RecruitmentProvider } from '../../contexts/RecruitmentContext';

export default function AppLayout() {
  return (
    <RecruitmentProvider>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Navbar />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </RecruitmentProvider>
  );
}
