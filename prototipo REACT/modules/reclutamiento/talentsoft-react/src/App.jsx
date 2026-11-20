/* =========================================================
   App — mapa de rutas con protección por sesión y por permiso.

   Estructura:
     /login                        pública
     (RequireAuth)                 exige sesión
       (AppLayout)                 Navbar + contenido
         (RequirePermission)       exige el permiso del rol
           /, /usuario, /asistencia, /reportes, /reclutamiento/*, ...

   Para proteger una pantalla nueva: crea una <Route element={<RequirePermission
   permission={...} />}> y mete dentro su <Route>.
   ========================================================= */
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { RequireAuth, RequirePermission } from './components/routing/RouteGuards';
import RecruitmentLayout from './components/recruitment/RecruitmentLayout';
import { PERMISSIONS as P } from './config/roles';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Usuario from './pages/Usuario';
import ModulePlaceholder from './pages/ModulePlaceholder';
import NotFound from './pages/NotFound';
import Vacantes from './pages/recruitment/Vacantes';
import Pipeline from './pages/recruitment/Pipeline';
import BancoCandidatos from './pages/recruitment/BancoCandidatos';
import EvaluacionTecnica from './pages/recruitment/EvaluacionTecnica';
import HistorialProceso from './pages/recruitment/HistorialProceso';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          {/* Dashboard: quien no tenga permiso (p. ej. Operario) es enviado a su pantalla inicial */}
          <Route element={<RequirePermission permission={P.DASHBOARD_VIEW} redirectToHome />}>
            <Route index element={<Dashboard />} />
          </Route>

          <Route element={<RequirePermission permission={P.PROFILE_VIEW} />}>
            <Route path="usuario" element={<Usuario />} />
          </Route>

          <Route element={<RequirePermission permission={P.ATTENDANCE_VIEW} />}>
            <Route
              path="asistencia"
              element={<ModulePlaceholder title="Asistencia" description="Registro de entradas y salidas del personal." />}
            />
          </Route>

          <Route element={<RequirePermission permission={P.REPORTS_VIEW} />}>
            <Route
              path="reportes"
              element={<ModulePlaceholder title="Reportes e Indicadores Estadísticos" description="Análisis de gestión humana." />}
            />
          </Route>

          <Route element={<RequirePermission permission={P.EVENTS_VIEW} />}>
            <Route
              path="eventos"
              element={<ModulePlaceholder title="Eventos" description="Calendario de eventos institucionales." />}
            />
          </Route>

          <Route element={<RequirePermission permission={P.SETTINGS_MANAGE} />}>
            <Route
              path="configuracion"
              element={<ModulePlaceholder title="Configuración" description="Usuarios, roles y parámetros del sistema." />}
            />
          </Route>

          {/* Módulo de Reclutamiento */}
          <Route element={<RequirePermission permission={P.RECRUITMENT_VIEW} />}>
            <Route path="reclutamiento" element={<RecruitmentLayout />}>
              <Route index element={<Vacantes />} />
              <Route path="pipeline/:vacanteId?" element={<Pipeline />} />
              <Route path="banco" element={<BancoCandidatos />} />
              <Route path="evaluacion/:candidatoId?" element={<EvaluacionTecnica />} />
              <Route path="historial/:candidatoId?" element={<HistorialProceso />} />
              <Route path="*" element={<Navigate to="/reclutamiento" replace />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
