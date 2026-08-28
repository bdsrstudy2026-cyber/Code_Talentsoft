/* =====================================================
   MÓDULO CONFIGURACIÓN
===================================================== */

/* Permisos por rol del sistema (esto es distinto del "área
   asignada" del empleado, que es el área de la empresa en la
   que trabaja). Si tu documento tiene otra redacción, solo
   cambia los textos aquí. */

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


const listaEmpleados =
    document.getElementById('cfg-employees-list');


/* Saca las iniciales de un nombre completo, para el avatar
   ("Camila Torres" -> "CT"). */

function obtenerIniciales(nombre) {

    return nombre
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(palabra => palabra[0].toUpperCase())
        .join('');

}


/* =====================================================
   DIBUJAR LAS TARJETAS DE EMPLEADOS
===================================================== */

function renderEmpleados() {

    listaEmpleados.innerHTML = '';

    Object.keys(EMPLEADOS_DATA).forEach(id => {

        const empleado =
            EMPLEADOS_DATA[id];

        const card =
            document.createElement('article');

        card.className = 'cfg-employee-card';

        card.innerHTML = `

            <div class="cfg-employee-avatar">
                ${obtenerIniciales(empleado.nombre)}
            </div>

            <div class="cfg-employee-info">

                <h4>${empleado.nombre}</h4>
                <p>${empleado.cargo}</p>

                <label class="cfg-role-label" for="cfg-role-${id}">
                    Rol asignado
                </label>

                <select class="cfg-role-select"
                        id="cfg-role-${id}"
                        data-employee="${id}">

                    <option value="" ${!empleado.rol ? 'selected' : ''}>
                        Sin asignar
                    </option>

                    <option value="empleado" ${empleado.rol === 'empleado' ? 'selected' : ''}>
                        Empleado
                    </option>

                    <option value="administrador" ${empleado.rol === 'administrador' ? 'selected' : ''}>
                        Administrador
                    </option>

                    <option value="jefe" ${empleado.rol === 'jefe' ? 'selected' : ''}>
                        Jefe
                    </option>

                    <option value="entrevistador" ${empleado.rol === 'entrevistador' ? 'selected' : ''}>
                        Entrevistador
                    </option>

                </select>

                <!-- Aparece solo cuando el select cambia, para
                     confirmar el cambio antes de aplicarlo -->
                <div class="cfg-role-confirm" id="cfg-role-confirm-${id}"></div>

                <div class="cfg-permissions-box" id="cfg-permissions-${id}"></div>

                <a class="cfg-ver-perfil-btn"
                   href="../usuario/usuario.html?empleado=${id}">
                    <i class='bx bx-id-card'></i>
                    Ver perfil
                </a>

            </div>

        `;

        listaEmpleados.appendChild(card);

        renderPermisos(id);

    });

}


/* =====================================================
   PERMISOS SEGÚN EL ROL CONFIRMADO
===================================================== */

function renderPermisos(id) {

    const contenedor =
        document.getElementById(`cfg-permissions-${id}`);

    const rolActual =
        EMPLEADOS_DATA[id].rol;

    const rol =
        PERMISOS_POR_ROL[rolActual];

    if (!rol) {

        contenedor.innerHTML =
            '<p class="cfg-permissions-empty">Selecciona un rol para ver sus permisos.</p>';

        return;

    }

    const items =
        rol.permisos
            .map(permiso => `<li><i class='bx bx-check-circle'></i>${permiso}</li>`)
            .join('');

    contenedor.innerHTML = `
        <p class="cfg-permissions-title">Permisos de ${rol.nombre}</p>
        <ul class="cfg-permissions-list">${items}</ul>
    `;

}


/* =====================================================
   CAMBIAR ROL CON CONFIRMACIÓN (Aceptar / Rechazar)
===================================================== */

/* En vez de aplicar el rol apenas se elige en el <select>,
   se muestra un mensaje con dos botones. Solo se aplica el
   cambio de verdad cuando el administrador le da "Aceptar". */

listaEmpleados.addEventListener('change', event => {

    if (!event.target.classList.contains('cfg-role-select')) {
        return;
    }

    const select = event.target;
    const id = select.dataset.employee;
    const rolAnterior = EMPLEADOS_DATA[id].rol;
    const rolNuevo = select.value;

    const confirmBox =
        document.getElementById(`cfg-role-confirm-${id}`);

    const nombreRolNuevo =
        rolNuevo
            ? PERMISOS_POR_ROL[rolNuevo].nombre
            : 'Sin asignar';

    confirmBox.innerHTML = `
        <p>¿Cambiar el rol de ${EMPLEADOS_DATA[id].nombre} a
           <strong>${nombreRolNuevo}</strong>?</p>
        <div class="cfg-role-confirm-actions">
            <button type="button" class="cfg-btn-rechazar">Rechazar</button>
            <button type="button" class="cfg-btn-aceptar">Aceptar</button>
        </div>
    `;

    confirmBox.classList.add('show');


    confirmBox.querySelector('.cfg-btn-aceptar')
        .addEventListener('click', () => {

            EMPLEADOS_DATA[id].rol = rolNuevo;

            renderPermisos(id);

            confirmBox.classList.remove('show');
            confirmBox.innerHTML = '';

        });


    confirmBox.querySelector('.cfg-btn-rechazar')
        .addEventListener('click', () => {

            /* Se descarta el cambio: el select vuelve al rol
               que tenía antes de tocarlo. */

            select.value = rolAnterior;

            confirmBox.classList.remove('show');
            confirmBox.innerHTML = '';

        });

});


/* =====================================================
   REGISTRAR EMPLEADO
===================================================== */

const btnMostrarRegistro =
    document.getElementById('btnMostrarRegistro');

const formRegistrar =
    document.getElementById('formRegistrarEmpleado');

const btnCancelarRegistro =
    document.getElementById('btnCancelarRegistro');


if (btnMostrarRegistro) {

    btnMostrarRegistro.addEventListener('click', () => {

        formRegistrar.classList.toggle('show');

    });

}


if (btnCancelarRegistro) {

    btnCancelarRegistro.addEventListener('click', () => {

        formRegistrar.reset();
        formRegistrar.classList.remove('show');

    });

}


if (formRegistrar) {

    formRegistrar.addEventListener('submit', event => {

        event.preventDefault();

        const nombre =
            document.getElementById('regNombre').value.trim();

        const correo =
            document.getElementById('regCorreo').value.trim();

        const telefono =
            document.getElementById('regTelefono').value.trim();

        /* La contraseña solo se usa aquí para crear la cuenta;
           no se guarda en EMPLEADOS_DATA ni se muestra en
           ningún perfil. Cuando conecten el backend real, este
           es el valor que se enviaría (ya encriptado) al
           servidor. */

        const contrasena =
            document.getElementById('regContrasena').value;


        const nuevoId =
            String(siguienteEmpleadoId);

        siguienteEmpleadoId++;

        EMPLEADOS_DATA[nuevoId] = {
            nombre: nombre,
            cargo: 'Por definir',
            correo: correo,
            telefono: telefono,
            experiencia: 'Por definir',
            ubicacion: 'Bogotá, Colombia',
            area: 'Por asignar',
            rol: '',
            habilidades: [],
            perfil: 'Este empleado todavía no tiene un perfil profesional registrado.',
            historial: [
                {
                    fecha: new Date().toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    titulo: 'Registro en el sistema',
                    descripcion: 'Cuenta creada por un administrador desde Configuración.'
                }
            ]
        };

        renderEmpleados();

        formRegistrar.reset();
        formRegistrar.classList.remove('show');

    });

}


/* =====================================================
   INICIO
===================================================== */

renderEmpleados();
