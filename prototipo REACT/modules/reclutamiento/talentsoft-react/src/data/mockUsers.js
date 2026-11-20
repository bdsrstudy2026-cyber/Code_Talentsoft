/* =========================================================
   USUARIOS DE PRUEBA (MOCK)
   ⚠️ SOLO PARA DEMO / DESARROLLO. En producción las contraseñas
   nunca viajan ni se guardan en el frontend: la validación la hará
   el backend y devolverá un token (JWT).

   Los 4 primeros salen del prototipo HTML (login.js / datos-empleados.js);
   su rol se mapeó a la nueva nomenclatura:
     Administrador → Administrador
     Entrevistador → Reclutador
     Jefe          → Jefe de Planta
     Empleado      → Operario
   El Supervisor es una cuenta nueva para poder probar los 5 roles.
   Contraseña de todas: Talentsoft2026
   ========================================================= */
import { ROLES } from '../config/roles';

export const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@talentsoft.com',
    password: 'Talentsoft2026',
    name: 'Laura Martínez',
    role: ROLES.ADMIN,
    position: 'Administradora del sistema',
    area: 'Dirección',
    phone: '+57 300 111 2233',
    location: 'Bogotá, Colombia',
    experience: '6 años',
    skills: ['Gestión de talento humano', 'Nómina y prestaciones', 'Análisis de indicadores'],
    about:
      'Administradora del sistema con 6 años de experiencia en gestión de talento humano. Responsable de la configuración de roles, la nómina y el seguimiento general del personal.',
  },
  {
    id: 2,
    email: 'entrevistador@talentsoft.com',
    password: 'Talentsoft2026',
    name: 'Sofía Pardo',
    role: ROLES.RECRUITER,
    position: 'Encargada de selección de personal',
    area: 'Talento Humano',
    phone: '+57 301 555 6677',
    location: 'Soacha, Cundinamarca',
    experience: '4 años',
    skills: ['Entrevistas por competencias', 'Reclutamiento', 'Redacción de perfiles'],
    about:
      'Encargada de selección de personal con 4 años de experiencia en reclutamiento para el sector textil. Responsable de la gestión de candidatos y del proceso de entrevistas.',
  },
  {
    id: 3,
    email: 'jefe@talentsoft.com',
    password: 'Talentsoft2026',
    name: 'Andrés Ramírez',
    role: ROLES.PLANT_MANAGER,
    position: 'Jefe de planta',
    area: 'Producción',
    phone: '+57 310 222 3344',
    location: 'Bogotá, Colombia',
    experience: '7 años',
    skills: ['Liderazgo de equipos', 'Planeación de producción', 'Control de indicadores'],
    about:
      'Jefe de planta con 7 años de experiencia liderando equipos de producción textil. Responsable del seguimiento de metas, indicadores de eficiencia y aprobación de solicitudes de su equipo.',
  },
  {
    id: 4,
    email: 'supervisor@talentsoft.com',
    password: 'Talentsoft2026',
    name: 'Marcela Ortiz', // cuenta de ejemplo creada para la demo
    role: ROLES.SUPERVISOR,
    position: 'Supervisora de línea de confección',
    area: 'Confección',
    phone: '+57 312 888 9900',
    location: 'Bogotá, Colombia',
    experience: '5 años',
    skills: ['Supervisión de líneas', 'Control de calidad', 'Seguimiento de asistencia'],
    about:
      'Supervisora de línea con 5 años de experiencia en confección. Coordina a los operarios del turno, valida la asistencia y reporta novedades al jefe de planta.',
  },
  {
    id: 5,
    email: 'empleado@talentsoft.com',
    password: 'Talentsoft2026',
    name: 'Camila Torres',
    role: ROLES.OPERATOR,
    position: 'Operaria de confección',
    area: 'Confección',
    phone: '+57 315 444 5566',
    location: 'Bogotá, Colombia',
    experience: '3 años',
    skills: ['Máquina plana', 'Fileteadora', 'Control de calidad'],
    about:
      'Operaria con 3 años de experiencia en confección textil, especializada en máquina plana y fileteadora. Cumplida con las cuotas de producción y atenta al detalle en los acabados.',
  },
];
