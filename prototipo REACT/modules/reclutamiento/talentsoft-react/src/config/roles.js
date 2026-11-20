/* =========================================================
   ROLES Y PERMISOS
   Fuente única del control de acceso (RBAC). Para dar o quitar
   acceso a un rol solo hay que editar ROLE_PERMISSIONS.
   ========================================================= */

/** Roles del sistema (el valor es el texto que se muestra en pantalla). */
export const ROLES = {
  ADMIN: 'Administrador',
  RECRUITER: 'Reclutador',
  PLANT_MANAGER: 'Jefe de Planta',
  SUPERVISOR: 'Supervisor',
  OPERATOR: 'Operario',
};

/** Permisos disponibles. Convención "<módulo>:<acción>". */
export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard:view',
  PROFILE_VIEW: 'profile:view',
  ATTENDANCE_VIEW: 'attendance:view',
  REPORTS_VIEW: 'reports:view',
  RECRUITMENT_VIEW: 'recruitment:view', // ver vacantes, pipeline, banco, evaluaciones
  RECRUITMENT_MANAGE: 'recruitment:manage', // crear vacantes, mover/contratar/descartar
  EVENTS_VIEW: 'events:view',
  SETTINGS_MANAGE: 'settings:manage',
};

const P = PERMISSIONS;

/** Qué puede hacer cada rol. */
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(P), // acceso total

  [ROLES.RECRUITER]: [
    P.DASHBOARD_VIEW,
    P.PROFILE_VIEW,
    P.RECRUITMENT_VIEW,
    P.RECRUITMENT_MANAGE,
    P.EVENTS_VIEW,
  ],

  // El Jefe de Planta consulta el proceso de selección pero no lo modifica.
  [ROLES.PLANT_MANAGER]: [
    P.DASHBOARD_VIEW,
    P.PROFILE_VIEW,
    P.ATTENDANCE_VIEW,
    P.REPORTS_VIEW,
    P.RECRUITMENT_VIEW,
    P.EVENTS_VIEW,
  ],

  [ROLES.SUPERVISOR]: [P.PROFILE_VIEW, P.ATTENDANCE_VIEW, P.REPORTS_VIEW, P.EVENTS_VIEW],

  [ROLES.OPERATOR]: [P.PROFILE_VIEW, P.ATTENDANCE_VIEW, P.EVENTS_VIEW],
};

/** Pantalla a la que llega cada rol después de iniciar sesión. */
export const ROLE_HOME = {
  [ROLES.ADMIN]: '/',
  [ROLES.RECRUITER]: '/',
  [ROLES.PLANT_MANAGER]: '/',
  [ROLES.SUPERVISOR]: '/asistencia',
  [ROLES.OPERATOR]: '/asistencia',
};
