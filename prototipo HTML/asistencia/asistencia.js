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

   OJO: antes esta función reescribía todo el innerHTML de
   #clockTime cada segundo (recreando el <span> del AM/PM de
   nuevo cada vez, y dejando una variable "ampmElemento" que
   ni siquiera se usaba). Ahora cada parte tiene su propio
   <span> fijo en el HTML y solo se actualiza su texto.
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


    const horaElemento =
        document.getElementById(
            'clockHora'
        );


    const ampmElemento =
        document.getElementById(
            'clockAmpm'
        );


    const fecha =
        document.getElementById(
            'clockDate'
        );


    if (horaElemento) {

        horaElemento.textContent =
            horaTexto;

    }


    if (ampmElemento) {

        ampmElemento.textContent =
            ampm;

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


    /* Mientras el turno está activo, aprovechamos este mismo
       "tic" de cada segundo para refrescar las horas trabajadas
       de hoy (ver más abajo, sección MARCACIÓN). */

    if (typeof actualizarHorasTrabajadas === 'function') {

        actualizarHorasTrabajadas();

    }

}


/* (el arranque del reloj se movió al final del archivo, ver abajo) */


/* =====================================================
   BIENVENIDA CON EL NOMBRE DE QUIEN INICIÓ SESIÓN
   getCurrentUser() viene de js/script.js (ver initSession).
===================================================== */

(function mostrarBienvenida() {

    const contenedor =
        document.getElementById(
            'clockUser'
        );

    if (!contenedor || typeof getCurrentUser !== 'function') {
        return;
    }

    const usuario =
        getCurrentUser();

    if (usuario && usuario.name) {

        contenedor.textContent =
            `Hola, ${usuario.name}`;

    }

})();


/* =====================================================
   MODAL DE CONFIRMACIÓN (reutilizable)
===================================================== */

const modalConfirmacion =
    document.getElementById(
        'modalConfirmacion'
    );

const modalConfirmacionTitulo =
    document.getElementById(
        'modalConfirmacionTitulo'
    );

const modalConfirmacionTexto =
    document.getElementById(
        'modalConfirmacionTexto'
    );

const btnCerrarConfirmacion =
    document.getElementById(
        'btnCerrarConfirmacion'
    );


function mostrarConfirmacion(
    titulo,
    texto
) {

    if (!modalConfirmacion) {
        return;
    }

    modalConfirmacionTitulo.innerText =
        titulo;

    modalConfirmacionTexto.innerText =
        texto;

    modalConfirmacion.classList.add(
        'show'
    );

}


function cerrarConfirmacion() {

    if (modalConfirmacion) {

        modalConfirmacion.classList.remove(
            'show'
        );

    }

}


if (btnCerrarConfirmacion) {

    btnCerrarConfirmacion.addEventListener(
        'click',
        cerrarConfirmacion
    );

}


if (modalConfirmacion) {

    modalConfirmacion.addEventListener(
        'click',
        event => {

            if (event.target === modalConfirmacion) {

                cerrarConfirmacion();

            }

        }
    );

}


/* =====================================================
   MARCACIÓN (con persistencia, deshacer y horas reales)

   Se corrigieron 2 problemas del prototipo anterior:

   1. El turno guardado en localStorage NUNCA se reiniciaba,
      así que si alguien dejaba el navegador abierto de un día
      para otro, veía el turno de "ayer" como si fuera el de
      hoy (con "Registrar Entrada" bloqueado para siempre).
      Ahora se guarda la fecha del turno y, si cambió el día,
      se reinicia solo.

   2. La tarjeta "Horas trabajadas hoy" era un número fijo
      escrito a mano (38.5h) que nunca cambiaba. Ahora se
      calcula de verdad a partir de cuándo se registró la
      Entrada, descontando el tiempo que se estuvo en Break o
      en Reunión (no se puede "trabajar" y estar en break al
      mismo tiempo).
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

const btnVolverTrabajo =
    document.getElementById(
        'btnVolverTrabajo'
    );

const btnDeshacerSalida =
    document.getElementById(
        'btnDeshacerSalida'
    );

const turnoStatus =
    document.getElementById(
        'turnoStatus'
    );

const turnoLogList =
    document.getElementById(
        'turnoLogList'
    );

const horasAcumuladasEl =
    document.getElementById(
        'horasAcumuladas'
    );

const horasProgressEl =
    document.getElementById(
        'horasProgress'
    );

const horasCaptionEl =
    document.getElementById(
        'horasCaption'
    );


const STORAGE_KEY_TURNO =
    'ts-asistencia-turno';

/* Meta de horas de la jornada, para la barra de progreso. */
const META_HORAS_DIA = 8;


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

function obtenerFechaHoy() {

    /* Formato YYYY-MM-DD, para comparar "el mismo día"
       sin importar la hora. */

    return new Date()
        .toLocaleDateString('en-CA');

}


function estadoTurnoPorDefecto() {

    return {
        fecha: obtenerFechaHoy(),
        log: [],
        logRespaldo: null,
        entradaRegistrada: false,
        turnoFinalizado: false,
        actividad: 'ninguna',       // 'ninguna' | 'trabajando' | 'break' | 'reunion'
        actividadInicio: null,      // timestamp (ms) del tramo actual
        segundosTrabajados: 0       // acumulado ya cerrado de tramos "trabajando"
    };

}


/* CARGAR / GUARDAR ESTADO EN localStorage, así el turno no se
   pierde si sales de la página o la recargas — pero SÍ se
   reinicia solo si ya es un día distinto. */

function cargarEstadoTurno() {

    try {

        const guardado =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_KEY_TURNO
                )
            );

        if (guardado && Array.isArray(guardado.log) && guardado.fecha === obtenerFechaHoy()) {

            /* Compatibilidad con el formato anterior, por si
               había un turno guardado sin estos campos nuevos. */

            if (typeof guardado.actividad === 'undefined') {
                guardado.actividad = guardado.entradaRegistrada ? 'trabajando' : 'ninguna';
                guardado.actividadInicio = null;
                guardado.segundosTrabajados = 0;
            }

            return guardado;

        }

    } catch (error) {

        /* Si el dato guardado está corrupto,
           simplemente arrancamos de cero. */

    }

    return estadoTurnoPorDefecto();

}


function guardarEstadoTurno() {

    localStorage.setItem(
        STORAGE_KEY_TURNO,
        JSON.stringify(estadoTurno)
    );

}


let estadoTurno =
    cargarEstadoTurno();


function renderLogTurno() {

    if (!turnoLogList) {
        return;
    }


    if (estadoTurno.log.length === 0) {

        turnoLogList.innerHTML =
            '<div class="turno-empty">Aún no hay marcaciones hoy.</div>';

        return;

    }


    turnoLogList.innerHTML =
        estadoTurno.log.map(item => `

            <div class="request-card">

                <div class="request-icon">
                    <i class='bx bx-time'></i>
                </div>

                <div class="request-body">
                    <h4>${item.titulo}</h4>
                    <p>Registrado a las ${item.hora}</p>
                </div>

                <span class="status-badge status-accepted">
                    Registrado
                </span>

            </div>

        `).join('');

}


/* Cierra el tramo de tiempo que está corriendo ahora mismo
   (desde actividadInicio hasta este momento) y, si ese tramo
   era de "trabajando", lo suma a segundosTrabajados. Los
   tramos de break/reunión no suman horas trabajadas. */

function cerrarTramoActual() {

    if (!estadoTurno.actividadInicio) {
        return;
    }

    const segundosTranscurridos =
        (Date.now() - estadoTurno.actividadInicio) / 1000;

    if (estadoTurno.actividad === 'trabajando') {

        estadoTurno.segundosTrabajados += segundosTranscurridos;

    }

}


function calcularSegundosTrabajadosAhora() {

    let total =
        estadoTurno.segundosTrabajados;

    if (estadoTurno.actividad === 'trabajando' && estadoTurno.actividadInicio) {

        total += (Date.now() - estadoTurno.actividadInicio) / 1000;

    }

    return total;

}


function actualizarHorasTrabajadas() {

    if (!horasAcumuladasEl) {
        return;
    }

    const horas =
        calcularSegundosTrabajadosAhora() / 3600;

    const porcentaje =
        Math.min(100, Math.round((horas / META_HORAS_DIA) * 100));

    horasAcumuladasEl.innerHTML =
        `${horas.toFixed(1)}h <small>/ ${META_HORAS_DIA}h</small>`;

    if (horasProgressEl) {

        horasProgressEl.style.width =
            `${porcentaje}%`;

    }

    if (horasCaptionEl) {

        let texto =
            'Aún no inicias tu turno de hoy';

        if (estadoTurno.turnoFinalizado) {

            texto = `Turno finalizado · ${porcentaje}% de la meta diaria`;

        } else if (estadoTurno.actividad === 'break') {

            texto = 'En break — las horas no corren mientras tanto';

        } else if (estadoTurno.actividad === 'reunion') {

            texto = 'En reunión — las horas no corren mientras tanto';

        } else if (estadoTurno.entradaRegistrada) {

            texto = `${porcentaje}% de la meta diaria`;

        }

        horasCaptionEl.innerText =
            texto;

    }

}


function actualizarUITurno() {

    if (btnEntrada) {

        btnEntrada.disabled =
            estadoTurno.entradaRegistrada;

    }


    const enPausa =
        estadoTurno.actividad === 'break' ||
        estadoTurno.actividad === 'reunion';


    if (btnBreak) {

        btnBreak.disabled =
            !estadoTurno.entradaRegistrada ||
            estadoTurno.turnoFinalizado ||
            enPausa;

    }


    if (btnReunion) {

        btnReunion.disabled =
            !estadoTurno.entradaRegistrada ||
            estadoTurno.turnoFinalizado ||
            enPausa;

    }


    if (btnSalida) {

        btnSalida.disabled =
            !estadoTurno.entradaRegistrada ||
            estadoTurno.turnoFinalizado;

    }


    if (btnVolverTrabajo) {

        btnVolverTrabajo.classList.toggle(
            'show',
            enPausa
        );

    }


    if (btnDeshacerSalida) {

        btnDeshacerSalida.classList.toggle(
            'show',
            estadoTurno.turnoFinalizado
        );

    }


    if (turnoStatus) {

        let texto =
            'Aguardando entrada';

        if (estadoTurno.turnoFinalizado) {

            texto = 'Turno finalizado';

        } else if (estadoTurno.actividad === 'break') {

            texto = 'En break / almuerzo';

        } else if (estadoTurno.actividad === 'reunion') {

            texto = 'En reunión';

        } else if (estadoTurno.entradaRegistrada) {

            texto = 'Turno iniciado';

        }


        turnoStatus.innerHTML = `
            <span class="dot"></span>
            ${texto}
        `;

    }


    actualizarHorasTrabajadas();

}


function agregarRegistro(
    titulo
) {

    estadoTurno.log.unshift({
        titulo,
        hora: obtenerHora()
    });

    guardarEstadoTurno();

    renderLogTurno();

}


/* ENTRADA */

if (btnEntrada) {

    btnEntrada.addEventListener(
        'click',
        () => {

            /* Empezamos un turno nuevo y limpio.
               Si había un respaldo de un turno anterior
               (por si acaso alguien quería deshacer la
               salida) ya no aplica, porque se está
               iniciando otro turno. */

            estadoTurno =
                estadoTurnoPorDefecto();

            estadoTurno.entradaRegistrada =
                true;

            estadoTurno.actividad =
                'trabajando';

            estadoTurno.actividadInicio =
                Date.now();

            agregarRegistro(
                'Entrada'
            );

            guardarEstadoTurno();

            actualizarUITurno();

        }
    );

}


/* BREAK */

if (btnBreak) {

    btnBreak.addEventListener(
        'click',
        () => {

            cerrarTramoActual();

            estadoTurno.actividad =
                'break';

            estadoTurno.actividadInicio =
                Date.now();

            agregarRegistro(
                'Break / Almuerzo'
            );

            guardarEstadoTurno();

            actualizarUITurno();

        }
    );

}


/* REUNIÓN */

if (btnReunion) {

    btnReunion.addEventListener(
        'click',
        () => {

            cerrarTramoActual();

            estadoTurno.actividad =
                'reunion';

            estadoTurno.actividadInicio =
                Date.now();

            agregarRegistro(
                'Reunión / Capacitación'
            );

            guardarEstadoTurno();

            actualizarUITurno();

        }
    );

}


/* VOLVER AL TRABAJO (cierra el break o la reunión) */

if (btnVolverTrabajo) {

    btnVolverTrabajo.addEventListener(
        'click',
        () => {

            const veniaDe =
                estadoTurno.actividad === 'break'
                    ? 'Fin de break'
                    : 'Fin de reunión';

            cerrarTramoActual();

            estadoTurno.actividad =
                'trabajando';

            estadoTurno.actividadInicio =
                Date.now();

            agregarRegistro(
                veniaDe
            );

            guardarEstadoTurno();

            actualizarUITurno();

        }
    );

}


/* SALIDA */

if (btnSalida) {

    btnSalida.addEventListener(
        'click',
        () => {

            /* Cerramos el tramo que estaba corriendo (si se
               sale estando "trabajando", esas horas sí cuentan;
               si se sale en medio de un break, ese tiempo no
               suma, como debe ser). */

            cerrarTramoActual();


            /* Copia del log ANTES de agregar "Salida": es la que se
               usa como respaldo, así al "Deshacer salida" el registro
               de Salida desaparece del historial (antes se quedaba). */

            const logSinSalida =
                estadoTurno.log.slice();


            /* Guardamos el registro del turno como
               "Salida", con toda la marcación incluida. */

            estadoTurno.log.unshift({
                titulo: 'Salida',
                hora: obtenerHora()
            });


            /* Lo dejamos guardado como respaldo por si
               se necesita deshacer, y dejamos el turno
               marcado como finalizado (pero SIN perder las
               horas ya calculadas, para que la tarjeta de
               "Horas trabajadas hoy" siga mostrando el total
               real del día en vez de volver a cero). */

            estadoTurno.logRespaldo = {
                log: logSinSalida,
                actividad: estadoTurno.actividad,
                segundosTrabajados: estadoTurno.segundosTrabajados
            };

            estadoTurno.entradaRegistrada =
                false;

            estadoTurno.turnoFinalizado =
                true;

            estadoTurno.actividad =
                'ninguna';

            estadoTurno.actividadInicio =
                null;

            guardarEstadoTurno();

            renderLogTurno();

            actualizarUITurno();

        }
    );

}


/* DESHACER SALIDA (por si se dio click sin querer) */

if (btnDeshacerSalida) {

    btnDeshacerSalida.addEventListener(
        'click',
        () => {

            /* Recuperamos las marcaciones y las horas que se
               habían guardado como respaldo, y retomamos el
               turno como "trabajando". */

            if (estadoTurno.logRespaldo) {

                estadoTurno.log =
                    estadoTurno.logRespaldo.log;

                estadoTurno.segundosTrabajados =
                    estadoTurno.logRespaldo.segundosTrabajados;

                estadoTurno.logRespaldo =
                    null;

            }


            estadoTurno.turnoFinalizado =
                false;

            estadoTurno.entradaRegistrada =
                true;

            estadoTurno.actividad =
                'trabajando';

            estadoTurno.actividadInicio =
                Date.now();

            guardarEstadoTurno();

            renderLogTurno();

            actualizarUITurno();

        }
    );

}


/* RESTAURAR AL CARGAR LA PÁGINA */

renderLogTurno();

actualizarUITurno();


/* =====================================================
   NOVEDADES DEL MES (tarjeta de Marcación)

   Antes esta tarjeta siempre decía "0 · Sin novedades", sin
   importar cuántos permisos u horas extra se registraran.
   Ahora cuenta las solicitudes que se van creando en esta
   misma sesión (permisos y horas extra pendientes de
   aprobación), para que la tarjeta refleje lo que de verdad
   está pasando en el resto del módulo.
===================================================== */

const novedadesNumEl =
    document.getElementById(
        'novedadesNum'
    );

const novedadesBadgeEl =
    document.getElementById(
        'novedadesBadge'
    );

let contadorNovedades = 0;


function sumarNovedad() {

    contadorNovedades++;

    if (novedadesNumEl) {

        novedadesNumEl.innerText =
            contadorNovedades;

    }

    if (novedadesBadgeEl) {

        novedadesBadgeEl.className =
            'status-badge status-pending';

        novedadesBadgeEl.innerHTML =
            `<i class='bx bx-time-five'></i> ${contadorNovedades} pendiente${contadorNovedades > 1 ? 's' : ''}`;

    }

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


const permisosList =
    document.querySelector(
        '#panel-permisos .request-list'
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


            const tipo =
                document.getElementById(
                    'permisoTipo'
                ).value;

            const duracion =
                document.getElementById(
                    'permisoDuracion'
                ).value;

            const motivo =
                document.getElementById(
                    'permisoMotivo'
                ).value;


            if (permisosList) {

                const card =
                    document.createElement(
                        'div'
                    );

                card.className =
                    'request-card';

                card.innerHTML = `

                    <div class="request-icon">
                        <i class='bx bx-calendar-check'></i>
                    </div>

                    <div class="request-body">
                        <h4>${tipo}</h4>
                        <p>${duracion} ${motivo ? '· ' + motivo : ''}</p>
                    </div>

                    <span class="status-badge status-pending">
                        Pendiente
                    </span>

                `;

                permisosList.prepend(
                    card
                );

            }


            formPermiso.reset();

            formPermiso.classList.remove(
                'show'
            );


            sumarNovedad();


            mostrarConfirmacion(
                'Solicitud enviada',
                'Tu solicitud de permiso fue enviada correctamente y quedó pendiente de aprobación.'
            );

        }
    );

}


/* =====================================================
   VACACIONES
===================================================== */

const btnNuevaVacacion =
    document.getElementById(
        'btnNuevaVacacion'
    );


const formVacacion =
    document.getElementById(
        'formVacacion'
    );


const btnCancelarVacacion =
    document.getElementById(
        'btnCancelarVacacion'
    );


const vacacionesList =
    document.querySelector(
        '#panel-vacaciones .request-list'
    );


const vacacionEstadoValor =
    document.getElementById(
        'vacacionEstadoValor'
    );


const vacacionEstadoDetalle =
    document.getElementById(
        'vacacionEstadoDetalle'
    );


const diasDisponiblesEl =
    document.getElementById(
        'vacacionDiasDisponibles'
    );


if (btnNuevaVacacion) {

    btnNuevaVacacion.addEventListener(
        'click',
        () => {

            formVacacion.classList.toggle(
                'show'
            );

        }
    );

}


if (btnCancelarVacacion) {

    btnCancelarVacacion.addEventListener(
        'click',
        () => {

            formVacacion.classList.remove(
                'show'
            );

        }
    );

}


function actualizarEstadoVacacion(
    titulo,
    detalle,
    aprobado
) {

    if (!vacacionEstadoValor) {
        return;
    }

    vacacionEstadoValor.innerText =
        aprobado
            ? 'Aprobado'
            : 'Por aprobar';

    vacacionEstadoValor.style.color =
        aprobado
            ? '#16a34a'
            : '';

    vacacionEstadoDetalle.innerText =
        `${titulo} · ${detalle}`;

}


if (formVacacion) {

    formVacacion.addEventListener(
        'submit',
        event => {

            event.preventDefault();


            const inicio =
                document.getElementById(
                    'vacacionInicio'
                ).value;

            const fin =
                document.getElementById(
                    'vacacionFin'
                ).value;

            const dias =
                document.getElementById(
                    'vacacionDias'
                ).value;

            const motivo =
                document.getElementById(
                    'vacacionMotivo'
                ).value;


            /* VALIDACIÓN: la fecha fin no puede ser anterior
               a la fecha inicio (antes no se revisaba nada). */

            if (inicio && fin && fin < inicio) {

                mostrarConfirmacion(
                    'Fechas inválidas',
                    'La fecha de fin no puede ser anterior a la fecha de inicio. Revisa las fechas e inténtalo de nuevo.'
                );

                return;

            }


            /* VALIDACIÓN: no se pueden pedir más días hábiles
               de los que quedan disponibles (antes el contador
               de "Días disponibles" nunca bajaba de 9). */

            const diasSolicitados =
                Number(dias) || 0;

            if (diasDisponiblesEl) {

                const diasRestantes =
                    Number(diasDisponiblesEl.textContent);

                if (diasSolicitados > diasRestantes) {

                    mostrarConfirmacion(
                        'Días insuficientes',
                        `Solo tienes ${diasRestantes} días hábiles disponibles y estás solicitando ${diasSolicitados}.`
                    );

                    return;

                }

            }


            const tituloCard =
                motivo || 'Solicitud de vacaciones';

            const detalleCard =
                `${dias} días hábiles · ${inicio} al ${fin}`;


            let badgeNuevo =
                null;


            if (vacacionesList) {

                const card =
                    document.createElement(
                        'div'
                    );

                card.className =
                    'request-card';

                card.innerHTML = `

                    <div class="request-icon">
                        <i class='bx bx-plane-take'></i>
                    </div>

                    <div class="request-body">
                        <h4>${tituloCard}</h4>
                        <p>${detalleCard}</p>
                    </div>

                    <span class="status-badge status-pending">
                        Por aprobar
                    </span>

                `;

                vacacionesList.prepend(
                    card
                );

                badgeNuevo =
                    card.querySelector(
                        '.status-badge'
                    );

            }


            actualizarEstadoVacacion(
                tituloCard,
                detalleCard,
                false
            );


            formVacacion.reset();

            formVacacion.classList.remove(
                'show'
            );


            sumarNovedad();


            mostrarConfirmacion(
                'Solicitud enviada',
                'Tu solicitud de vacaciones fue enviada y quedó pendiente de aprobación.'
            );


            /* Simulamos la aprobación, ya que este
               prototipo no tiene backend (ver README). */

            setTimeout(
                () => {

                    if (badgeNuevo) {

                        badgeNuevo.className =
                            'status-badge status-accepted';

                        badgeNuevo.innerText =
                            'Aprobado';

                    }


                    /* Ya aprobado, ahora sí se descuentan los
                       días del contador de "Días disponibles"
                       (antes se quedaba fijo en 9 sin importar
                       cuántas solicitudes se aprobaran). */

                    if (diasDisponiblesEl) {

                        const diasRestantes =
                            Math.max(
                                0,
                                Number(diasDisponiblesEl.textContent) - diasSolicitados
                            );

                        diasDisponiblesEl.textContent =
                            diasRestantes;

                    }


                    actualizarEstadoVacacion(
                        tituloCard,
                        detalleCard,
                        true
                    );

                },
                4000
            );

        }
    );

}


/* =====================================================
   HORAS EXTRA
===================================================== */

const btnNuevaHoraExtra =
    document.getElementById(
        'btnNuevaHoraExtra'
    );


const formHoraExtra =
    document.getElementById(
        'formHoraExtra'
    );


const btnCancelarHoraExtra =
    document.getElementById(
        'btnCancelarHoraExtra'
    );


const horasExtraList =
    document.querySelector(
        '#panel-horas-extra .request-list'
    );


const horasExtraPendientesNum =
    document.getElementById(
        'horasExtraPendientesNum'
    );


if (btnNuevaHoraExtra) {

    btnNuevaHoraExtra.addEventListener(
        'click',
        () => {

            formHoraExtra.classList.toggle(
                'show'
            );

        }
    );

}


if (btnCancelarHoraExtra) {

    btnCancelarHoraExtra.addEventListener(
        'click',
        () => {

            formHoraExtra.classList.remove(
                'show'
            );

        }
    );

}


if (formHoraExtra) {

    formHoraExtra.addEventListener(
        'submit',
        event => {

            event.preventDefault();


            const fecha =
                document.getElementById(
                    'horaExtraFecha'
                ).value;

            const cantidad =
                document.getElementById(
                    'horaExtraCantidad'
                ).value;

            const motivo =
                document.getElementById(
                    'horaExtraMotivo'
                ).value || 'Horas extra';


            if (horasExtraList) {

                const card =
                    document.createElement(
                        'div'
                    );

                card.className =
                    'request-card';

                card.innerHTML = `

                    <div class="request-icon">
                        <i class='bx bx-hourglass'></i>
                    </div>

                    <div class="request-body">
                        <h4>${motivo}</h4>
                        <p>${cantidad} horas extra ${fecha ? '· ' + fecha : ''}</p>
                    </div>

                    <span class="status-badge status-pending">
                        Pendiente
                    </span>

                `;

                horasExtraList.prepend(
                    card
                );

            }


            if (horasExtraPendientesNum) {

                horasExtraPendientesNum.innerText =
                    Number(horasExtraPendientesNum.innerText) + 1;

            }


            formHoraExtra.reset();

            formHoraExtra.classList.remove(
                'show'
            );


            sumarNovedad();


            mostrarConfirmacion(
                'Registro enviado',
                'Tus horas extra quedaron registradas y pendientes de aprobación.'
            );

        }
    );

}


/* =====================================================
   ALERTAS DE CONTRATO
===================================================== */

const modalAlerta =
    document.getElementById(
        'modalAlerta'
    );


const modalAlertaInfo =
    document.getElementById(
        'modalAlertaInfo'
    );


const modalAlertaMensaje =
    document.getElementById(
        'modalAlertaMensaje'
    );


const btnCancelarAlerta =
    document.getElementById(
        'btnCancelarAlerta'
    );


const btnEnviarAlerta =
    document.getElementById(
        'btnEnviarAlerta'
    );


const alertCards =
    document.querySelectorAll(
        '.alert-clickable'
    );

const alertasList =
    document.getElementById(
        'alertasList'
    );

const alertasUrgenteBadge =
    document.getElementById(
        'alertasUrgenteBadge'
    );


/* =====================================================
   PERSONALIZAR ALERTAS SEGÚN QUIÉN INICIÓ SESIÓN

   Antes, cualquier persona que entrara a Asistencia veía
   las mismas 2 alertas de contrato, sin importar su rol.
   Ahora:
     - Administrador / Jefe → ven las alertas de todo el
       equipo (vista de gestión).
     - Empleado / Entrevistador → ven solo su propia alerta
       (si su contrato está por vencer), o un mensaje de que
       no tienen alertas pendientes.
===================================================== */

(function personalizarAlertas() {

    if (typeof getCurrentUser !== 'function' || !alertasList) {
        return;
    }

    const usuario =
        getCurrentUser();

    if (!usuario) {
        return;
    }

    const vePropiaAlerta =
        usuario.role === 'Empleado' || usuario.role === 'Entrevistador';

    if (!vePropiaAlerta) {

        /* Administrador / Jefe: se deja la vista de equipo
           tal cual está en el HTML, no hay que filtrar nada. */

        return;

    }


    let alertasVisibles =
        0;

    alertCards.forEach(card => {

        const esSuya =
            card.dataset.nombre === usuario.name;

        card.style.display =
            esSuya ? '' : 'none';

        if (esSuya) {
            alertasVisibles++;
        }

    });


    if (alertasVisibles === 0) {

        alertasList.innerHTML = `
            <div class="request-card">
                <div class="request-icon">
                    <i class='bx bx-check-shield'></i>
                </div>
                <div class="request-body">
                    <h4>Sin alertas pendientes</h4>
                    <p>Tu contrato no tiene vencimientos próximos por ahora.</p>
                </div>
            </div>
        `;

    }


    if (alertasUrgenteBadge) {

        alertasUrgenteBadge.style.display =
            alertasVisibles === 0 ? 'none' : '';

    }

})();


function abrirModalAlerta(
    nombre,
    detalle
) {

    if (!modalAlerta) {
        return;
    }

    modalAlertaInfo.innerText =
        `${nombre} — ${detalle}`;

    modalAlertaMensaje.value =
        '';

    modalAlerta.classList.add(
        'show'
    );

}


function cerrarModalAlerta() {

    if (modalAlerta) {

        modalAlerta.classList.remove(
            'show'
        );

    }

}


alertCards.forEach(card => {

    card.addEventListener(
        'click',
        () => {

            abrirModalAlerta(
                card.dataset.nombre,
                card.dataset.detalle
            );

        }
    );

});


if (btnCancelarAlerta) {

    btnCancelarAlerta.addEventListener(
        'click',
        cerrarModalAlerta
    );

}


if (modalAlerta) {

    modalAlerta.addEventListener(
        'click',
        event => {

            if (event.target === modalAlerta) {

                cerrarModalAlerta();

            }

        }
    );

}


if (btnEnviarAlerta) {

    btnEnviarAlerta.addEventListener(
        'click',
        () => {

            cerrarModalAlerta();

            mostrarConfirmacion(
                'Mensaje enviado',
                'Tu mensaje fue enviado a tu jefe. Te contactará pronto para revisar el contrato.'
            );

        }
    );

}


/* =====================================================
   ARRANQUE DEL RELOJ

   IMPORTANTE: esto va al FINAL del archivo a propósito.

   actualizarReloj() llama a actualizarHorasTrabajadas(), que usa
   las variables const/let de la sección MARCACIÓN
   (horasAcumuladasEl, estadoTurno, etc.). Si se ejecuta ANTES de
   que esas líneas se hayan leído, JavaScript lanza
   "Cannot access '...' before initialization" y el archivo
   completo se detiene ahí, dejando sin funcionar todo lo que
   sigue (marcación, permisos, vacaciones, horas extra, alertas).
===================================================== */

actualizarReloj();

setInterval(
    actualizarReloj,
    1000
);