/* =====================================================
   DATOS COMPARTIDOS DE EMPLEADOS
   Fuente única para Configuración (lista + roles) y para
   Usuario (perfil de detalle cuando se llega con
   "Ver perfil" desde Configuración). Los 3 primeros
   coinciden con las cuentas de demostración del login
   (ver login/login.js).
===================================================== */

const EMPLEADOS_DATA = {

    '1': {
        nombre: 'Camila Torres',
        cargo: 'Operaria de confección',
        correo: 'empleado@talentsoft.com',
        telefono: '+57 315 444 5566',
        experiencia: '3 años',
        ubicacion: 'Bogotá, Colombia',
        area: 'Confección',
        rol: 'empleado',
        habilidades: ['Máquina plana', 'Fileteadora', 'Control de calidad'],
        perfil: 'Operaria con 3 años de experiencia en confección textil, especializada en máquina plana y fileteadora. Cumplida con las cuotas de producción y atenta al detalle en los acabados.',
        historial: [
            {
                fecha: '10 de marzo, 2024',
                titulo: 'Ingreso a la compañía',
                descripcion: 'Contratada como operaria de máquina plana en el área de Confección.'
            },
            {
                fecha: '22 de enero, 2025',
                titulo: 'Reconocimiento por desempeño',
                descripcion: 'Recibió un incentivo por cumplimiento sostenido de metas de producción.'
            }
        ]
    },

    '2': {
        nombre: 'Andrés Ramírez',
        cargo: 'Jefe de área',
        correo: 'jefe@talentsoft.com',
        telefono: '+57 310 222 3344',
        experiencia: '7 años',
        ubicacion: 'Bogotá, Colombia',
        area: 'Producción',
        rol: 'jefe',
        habilidades: ['Liderazgo de equipos', 'Planeación de producción', 'Control de indicadores'],
        perfil: 'Jefe de área con 7 años de experiencia liderando equipos de producción textil. Responsable del seguimiento de metas, indicadores de eficiencia y aprobación de solicitudes de su equipo.',
        historial: [
            {
                fecha: '5 de junio, 2019',
                titulo: 'Ingreso a la compañía',
                descripcion: 'Contratado como operario de máquina plana en Producción.'
            },
            {
                fecha: '18 de agosto, 2022',
                titulo: 'Ascenso a Jefe de área',
                descripcion: 'Asumió la jefatura del área de Producción tras un proceso de evaluación interna.'
            }
        ]
    },

    '3': {
        nombre: 'Sofía Pardo',
        cargo: 'Encargada de selección de personal',
        correo: 'entrevistador@talentsoft.com',
        telefono: '+57 301 555 6677',
        experiencia: '4 años',
        ubicacion: 'Soacha, Cundinamarca',
        area: 'Talento Humano',
        rol: 'entrevistador',
        habilidades: ['Entrevistas por competencias', 'Reclutamiento', 'Redacción de perfiles'],
        perfil: 'Encargada de selección de personal con 4 años de experiencia en reclutamiento para el sector textil. Responsable de la gestión de candidatos y del proceso de entrevistas.',
        historial: [
            {
                fecha: '2 de febrero, 2021',
                titulo: 'Ingreso a la compañía',
                descripcion: 'Contratada en el área de Talento Humano como asistente de selección.'
            },
            {
                fecha: '14 de abril, 2023',
                titulo: 'Ascenso a Encargada de selección',
                descripcion: 'Asumió la responsabilidad completa del proceso de reclutamiento.'
            }
        ]
    },

    '4': {
        nombre: 'Laura Martínez',
        cargo: 'Administradora del sistema',
        correo: 'admin@talentsoft.com',
        telefono: '+57 300 111 2233',
        experiencia: '6 años',
        ubicacion: 'Bogotá, Colombia',
        area: 'Dirección',
        rol: 'administrador',
        habilidades: ['Gestión de talento humano', 'Nómina y prestaciones', 'Análisis de indicadores'],
        perfil: 'Administradora del sistema con 6 años de experiencia en gestión de talento humano. Responsable de la configuración de roles, la nómina y el seguimiento general del personal.',
        historial: [
            {
                fecha: '3 de mayo, 2018',
                titulo: 'Ingreso a la compañía',
                descripcion: 'Contratada como analista de talento humano.'
            },
            {
                fecha: '20 de noviembre, 2020',
                titulo: 'Ascenso a Administradora',
                descripcion: 'Asumió la administración completa del sistema de gestión de talento humano.'
            }
        ]
    }

};

/* Siguiente ID a usar cuando Configuración registre un
   empleado nuevo (ver configuracion.js). */
let siguienteEmpleadoId = 5;
