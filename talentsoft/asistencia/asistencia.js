/* =====================================================
   MÓDULO ASISTENCIA
===================================================== */


/* =====================================================
   TABS
===================================================== */

const tabs =
    document.querySelectorAll('.att-tab');

const panels =
    document.querySelectorAll('.att-panel');


tabs.forEach(tab => {

    tab.addEventListener(
        'click',
        () => {

            const destino =
                tab.dataset.tab;


            /* QUITAR ACTIVE DE TABS */

            tabs.forEach(item => {

                item.classList.remove(
                    'active'
                );

            });


            /* QUITAR ACTIVE DE PANELES */

            panels.forEach(panel => {

                panel.classList.remove(
                    'active'
                );

            });


            /* ACTIVAR TAB */

            tab.classList.add(
                'active'
            );


            /* ACTIVAR PANEL */

            const panel =
                document.getElementById(
                    `panel-${destino}`
                );


            if (panel) {

                panel.classList.add(
                    'active'
                );

            }

        }
    );

});


/* =====================================================
   RELOJ
===================================================== */

function actualizarReloj() {

    const ahora =
        new Date();


    let horas =
        ahora.getHours();

    const minutos =
        String(
            ahora.getMinutes()
        ).padStart(2, '0');

    const segundos =
        String(
            ahora.getSeconds()
        ).padStart(2, '0');


    const ampm =
        horas >= 12
            ? 'PM'
            : 'AM';


    horas =
        horas % 12 || 12;


    const horaTexto =
        `${String(horas).padStart(2, '0')}:${minutos}:${segundos}`;


    const reloj =
        document.getElementById(
            'clockTime'
        );


    const ampmElemento =
        document.getElementById(
            'clockAmpm'
        );


    const fecha =
        document.getElementById(
            'clockDate'
        );


    if (reloj) {

        reloj.innerHTML =
            `${horaTexto}
             <span class="clock-ampm"
                   id="clockAmpm">
                   ${ampm}
             </span>`;

    }


    if (fecha) {

        fecha.innerText =
            ahora.toLocaleDateString(
                'es-CO',
                {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }
            );

    }

}


actualizarReloj();


setInterval(
    actualizarReloj,
    1000
);


/* =====================================================
   MARCACIÓN
===================================================== */

const btnEntrada =
    document.getElementById(
        'btnEntrada'
    );

const btnBreak =
    document.getElementById(
        'btnBreak'
    );

const btnReunion =
    document.getElementById(
        'btnReunion'
    );

const btnSalida =
    document.getElementById(
        'btnSalida'
    );

const turnoStatus =
    document.getElementById(
        'turnoStatus'
    );

const turnoLogList =
    document.getElementById(
        'turnoLogList'
    );


function obtenerHora() {

    return new Date()
        .toLocaleTimeString(
            'es-CO',
            {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }
        );

}


/* AGREGAR REGISTRO */

function agregarRegistro(
    titulo
) {

    if (!turnoLogList) {
        return;
    }


    const registro =
        document.createElement(
            'div'
        );


    registro.className =
        'request-card';


    registro.innerHTML = `

        <div class="request-icon">

            <i class='bx bx-time'></i>

        </div>

        <div class="request-body">

            <h4>
                ${titulo}
            </h4>

            <p>
                Registrado a las
                ${obtenerHora()}
            </p>

        </div>

        <span class="status-badge status-accepted">

            Registrado

        </span>

    `;


    const vacio =
        turnoLogList.querySelector(
            '.turno-empty'
        );


    if (vacio) {

        vacio.remove();

    }


    turnoLogList.prepend(
        registro
    );

}


/* ENTRADA */

if (btnEntrada) {

    btnEntrada.addEventListener(
        'click',
        () => {

            agregarRegistro(
                'Entrada'
            );


            if (turnoStatus) {

                turnoStatus.innerHTML = `

                    <span class="dot"></span>

                    Turno iniciado

                `;

            }


            btnEntrada.disabled =
                true;

            btnBreak.disabled =
                false;

            btnReunion.disabled =
                false;

            btnSalida.disabled =
                false;

        }
    );

}


/* BREAK */

if (btnBreak) {

    btnBreak.addEventListener(
        'click',
        () => {

            agregarRegistro(
                'Break / Almuerzo'
            );

        }
    );

}


/* REUNIÓN */

if (btnReunion) {

    btnReunion.addEventListener(
        'click',
        () => {

            agregarRegistro(
                'Reunión / Capacitación'
            );

        }
    );

}


/* SALIDA */

if (btnSalida) {

    btnSalida.addEventListener(
        'click',
        () => {

            agregarRegistro(
                'Salida'
            );


            if (turnoStatus) {

                turnoStatus.innerHTML = `

                    <span class="dot"></span>

                    Turno finalizado

                `;

            }


            btnBreak.disabled =
                true;

            btnReunion.disabled =
                true;

            btnSalida.disabled =
                true;

        }
    );

}


/* =====================================================
   FORMULARIO DE PERMISOS
===================================================== */

const btnNuevoPermiso =
    document.getElementById(
        'btnNuevoPermiso'
    );


const formPermiso =
    document.getElementById(
        'formPermiso'
    );


const btnCancelarPermiso =
    document.getElementById(
        'btnCancelarPermiso'
    );


if (btnNuevoPermiso) {

    btnNuevoPermiso.addEventListener(
        'click',
        () => {

            formPermiso.classList.toggle(
                'show'
            );

        }
    );

}


if (btnCancelarPermiso) {

    btnCancelarPermiso.addEventListener(
        'click',
        () => {

            formPermiso.classList.remove(
                'show'
            );

        }
    );

}


if (formPermiso) {

    formPermiso.addEventListener(
        'submit',
        event => {

            event.preventDefault();


            alert(
                'Solicitud de permiso enviada correctamente.'
            );


            formPermiso.reset();


            formPermiso.classList.remove(
                'show'
            );

        }
    );

}