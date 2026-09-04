/* =====================================================
   MÓDULO USUARIO

   Los accesos a Incentivos, Capacitaciones y Salud
   ocupacional ya son enlaces reales (ver usuario.html).
   El nombre y el rol de quien inició sesión se llenan
   desde js/script.js (initUsuario), que corre en cuanto
   carga la página.
===================================================== */


/* =====================================================
   ¿SE ABRIÓ EL PERFIL DE UN EMPLEADO?

   Cuando en Configuración se le da clic a "Ver perfil", el
   enlace llega como usuario.html?empleado=2. Aquí se lee ese
   "2" de la URL para saber qué mostrar.
===================================================== */

const parametros =
    new URLSearchParams(window.location.search);

const idEmpleado =
    parametros.get('empleado');

const vistaAdmin =
    document.getElementById('usr-admin-view');

const vistaEmpleado =
    document.getElementById('usr-employee-view');


if (idEmpleado && typeof EMPLEADOS_DATA !== 'undefined' && EMPLEADOS_DATA[idEmpleado]) {

    mostrarPerfilEmpleado(idEmpleado);

} else {

    /* Sin parámetro (o empleado inválido): se queda en la
       vista normal del administrador. */

    vistaAdmin.style.display = 'block';
    vistaEmpleado.classList.remove('show');

}


/* =====================================================
   LLENAR Y MOSTRAR EL PERFIL DEL EMPLEADO
===================================================== */

function mostrarPerfilEmpleado(id) {

    const empleado =
        EMPLEADOS_DATA[id];


    vistaAdmin.style.display = 'none';
    vistaEmpleado.classList.add('show');


    /* Iniciales para el avatar, igual que en Configuración */

    document.getElementById('emp-avatar').textContent =
        empleado.nombre
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(palabra => palabra[0].toUpperCase())
            .join('');


    document.getElementById('emp-nombre').textContent =
        empleado.nombre;

    document.getElementById('emp-cargo').textContent =
        empleado.cargo;

    document.getElementById('emp-telefono').textContent =
        empleado.telefono || 'No registrado';

    document.getElementById('emp-experiencia').textContent =
        empleado.experiencia || 'No registrada';

    document.getElementById('emp-ubicacion').textContent =
        empleado.ubicacion || 'No registrada';

    document.getElementById('emp-area').textContent =
        empleado.area || 'Por asignar';

    document.getElementById('emp-perfil').textContent =
        empleado.perfil;


    /* Habilidades como etiquetas */

    const contenedorHabilidades =
        document.getElementById('emp-habilidades');

    if (empleado.habilidades.length) {

        contenedorHabilidades.innerHTML =
            empleado.habilidades
                .map(hab => `<span class="usr-skill-tag">${hab}</span>`)
                .join('');

    } else {

        contenedorHabilidades.innerHTML =
            '<p class="usr-detail-empty">Este empleado todavía no tiene habilidades registradas.</p>';

    }


    /* Historial laboral: se dibuja ya, pero queda oculto
       hasta que se le da clic al botón (ver más abajo). */

    const contenedorHistorial =
        document.getElementById('emp-historial');

    if (empleado.historial.length) {

        contenedorHistorial.innerHTML =
            empleado.historial
                .map(evento => `

                    <div class="usr-historial-item">

                        <div class="usr-historial-fecha">
                            ${evento.fecha}
                        </div>

                        <div class="usr-historial-body">
                            <h4>${evento.titulo}</h4>
                            <p>${evento.descripcion}</p>
                        </div>

                    </div>

                `)
                .join('');

    } else {

        contenedorHistorial.innerHTML =
            '<p class="usr-detail-empty">Este empleado todavía no tiene historial laboral registrado.</p>';

    }

}


/* =====================================================
   BOTÓN "HISTORIAL LABORAL"
   Muestra u oculta la lista de eventos del historial.
===================================================== */

const btnHistorialLaboral =
    document.getElementById('btnHistorialLaboral');

const listaHistorial =
    document.getElementById('emp-historial');


if (btnHistorialLaboral) {

    btnHistorialLaboral.addEventListener('click', () => {

        listaHistorial.classList.toggle('show');

    });

}
