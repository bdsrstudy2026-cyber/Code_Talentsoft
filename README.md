# Talentsoft

Sistema web de gestión de talento humano enfocado en reclutamiento, asistencia y bienestar del personal. Interfaz 100% en español, con modo claro/oscuro y una única paleta visual (naranja `#ff5722` sobre panel slate oscuro) compartida por todos los módulos.

Proyecto académico del SENA (programa ADSO), desarrollado para **Dimon's Style**, una microempresa del sector confección, con el fin de digitalizar su gestión administrativa y de talento humano.

## Integrantes

- Brayan Dario Sierra Ramirez
- David Steven Castro Garavito
- Santiago Peña Bermudez
- Danier Felipe Herrera

## Tecnologías

**Frontend**: HTML, CSS y JavaScript puro (sin frameworks). Los datos de cada módulo se guardan en el `localStorage` / `sessionStorage` del navegador, así que el sistema funciona de punta a punta sin necesidad de servidor ni base de datos.

- [Boxicons](https://boxicons.com/) para los íconos.
- Fuente [Poppins](https://fonts.google.com/specimen/Poppins) vía Google Fonts.

**Backend** (`Backend/`): esqueleto en Python con las entidades de dominio del sistema (Empleado, Asistencia, Permiso, Vacaciones, Reclutamiento, Capacitación, Bienestar, etc.) y una capa de repositorios, siguiendo el diagrama de clases del proyecto. Todavía no está conectado al frontend — es la base para cuando se implemente la persistencia real en una fase posterior.

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

El rol elegido cambia el comportamiento de varios módulos:
- **Asistencia**: las alertas de contrato próximo a vencer se filtran — Administrador/Jefe ven las de todo el equipo, Empleado/Entrevistador solo ven la suya (si aplica).
- **Incentivos** y **Salud Ocupacional**: abren directo la vista de administración si el rol es Administrador.

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
├── asistencia/                 Marcación en vivo, permisos, vacaciones, horas extra, alertas
├── calendario/                 Eventos y actividades programadas
├── reportes/                   Indicadores estadísticos y exportación de documentos legales
├── configuracion/              Roles y permisos por empleado
├── usuario/                    Perfil de quien inició sesión
│   ├── incentivos/             Reconocimientos y su confirmación
│   ├── capacitacion/           Videos, documentos, sesiones en vivo, evaluación
│   └── salud/                  Materiales de salud ocupacional
│
├── css/style.css                Paleta y estilos compartidos (sidebar, botones, badges…)
├── js/script.js                 Sidebar, sesión, y datos/lógica de Reclutamiento
├── js/datos-empleados.js        Fuente única de empleados (Usuario ↔ Configuración)
├── img/                          Fondos del sistema (wall.jpg / wall-light.jpg)
│
└── Backend/                     Esqueleto en Python (entidades de dominio, repositorios).
                                  No conectado al frontend todavía.
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
| **Asistencia** | Reloj de marcación con horas trabajadas calculadas en tiempo real (descuenta breaks/reuniones), turno que se reinicia solo cada día, permisos, vacaciones con validación de fechas y descuento real de días disponibles, horas extra, y alertas de contrato personalizadas según el rol de quien inició sesión. |
| **Calendario** | Crear y consultar eventos por día/mes, dirigidos a un rol específico o a todos. |
| **Reportes** | Indicadores de ausentismo, productividad y horas de retardo (gráficas con datos de ejemplo), filtrables por mes y taller, más exportación de documentos (CSV) y nota legal de cumplimiento normativo. |
| **Usuario** | Perfil de quien inició sesión, accesos a los módulos de bienestar, y vista de detalle de cualquier empleado (llegando desde "Ver perfil" en Configuración). |
| **Incentivos** | Administración crea reconocimientos; el trabajador los confirma con mensaje y firma. |
| **Capacitación** | Videos, documentos, sesiones en vivo y evaluaciones de capacitación. |
| **Salud Ocupacional** | Publicación de materiales (PDF) dirigidos a uno o varios roles. |
| **Configuración** | Registro de empleados, y asignación de rol y permisos por empleado (Administrador, Jefe, Empleado, Entrevistador), con confirmación antes de aplicar el cambio. |

### Pendientes

- Conectar el `Backend/` en Python (hoy es un esqueleto de entidades y repositorios, sin persistencia real ni API).
- Los ítems **Control asistencia**, **Nómina** y **Horas trabajadas** se retiraron del sidebar: no están dentro del alcance actual del proyecto (Nómina requiere apoyo contable que no se tiene, y Horas trabajadas quedó cubierto dentro de Asistencia y Reportes).
- El ítem **Reportes** usa datos de ejemplo (no vienen de Asistencia ni de una base de datos real todavía).

## Sesión y navegación

- Todas las páginas (excepto el login) verifican al cargar si hay sesión activa; si no la hay, redirigen automáticamente a `login/login.html`.
- El botón **Cerrar sesión** del sidebar limpia la sesión guardada y vuelve al login.
- El ítem activo del sidebar se resalta solo, según la página en la que estés (atributo `data-page` en cada `<body>`).
