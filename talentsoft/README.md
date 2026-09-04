# Talentsoft

Sistema web de gestión de talento humano enfocado en reclutamiento, asistencia y bienestar del personal. Interfaz 100% en español, con modo claro/oscuro y una única paleta visual (naranja `#ff5722` sobre panel slate oscuro) compartida por todos los módulos.

## Integrantes

- Brayan Dario Sierra Ramirez
- David Steven Castro Garavito
- Santiago Peña Bermudez
- Danier Felipe Herrera

## Tecnologías

Proyecto **frontend estático**: HTML, CSS y JavaScript puro (sin frameworks ni backend). Los datos de cada módulo se guardan en el `localStorage` / `sessionStorage` del navegador, así que sirve como prototipo funcional completo sin necesidad de servidor ni base de datos.

- [Boxicons](https://boxicons.com/) para los íconos.
- Fuente [Poppins](https://fonts.google.com/specimen/Poppins) vía Google Fonts.

## Cómo ejecutarlo

No requiere instalación. Basta con abrir `login/login.html` en el navegador (doble clic, o "Abrir con..." tu navegador).

> Si el navegador bloquea la carga del video de fondo o de las fuentes por abrir el archivo directamente (`file://`), sirve la carpeta con cualquier servidor estático, por ejemplo:
> ```bash
> npx serve .
> # o
> python3 -m http.server
> ```

### Cuentas de demostración

El login valida contra estas cuentas (ver `login/login.js`):

| Correo | Contraseña | Rol |
|---|---|---|
| admin@talentsoft.com | Talentsoft2026 | Administrador |
| jefe@talentsoft.com | Talentsoft2026 | Jefe |
| empleado@talentsoft.com | Talentsoft2026 | Empleado |
| entrevistador@talentsoft.com | Talentsoft2026 | Entrevistador |

El rol elegido cambia el comportamiento de algunos módulos (por ejemplo, Incentivos y Salud Ocupacional abren directo la vista de administración si el rol es **Administrador**).

## Estructura del proyecto

```
talentsoft/
├── login/                      Inicio de sesión (puerta de entrada al sistema)
│   ├── login.html / .css / .js
│   ├── logo.png
│   └── teclado.mp4             Video de fondo
│
├── index.html                  Dashboard: estadísticas rápidas + accesos a cada módulo
│
├── Gestion_Vacantes.html        ┐
├── Pipeline.html                 │ Módulo de Reclutamiento
├── Banco_Candidatos.html         │ (comparten el mismo dataset de candidatos,
├── evaluacion_tecnica.html       │  definido en js/script.js)
├── Historial_de_Procesos.html   ┘
│
├── asistencia/                 Marcación, permisos, vacaciones, horas extra
├── calendario/                 Eventos y actividades programadas
├── configuracion/              Roles y permisos por empleado
├── usuario/                    Perfil de quien inició sesión
│   ├── incentivos/             Reconocimientos y su confirmación
│   ├── capacitacion/           Videos, documentos, sesiones en vivo, evaluación
│   └── salud/                  Materiales de salud ocupacional
│
├── css/style.css                Paleta y estilos compartidos (sidebar, botones, badges…)
├── js/script.js                 Sidebar, sesión, y datos/lógica de Reclutamiento
└── img/                          Fondos del sistema (wall.jpg / wall-light.jpg)
```

Cada módulo trae su propio `.css`/`.js` para lo que le es específico, pero **todos** cargan primero `css/style.css` y `js/script.js`, que son los que definen la paleta, el sidebar y la sesión.

## Módulos

| Módulo | Qué hace |
|---|---|
| **Login** | Valida el acceso, guarda la sesión (`localStorage` si "Recuérdame" está marcado, `sessionStorage` si no) y redirige a Asistencia. |
| **Dashboard** | Estadísticas generales y accesos directos a cada módulo. |
| **Gestión de Vacantes** | Crear vacantes, buscar/filtrar, ver su pipeline. |
| **Pipeline** | Tablero kanban con arrastrar y soltar entre etapas del proceso de selección. |
| **Banco de Candidatos** | Tabla de candidatos con búsqueda, filtros y exportación a CSV. |
| **Evaluación Técnica** | Resultados de pruebas prácticas por candidato. |
| **Historial de Procesos** | Línea de tiempo del proceso de un candidato. |
| **Asistencia** | Marcación de entrada/salida con reloj en vivo, permisos, vacaciones, horas extra y alertas de contrato. |
| **Calendario** | Crear y consultar eventos por día/mes, dirigidos a un rol específico o a todos. |
| **Usuario** | Perfil de quien inició sesión y accesos a los módulos de bienestar. |
| **Incentivos** | Administración crea reconocimientos; el trabajador los confirma con mensaje y firma. |
| **Capacitación** | Videos, documentos, sesiones en vivo y evaluaciones de capacitación. |
| **Salud Ocupacional** | Publicación de materiales (PDF) dirigidos a uno o varios roles. |
| **Configuración** | Roles y permisos por empleado (Administrador, Jefe, Empleado, Entrevistador). |

### Pendientes

Los ítems **Reportes**, **Control asistencia**, **Nómina** y **Horas trabajadas** del sidebar todavía no tienen módulo propio — quedan marcados como "Próximamente" en la interfaz.

## Sesión y navegación

- Todas las páginas (excepto el login) verifican al cargar si hay sesión activa; si no la hay, redirigen automáticamente a `login/login.html`.
- El botón **Cerrar sesión** del sidebar limpia la sesión guardada y vuelve al login.
- El ítem activo del sidebar se resalta solo, según la página en la que estés (atributo `data-page` en cada `<body>`).
