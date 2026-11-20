# Talentsoft · Módulo de Reclutamiento (React)

Migración del prototipo HTML a **React 18 + Vite + Tailwind CSS 3 + React Router 6**.

## Arrancar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera /dist
```

## Cuentas de prueba (contraseña: `Talentsoft2026`)

| Rol            | Correo                         | Llega a        | Menú que ve                                         |
|----------------|--------------------------------|----------------|-----------------------------------------------------|
| Administrador  | admin@talentsoft.com           | Dashboard      | Todo                                                |
| Reclutador     | entrevistador@talentsoft.com   | Dashboard      | Dashboard, Usuario, Reclutamiento (editar), Eventos |
| Jefe de Planta | jefe@talentsoft.com            | Dashboard      | Todo menos Configuración; Reclutamiento solo lectura|
| Supervisor     | supervisor@talentsoft.com      | Asistencia     | Usuario, Asistencia, Reportes, Eventos              |
| Operario       | empleado@talentsoft.com        | Asistencia     | Usuario, Asistencia, Eventos                        |

## Estructura

```
src/
├─ config/roles.js              Roles, permisos y matriz ROLE_PERMISSIONS  ← editar aquí el acceso
├─ data/
│  ├─ mockUsers.js              Usuarios de prueba
│  └─ mockRecruitment.js        Candidatos, vacantes, etapas, línea de tiempo
├─ services/mockApi.js          "Backend" en memoria (latencia simulada)
├─ contexts/
│  ├─ AuthContext.jsx           login / logout / can() / hasRole()
│  ├─ ThemeContext.jsx          modo oscuro / claro
│  ├─ RecruitmentContext.jsx    estado compartido del módulo
│  └─ ToastContext.jsx          avisos
├─ components/
│  ├─ layout/ Navbar.jsx · AppLayout.jsx · PageHeader.jsx
│  ├─ routing/RouteGuards.jsx   RequireAuth · RequirePermission
│  ├─ recruitment/              RecruitmentLayout · StatusBadge · CandidateAvatar · NewVacancyModal
│  └─ ui/Modal.jsx
└─ pages/
   ├─ Login.jsx · Dashboard.jsx · Usuario.jsx · Forbidden.jsx · NotFound.jsx
   ├─ ModulePlaceholder.jsx     Asistencia / Reportes / Eventos / Configuración (pendientes)
   └─ recruitment/ Vacantes · Pipeline · BancoCandidatos · EvaluacionTecnica · HistorialProceso
```

## Rutas

| Ruta                                   | Permiso requerido      |
|----------------------------------------|------------------------|
| `/login`                               | pública                |
| `/`                                    | dashboard:view         |
| `/usuario`                             | profile:view           |
| `/asistencia`, `/reportes`, `/eventos` | attendance / reports / events |
| `/configuracion`                       | settings:manage        |
| `/reclutamiento`                       | recruitment:view       |
| `/reclutamiento/pipeline/:vacanteId?`  | recruitment:view (mover = recruitment:manage) |
| `/reclutamiento/banco`                 | recruitment:view       |
| `/reclutamiento/evaluacion/:candidatoId?` | recruitment:view (contratar/descartar = manage) |
| `/reclutamiento/historial/:candidatoId?`  | recruitment:view       |

## Notas

- **Datos en memoria:** se reinician al recargar la página (F5). La sesión sí se conserva (solo el id de usuario, en
  sessionStorage o localStorage con "Recuérdame").
- **Pasar a backend real:** reemplaza el cuerpo de `services/mockApi.js` y `AuthContext.login` por llamadas HTTP; el
  resto de la app no cambia.
- **Seguridad:** el control de acceso del frontend solo oculta/bloquea pantallas. La validación real de permisos debe
  repetirse en el backend.
- **Tema:** los colores salen de variables CSS (`src/index.css`) mapeadas a tokens Tailwind (`bg-panel`, `text-muted`,
  `border-line`, `bg-brand`…), por eso los componentes no necesitan clases `dark:`.
