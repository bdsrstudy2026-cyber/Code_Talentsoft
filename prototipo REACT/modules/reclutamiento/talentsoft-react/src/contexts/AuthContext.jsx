/* =========================================================
   AuthContext — sesión y control de acceso por roles (RBAC)

   Uso:
     const { user, login, logout, can, hasRole } = useAuth();
     can(PERMISSIONS.RECRUITMENT_MANAGE)   // → true / false
     hasRole(ROLES.ADMIN, ROLES.RECRUITER) // → true / false

   Sesión:
     - El usuario vive en memoria (useState) y se valida contra MOCK_USERS.
     - Para que un F5 no cierre la sesión durante el desarrollo se guarda
       SOLO el id del usuario (nunca la contraseña):
         · "Recuérdame" activo → localStorage  (sobrevive al cerrar el navegador)
         · "Recuérdame" apagado → sessionStorage (dura la pestaña)
       Cuando exista backend, esto se reemplaza por un token.
   ========================================================= */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { MOCK_USERS } from '../data/mockUsers';
import { ROLE_PERMISSIONS } from '../config/roles';

const AuthContext = createContext(null);
const SESSION_KEY = 'ts-session-user';

/* --- Helpers de almacenamiento (el acceso puede fallar en modo privado) --- */
function readStoredUserId() {
  for (const store of [window.localStorage, window.sessionStorage]) {
    try {
      const value = store.getItem(SESSION_KEY);
      if (value) return Number(value);
    } catch {
      /* almacenamiento bloqueado: se ignora */
    }
  }
  return null;
}

function clearStoredSession() {
  for (const store of [window.localStorage, window.sessionStorage]) {
    try {
      store.removeItem(SESSION_KEY);
    } catch {
      /* se ignora */
    }
  }
}

/** Quita la contraseña antes de guardar el usuario en el estado. */
function toPublicUser(user) {
  // eslint-disable-next-line no-unused-vars
  const { password, ...publicUser } = user;
  return publicUser;
}

export function AuthProvider({ children }) {
  // Restaura la sesión de forma síncrona para evitar un "flash" del login.
  const [user, setUser] = useState(() => {
    const storedId = readStoredUserId();
    const found = MOCK_USERS.find((u) => u.id === storedId);
    return found ? toPublicUser(found) : null;
  });

  /** Simula una petición al servidor (500 ms). Devuelve { ok, user?, error? }. */
  const login = useCallback(async ({ email, password, remember = false }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const found = MOCK_USERS.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password,
    );
    if (!found) return { ok: false, error: 'Correo o contraseña incorrectos.' };

    const publicUser = toPublicUser(found);
    setUser(publicUser);

    try {
      clearStoredSession();
      (remember ? window.localStorage : window.sessionStorage).setItem(SESSION_KEY, String(found.id));
    } catch {
      /* la sesión queda solo en memoria */
    }
    return { ok: true, user: publicUser };
  }, []);

  const logout = useCallback(() => {
    clearStoredSession();
    setUser(null);
  }, []);

  /** ¿El rol del usuario actual incluye este permiso? */
  const can = useCallback(
    (permission) => !!user && (ROLE_PERMISSIONS[user.role] ?? []).includes(permission),
    [user],
  );

  /** ¿El usuario actual tiene alguno de estos roles? */
  const hasRole = useCallback((...roles) => !!user && roles.includes(user.role), [user]);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout, can, hasRole }),
    [user, login, logout, can, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  return ctx;
}
