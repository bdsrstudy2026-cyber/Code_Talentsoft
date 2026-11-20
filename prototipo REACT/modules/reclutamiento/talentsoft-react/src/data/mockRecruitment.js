/* =========================================================
   DATOS MOCK DEL MÓDULO DE RECLUTAMIENTO
   Migrados desde js/script.js y Gestion_Vacantes.html del prototipo.
   Fuente única: Banco, Pipeline, Evaluación e Historial leen de aquí
   (vía RecruitmentContext) y se enlazan por "id".
   ========================================================= */

/** Áreas de la empresa (clave → nombre visible). */
export const AREAS = {
  confeccion: 'Confección',
  corte: 'Corte y Trazo',
  calidad: 'Control de Calidad',
  mantenimiento: 'Mantenimiento',
};

/** Etapas del pipeline, en orden. */
export const PIPELINE_STAGES = [
  { id: 'nuevos', label: 'Nuevos Postulados' },
  { id: 'evaluacion', label: 'Evaluación Técnica' },
  { id: 'entrevista', label: 'Entrevista' },
  { id: 'contratados', label: 'Contratados', accent: true },
];

/** Estado general del candidato. */
export const CANDIDATE_STATUS_LABEL = {
  proceso: 'En Proceso',
  disponible: 'Disponible',
  contratado: 'Contratado',
};

export const INITIAL_VACANCIES = [
  {
    id: 'vac-plana',
    title: 'Operaria de Máquina Plana',
    area: 'confeccion',
    status: 'activa',
    postedLabel: 'Hace 2 días',
    applicants: 12,
    slots: 3,
  },
  {
    id: 'vac-mecanico',
    title: 'Mecánico de Maquinaria',
    area: 'mantenimiento',
    status: 'activa',
    postedLabel: 'Hace 5 días',
    applicants: 4,
    slots: 1,
  },
  {
    id: 'vac-auditor',
    title: 'Auditor de Calidad',
    area: 'calidad',
    status: 'cerrada',
    postedLabel: 'Hace 15 días',
    applicants: 18,
    slots: 1,
  },
];

/*
 * Campos clave de cada candidato:
 *  - status:        'proceso' | 'disponible' | 'contratado'
 *  - pipelineStage: etapa actual o null si no está en un pipeline
 *  - vacancyId:     vacante a la que aplicó
 *  - match:         % de compatibilidad de la evaluación técnica (null = sin evaluar)
 *  - evalStatus:    'aceptado' | 'rechazado' | 'pendiente' (solo si fue evaluado)
 */
export const INITIAL_CANDIDATES = [
  {
    id: 'ana-torres',
    name: 'Ana Lucia Torres',
    email: 'ana.torres@email.com',
    initials: 'AL',
    avatarBg: '#eef2ff',
    avatarColor: '#4361ee',
    skills: 'Fileteadora, Collarín',
    skillTags: ['Fileteadora', 'Collarín', 'Trabajo en equipo'],
    experience: '2 años',
    status: 'proceso',
    pipelineStage: 'nuevos',
    vacancyId: 'vac-plana',
    appliedAt: '12 de Mayo, 2026 - 09:30 AM',
    phone: '+57 300 111 2233',
    location: 'Bogotá, Colombia',
    availability: '15 días',
    role: 'Operaria de Fileteadora',
    match: null,
    evalStatus: null,
    about:
      'Operaria en formación con 2 años de experiencia en fileteadora y collarín. Buena disposición para el trabajo en equipo y aprendizaje de nuevas técnicas.',
  },
  {
    id: 'roberto-gomez',
    name: 'Roberto Gómez',
    email: 'roberto.g@email.com',
    initials: 'RG',
    avatarBg: '#fef08a',
    avatarColor: '#ca8a04',
    skills: 'Mantenimiento, Mecánica',
    skillTags: ['Mantenimiento industrial', 'Mecánica', 'Soldadura'],
    experience: '5 años',
    status: 'disponible',
    pipelineStage: null,
    vacancyId: 'vac-mecanico',
    appliedAt: '9 de Mayo, 2026 - 11:15 AM',
    phone: '+57 310 222 3344',
    location: 'Soacha, Cundinamarca',
    availability: 'Inmediata',
    role: 'Mecánico de Maquinaria',
    match: null,
    evalStatus: null,
    about:
      'Técnico con 5 años de experiencia en mantenimiento preventivo y correctivo de maquinaria industrial de confección.',
  },
  {
    id: 'carmen-mendoza',
    name: 'Carmen Mendoza',
    email: 'carmen.m@email.com',
    initials: 'CM',
    avatarBg: '#d1fae5',
    avatarColor: '#10b981',
    skills: 'Máquina Plana, Trazado',
    skillTags: ['Máquina Plana', 'Trazado', 'Control de calidad'],
    experience: '8 años',
    status: 'contratado',
    pipelineStage: 'contratados',
    vacancyId: 'vac-plana',
    appliedAt: '5 de Mayo, 2026 - 08:00 AM',
    phone: '+57 320 333 4455',
    location: 'Bogotá, Colombia',
    availability: 'Contratada',
    role: 'Operaria de Máquina Plana',
    match: null,
    evalStatus: null,
    about:
      'Operaria senior con 8 años de experiencia. Referente del equipo en trazado y control de calidad de acabados.',
  },
  {
    id: 'jose-ramirez',
    name: 'Jose Ramirez',
    email: 'jose.ramirez@email.com',
    initials: 'JR',
    avatarBg: '#e0f2fe',
    avatarColor: '#0284c7',
    skills: 'Máquina Plana',
    skillTags: ['Máquina Plana', 'Puntualidad'],
    experience: '5 años',
    status: 'proceso',
    pipelineStage: 'nuevos',
    vacancyId: 'vac-plana',
    appliedAt: '13 de Mayo, 2026 - 04:45 PM',
    phone: '+57 315 444 5566',
    location: 'Bogotá, Colombia',
    availability: 'Inmediata',
    role: 'Operario de Máquina Plana',
    match: null,
    evalStatus: null,
    about: 'Operario con 5 años de experiencia en máquina plana, recién postulado a la vacante activa.',
  },
  {
    id: 'luz-marina',
    name: 'Luz Marina Quintero',
    email: 'luzquintero84@hotmail.com',
    initials: 'LM',
    avatarBg: '#eef2ff',
    avatarColor: '#4361ee',
    skills: 'Fileteadora, Máquina Plana',
    skillTags: ['Costura Recta', 'Fileteadora', 'Manejo de Tensión', 'Trabajo en equipo', 'Puntualidad'],
    experience: '5 años',
    status: 'proceso',
    pipelineStage: 'evaluacion',
    vacancyId: 'vac-plana',
    appliedAt: '10 de Mayo, 2026 - 10:20 AM',
    phone: '+57 320 123 4567',
    location: 'Bogotá, Colombia',
    availability: 'Inmediata',
    role: 'Operaria de Máquina Plana',
    match: 41,
    evalStatus: 'rechazado',
    about:
      'Operaria con más de 5 años de experiencia en el sector textil, especializada en el manejo de máquina plana y fileteadora. Alto nivel de atención al detalle y control de calidad en acabados. Capacidad probada para trabajar bajo presión y cumplir con cuotas de producción manteniendo altos estándares.',
  },
  {
    id: 'carlos-gomez',
    name: 'Carlos Alberto Gomez',
    email: 'carlos.gomez@gmail.com',
    initials: 'CA',
    avatarBg: '#e2e8f0',
    avatarColor: '#475569',
    skills: 'Máquina Plana, Corte',
    skillTags: ['Máquina Plana', 'Corte y Trazo', 'Liderazgo', 'Puntualidad'],
    experience: '6 años',
    status: 'proceso',
    pipelineStage: 'evaluacion',
    vacancyId: 'vac-plana',
    appliedAt: '12 de Mayo, 2026 - 09:30 AM',
    phone: '+57 301 555 6677',
    location: 'Soacha, Cundinamarca',
    availability: 'Inmediata',
    role: 'Operario de Máquina Plana',
    match: 92,
    evalStatus: 'aceptado',
    about:
      'Operario con 6 años de experiencia, incluyendo labores de corte y trazo. Excelente desempeño en la prueba práctica y buen manejo de tiempos de producción.',
  },
];

/* ---------------------------------------------------------
   LÍNEA DE TIEMPO (Historial de Procesos)
   Los pasos son fijos; su estado (completado / en curso /
   pendiente) se deriva de la etapa actual del candidato.
   --------------------------------------------------------- */
export const PROCESS_STEPS = [
  {
    id: 'postulacion',
    title: 'Postulación Registrada',
    description: (vacancyTitle) =>
      `El candidato se postuló a la vacante de ${vacancyTitle} a través del portal web.`,
    date: null, // usa candidate.appliedAt
  },
  {
    id: 'evaluacion',
    title: 'Evaluación Técnica',
    description: () =>
      'Prueba práctica de destreza en costura y manejo de maquinaria en el taller textil.',
    date: '15 de Mayo, 2026 - 02:00 PM',
  },
  {
    id: 'entrevista',
    title: 'Entrevista con Talento Humano',
    description: () =>
      'Conversación con el área de Talento Humano y el jefe de planta sobre experiencia y disponibilidad.',
    date: '19 de Mayo, 2026 - 10:00 AM',
  },
  {
    id: 'contratacion',
    title: 'Aprobación Final y Contratación',
    description: () => 'Revisión de referencias laborales y firma de contrato de trabajo.',
    date: '22 de Mayo, 2026 - 03:00 PM',
  },
];

/**
 * Índice del paso "en curso" según la etapa del pipeline.
 * Los pasos anteriores quedan completados y los siguientes pendientes.
 * Un valor igual a PROCESS_STEPS.length significa "todo completado".
 */
export const STAGE_TO_STEP = {
  nuevos: 1,
  evaluacion: 1,
  entrevista: 2,
  contratados: PROCESS_STEPS.length,
};
