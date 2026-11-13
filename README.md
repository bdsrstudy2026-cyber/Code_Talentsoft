# TalentSoft 👔✨

Sistema web de gestión de talento humano enfocado en reclutamiento, asistencia y bienestar del personal. Interfaz 100% en español, con modo claro/oscuro y una única paleta visual (naranja `#ff5722` sobre panel slate oscuro) compartida por todos los módulos.

Proyecto académico del SENA (programa ADSO), desarrollado para **Dimon's Style**, una microempresa del sector confección, con el fin de digitalizar su gestión administrativa y de talento humano.

---

## 👥 Equipo de Desarrollo

* **Brayan Dario Sierra Ramirez** — *Líder de Integración y Desarrollo*
* **David Steven Castro Garavito** — *Desarrollador de Software*
* **Danier Felipe Herrera** — *Desarrollador de Software*
* **Santiago Peña Bermúdez** — *Desarrollador de Software*

---

## 🏗️ Arquitectura del Repositorio

El repositorio está dividido en tres entornos principales para separar la maquetación base, la migración hacia el frontend moderno y el modelo de base de datos:

```text
Code_Talentsoft/
├── prototipo HTML/             # [CONGELADO] Maquetación funcional completa (HTML5, CSS3, JS Vanilla + Backend POO)
│   ├── login/                  # Inicio de sesión (puerta de entrada al sistema)
│   ├── index.html              # Dashboard principal con métricas rápidas
│   ├── Gestion_Vacantes.html   # Módulo de Reclutamiento y Selección
│   ├── Pipeline.html           # Tablero Kanban interactivo
│   ├── Banco_Candidatos.html   # Directorio y exportación CSV
│   ├── evaluacion_tecnica.html # Pruebas prácticas
│   ├── Historial_de_Procesos.html
│   ├── asistencia/             # Reloj de marcación en vivo, permisos, vacaciones y alertas
│   ├── calendario/             # Agenda de eventos por rol
│   ├── reportes/               # Indicadores estadísticos y exportación legal
│   ├── configuracion/          # Gestión de usuarios, roles y permisos
│   ├── usuario/                # Perfil, incentivos, capacitación y salud ocupacional
│   ├── css/                    # Estilos globales y variables de tema
│   ├── js/                     # Lógica de sesión, sidebar y datasets
│   ├── img/                    # Recursos visuales y fondos
│   └── Backend/                # Esqueleto en Python (entidades y repositorios POO)
│
├── prototipo REACT/            # [PRÓXIMA FASE] Desarrollo del frontend definitivo en React
│
└── sql/                        # Scripts de creación, relaciones y datos iniciales de la BD
    └── talentsoftV.sql
```

---

## 🛠️ Tecnologías

* **Prototipo Base (`prototipo HTML/`):** HTML5, CSS3 y JavaScript puro (sin frameworks). Los datos de prueba persisten en `localStorage` y `sessionStorage` para operar sin servidor. Incluye librería [Boxicons](https://boxicons.com/) y tipografía [Poppins](https://fonts.google.com/specimen/Poppins).
* **Frontend Definitivo (`prototipo REACT/`):** React (en fase de inicialización).
* **Backend & Base de Datos (`Backend/` y `sql/`):** Arquitectura orientada a objetos en Python y motor relacional SQL (`talentsoftV.sql`).

---

## 🚀 Cómo ejecutar el Prototipo HTML

Este prototipo representa la versión visual aprobada y **no requiere instalación**.

1. Entra a la carpeta `prototipo HTML/login/`.
2. Abre el archivo **`login.html`** con doble clic en tu navegador.

> **Nota:** Si el navegador bloquea el video de fondo o las fuentes por políticas locales (`file://`), levanta un servidor estático dentro de la carpeta `prototipo HTML/`:
> ```bash
> npx serve .
> # o con Python:
> python -m http.server
> ```

### 🔑 Cuentas de Demostración

El login valida contra los siguientes perfiles configurados en `prototipo HTML/login/login.js`:

| Correo | Contraseña | Rol | Permisos / Vista |
| :--- | :--- | :--- | :--- |
| `admin@talentsoft.com` | `Talentsoft2026` | **Administrador** | Acceso total, alertas globales y gestión de incentivos/salud. |
| `jefe@talentsoft.com` | `Talentsoft2026` | **Jefe** | Supervisión de equipo y alertas de contratos. |
| `empleado@talentsoft.com` | `Talentsoft2026` | **Empleado** | Marcación de asistencia, perfil y consultas personales. |
| `entrevistador@talentsoft.com` | `Talentsoft2026` | **Entrevistador** | Gestión de vacantes, pipeline y evaluación técnica. |

---

## 📦 Módulos Implementados

| Módulo | Descripción funcional |
| :--- | :--- |
| **Login y Sesión** | Autenticación por rol (`localStorage` / `sessionStorage`) y protección de rutas mediante verificación de sesión activa. |
| **Dashboard** | Resumen de estadísticas generales y accesos directos a los módulos operativos. |
| **Reclutamiento** | Creación de vacantes, tablero Kanban (*Pipeline*) con arrastrar y soltar, banco de candidatos con exportación CSV, evaluación técnica e historial. |
| **Asistencia** | Reloj en tiempo real (descuenta breaks), reinicio diario automático, solicitud de permisos/vacaciones con descuento de días, horas extra y alertas de contrato. |
| **Calendario** | Programación y filtrado de eventos por fecha y rol. |
| **Reportes** | Gráficas de ausentismo, productividad y retardos filtrables por mes/taller, con exportación CSV y respaldo normativo. |
| **Bienestar (Usuario)** | Perfil personal, confirmación con firma digital de incentivos, material de capacitación y guías de salud ocupacional. |
| **Configuración** | Registro de empleados y asignación dinámica de roles y permisos. |

---

## 📌 Estado y Próximos Pasos

* ✅ **Prototipo HTML/CSS/JS:** Finalizado y congelado como referencia visual y funcional.
* 🔄 **Base de Datos (`sql/`):** Esquema relacional estructurado (`talentsoftV.sql`) listo para integración.
* ⏳ **Migración a React (`prototipo REACT/`):** Trasladar la interfaz hacia componentes modulares en React y conectar la API del backend.