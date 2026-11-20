/* =========================================================
   Guardias de rutas

   <RequireAuth />        → exige sesión iniciada; si no, manda a /login.
   <RequirePermission />  → exige un permiso del rol:
        · sin `redirectToHome` muestra la pantalla "Acceso denegado".
        · con `redirectToHome` redirige a la pantalla inicial del rol
          (se usa en "/" para que un Operario no vea un 403 al entrar).

   Ambos se usan como "layout routes" (ver App.jsx): renderizan <Outlet />
   cuando se cumple la condición.
   ========================================================= */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_HOME } from '../../config/roles';
import Forbidden from '../../pages/Forbidden';

export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export function RequirePermission({ permission, redirectToHome = false }) {
  const { user, can } = useAuth();

  if (can(permission)) return <Outlet />;

  if (redirectToHome) {
    return <Navigate to={ROLE_HOME[user.role] ?? '/usuario'} replace />;
  }
  return <Forbidden />;
}
