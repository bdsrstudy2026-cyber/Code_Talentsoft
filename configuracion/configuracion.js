/* =====================================================
   MÓDULO CONFIGURACIÓN — ROLES Y PERMISOS
===================================================== */

/* Cada clave es un rol del diagrama de casos de uso del
   proyecto y su valor es la lista de permisos que ese rol
   tiene dentro del sistema. Si tu documento tiene otra
   redacción, solo hay que cambiar los textos aquí; el
   resto del código no se toca. */

const PERMISOS_POR_ROL = {

    administrador: {

        nombre: 'Administrador',

        permisos: [
            'Crear cuentas de usuario y asignar rol o perfil',
            'Registrar información personal y profesional de los empleados',
            'Actualizar perfiles y consultar el historial laboral',
            'Registrar datos contractuales y ver alertas de vencimiento de contrato',
            'Calcular prestaciones sociales',
            'Registrar horas extra y calcular su valor',
            'Registrar ausencias no justificadas y asociarlas a la nómina',
            'Generar reportes de personal, de asistencia y del proceso de selección',
            'Registrar incentivos, reconocimientos, eventos institucionales y capacitaciones',
            'Registrar incidentes de salud laboral y exámenes médicos ocupacionales',
            'Dar seguimiento al bienestar físico y emocional de los empleados'
        ]

    },

    jefe: {

        nombre: 'Jefe',

        permisos: [
            'Registrar evaluaciones de desempeño y dar seguimiento a metas e indicadores',
            'Identificar candidatos a bono y ver el indicador de eficiencia por empleado',
            'Gestionar vacaciones: aprobar o rechazar solicitudes de permiso'
        ]

    },

    empleado: {

        nombre: 'Empleado',

        permisos: [
            'Registrar su propia asistencia',
            'Consultar su historial de asistencia',
            'Registrar solicitudes de permiso',
            'Solicitar vacaciones'
        ]

    },

    entrevistador: {

        nombre: 'Entrevistador',

        permisos: [
            'Registrar nuevos candidatos y buscar candidatos anteriores',
            'Etiquetar candidatos por especialidad',
            'Programar y registrar entrevistas, y enviar recordatorios al candidato',
            'Registrar calificaciones y observaciones, y cambiar el estado del aspirante'
        ]

    }

};


/* Dibuja, dentro de la tarjeta del empleado, la lista de
   permisos que le corresponden según el rol elegido en
   el <select>. */

function renderPermisos(selectEl) {

    const empleadoId =
        selectEl.getAttribute('data-employee');

    const contenedor =
        document.getElementById(
            `cfg-permissions-${empleadoId}`
        );

    const rol =
        PERMISOS_POR_ROL[selectEl.value];


    if (!rol) {

        contenedor.innerHTML =
            '<p class="cfg-permissions-empty">Selecciona un rol para ver sus permisos.</p>';

        return;

    }


    const items =
        rol.permisos
            .map(permiso =>
                `<li><i class='bx bx-check-circle'></i>${permiso}</li>`
            )
            .join('');


    contenedor.innerHTML = `
        <p class="cfg-permissions-title">Permisos de ${rol.nombre}</p>
        <ul class="cfg-permissions-list">${items}</ul>
    `;

}


const roleSelects =
    document.querySelectorAll('.cfg-role-select');


roleSelects.forEach(select => {

    renderPermisos(select);

    select.addEventListener(
        'change',
        () => renderPermisos(select)
    );

});
