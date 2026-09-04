/* =====================================================
   MÓDULO INCENTIVOS
   Datos de demostración: después pueden ser reemplazados
   por la API/base de datos del sistema.
===================================================== */

const STORAGE_KEY = 'talentsoft_incentivos';

// Nombre de quien inició sesión (ver login/login.js y js/script.js).
// Si por alguna razón no hay sesión detectada, se usa Laura Martínez
// como dato de demostración para que el módulo siga siendo usable.
const sesionActual = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
const USUARIO_ACTUAL = sesionActual ? sesionActual.name : 'Laura Martínez';
const ES_ADMINISTRADOR = sesionActual ? sesionActual.role === 'Administrador' : true;

const datosIniciales = [
    {
        id: 1,
        trabajador: 'Laura Martínez',
        cargo: 'Administradora',
        titulo: 'Reconocimiento por desempeño',
        motivo: 'Excelente desempeño y compromiso durante el mes de agosto.',
        fecha: '2026-08-22',
        asignadoPor: 'Administración',
        estado: 'pendiente',
        respuesta: '',
        firma: '',
        fechaConfirmacion: ''
    },
    {
        id: 2,
        trabajador: 'Laura Martínez',
        cargo: 'Administradora',
        titulo: 'Cumplimiento de objetivos',
        motivo: 'Reconocimiento por el cumplimiento de los objetivos asignados.',
        fecha: '2026-08-10',
        asignadoPor: 'Administración',
        estado: 'confirmado',
        respuesta: 'Agradezco el reconocimiento y la confianza depositada en mi trabajo.',
        firma: '',
        fechaConfirmacion: '2026-08-10'
    }
];

let incentivos = cargarIncentivos();
let incentivoSeleccionado = null;

function cargarIncentivos() {
    const guardados = localStorage.getItem(STORAGE_KEY);

    if (guardados) {
        try {
            return JSON.parse(guardados);
        } catch (error) {
            console.warn('No se pudieron leer los incentivos guardados.', error);
        }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(datosIniciales));
    return [...datosIniciales];
}

function guardarIncentivos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incentivos));
}

function formatearFecha(fecha) {
    if (!fecha) return '';
    const partes = fecha.split('-');
    if (partes.length !== 3) return fecha;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function escapeHtml(texto = '') {
    return String(texto)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function renderEmpleado() {
    const lista = document.getElementById('lista-empleado');
    const vacio = document.getElementById('vacio-empleado');
    const contador = document.getElementById('contador-empleado');

    const propios = incentivos.filter(item => item.trabajador === USUARIO_ACTUAL);
    contador.textContent = `${propios.length} ${propios.length === 1 ? 'incentivo' : 'incentivos'}`;

    if (!propios.length) {
        lista.innerHTML = '';
        vacio.classList.remove('hidden');
        return;
    }

    vacio.classList.add('hidden');
    lista.innerHTML = propios.map(item => `
        <article class="incentivo-card ${item.estado}" data-incentivo="${item.id}">
            <div class="card-icon"><i class='bx ${item.estado === 'confirmado' ? 'bx-award' : 'bx-gift'}'></i></div>
            <div class="card-content">
                <div class="card-top">
                    <h3>${escapeHtml(item.titulo)}</h3>
                    <span class="status ${item.estado === 'confirmado' ? 'confirmed' : 'pending'}">
                        ${item.estado === 'confirmado' ? 'Confirmado' : 'Pendiente'}
                    </span>
                </div>
                <p>${escapeHtml(item.motivo)}</p>
                <small>${formatearFecha(item.fecha)} · ${escapeHtml(item.asignadoPor)}</small>
            </div>
            <button class="view-btn" data-ver="${item.id}">
                Ver incentivo <i class='bx bx-right-arrow-alt'></i>
            </button>
        </article>
    `).join('');

    lista.querySelectorAll('[data-ver]').forEach(boton => {
        boton.addEventListener('click', () => mostrarDetalleEmpleado(Number(boton.dataset.ver)));
    });
}

function mostrarDetalleEmpleado(id) {
    const incentivo = incentivos.find(item => item.id === id && item.trabajador === USUARIO_ACTUAL);
    if (!incentivo) return;

    incentivoSeleccionado = id;

    document.getElementById('detalle-titulo').textContent = incentivo.titulo;
    document.getElementById('detalle-trabajador').textContent = incentivo.trabajador;
    document.getElementById('detalle-cargo').textContent = incentivo.cargo;
    document.getElementById('detalle-fecha').textContent = formatearFecha(incentivo.fecha);
    document.getElementById('detalle-asignado').textContent = incentivo.asignadoPor;
    document.getElementById('detalle-motivo').textContent = incentivo.motivo;

    const estado = document.getElementById('detalle-estado');
    estado.textContent = incentivo.estado === 'confirmado' ? 'Confirmado' : 'Pendiente';
    estado.className = `status ${incentivo.estado === 'confirmado' ? 'confirmed' : 'pending'}`;

    document.getElementById('lista-incentivos').classList.add('hidden');
    document.getElementById('detalle-incentivo').classList.remove('hidden');

    const form = document.getElementById('form-confirmacion');
    const resultado = document.getElementById('confirmacion-final');
    const respuesta = document.getElementById('respuesta');
    const cargo = document.getElementById('cargo');
    const preview = document.getElementById('firma-preview');
    const firma = document.getElementById('firma');

    respuesta.value = incentivo.respuesta || '';
    cargo.value = incentivo.cargo || '';
    firma.value = '';

    if (incentivo.firma) {
        preview.innerHTML = `<img src="${incentivo.firma}" alt="Firma del trabajador">`;
        preview.classList.remove('hidden');
    } else {
        preview.innerHTML = '';
        preview.classList.add('hidden');
    }

    if (incentivo.estado === 'confirmado') {
        form.classList.add('hidden');
        resultado.classList.remove('hidden');
        document.getElementById('texto-confirmacion').textContent =
            `Tu respuesta fue registrada${incentivo.fechaConfirmacion ? ` el ${formatearFecha(incentivo.fechaConfirmacion)}` : ''}.`;
    } else {
        form.classList.remove('hidden');
        resultado.classList.add('hidden');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function volverAListaEmpleado() {
    document.getElementById('detalle-incentivo').classList.add('hidden');
    document.getElementById('lista-incentivos').classList.remove('hidden');
    incentivoSeleccionado = null;
    renderEmpleado();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('btn-volver-lista').addEventListener('click', volverAListaEmpleado);

document.getElementById('firma').addEventListener('change', () => {
    const archivo = document.getElementById('firma').files[0];
    const preview = document.getElementById('firma-preview');

    if (!archivo) {
        preview.classList.add('hidden');
        preview.innerHTML = '';
        return;
    }

    if (!archivo.type.startsWith('image/')) {
        alert('Selecciona una imagen para la firma.');
        document.getElementById('firma').value = '';
        preview.classList.add('hidden');
        preview.innerHTML = '';
        return;
    }

    const lector = new FileReader();
    lector.onload = evento => {
        preview.innerHTML = `<img src="${evento.target.result}" alt="Vista previa de la firma">`;
        preview.classList.remove('hidden');
    };
    lector.readAsDataURL(archivo);
});

document.getElementById('form-confirmacion').addEventListener('submit', evento => {
    evento.preventDefault();

    const incentivo = incentivos.find(item => item.id === incentivoSeleccionado);
    if (!incentivo) return;

    const respuesta = document.getElementById('respuesta').value.trim();
    const cargo = document.getElementById('cargo').value;
    const archivo = document.getElementById('firma').files[0];

    if (!respuesta) {
        alert('Escribe una respuesta antes de confirmar el incentivo.');
        return;
    }

    if (!cargo) {
        alert('Selecciona tu cargo antes de confirmar el incentivo.');
        return;
    }

    const guardarConfirmacion = firmaData => {
        incentivo.respuesta = respuesta;
        incentivo.cargo = cargo;
        incentivo.firma = firmaData || incentivo.firma || '';
        incentivo.estado = 'confirmado';
        incentivo.fechaConfirmacion = new Date().toISOString().slice(0, 10);

        guardarIncentivos();
        mostrarDetalleEmpleado(incentivo.id);
        renderAdmin();
        alert('El incentivo fue confirmado correctamente.');
    };

    if (archivo) {
        const lector = new FileReader();
        lector.onload = evento => guardarConfirmacion(evento.target.result);
        lector.readAsDataURL(archivo);
    } else {
        guardarConfirmacion('');
    }
});

/* ===================== ADMINISTRADOR ===================== */

function mostrarVistaAdmin() {
    document.getElementById('vista-empleado').classList.add('hidden');
    document.getElementById('vista-admin').classList.remove('hidden');
    document.getElementById('btn-vista-admin').classList.add('hidden');
    renderAdmin();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mostrarVistaEmpleado() {
    document.getElementById('vista-admin').classList.add('hidden');
    document.getElementById('vista-empleado').classList.remove('hidden');
    document.getElementById('respuesta-admin').classList.add('hidden');
    document.getElementById('btn-vista-admin').classList.remove('hidden');
    renderEmpleado();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('btn-vista-admin').addEventListener('click', mostrarVistaAdmin);
document.getElementById('btn-vista-empleado').addEventListener('click', mostrarVistaEmpleado);

const selectTrabajador = document.getElementById('crear-trabajador');
const selectCargo = document.getElementById('crear-cargo');

selectTrabajador.addEventListener('change', () => {
    const opcion = selectTrabajador.options[selectTrabajador.selectedIndex];
    const cargo = opcion.dataset.cargo || '';
    selectCargo.value = cargo;
});

document.getElementById('crear-fecha').value = new Date().toISOString().slice(0, 10);

document.getElementById('form-crear').addEventListener('submit', evento => {
    evento.preventDefault();

    const trabajador = selectTrabajador.value;
    const cargo = selectCargo.value;
    const fecha = document.getElementById('crear-fecha').value;
    const titulo = document.getElementById('crear-titulo').value.trim();
    const motivo = document.getElementById('crear-motivo').value.trim();

    if (!trabajador || !cargo || !fecha || !titulo || !motivo) {
        alert('Completa todos los campos del incentivo.');
        return;
    }

    const nuevo = {
        id: Date.now(),
        trabajador,
        cargo,
        titulo,
        motivo,
        fecha,
        asignadoPor: 'Administración',
        estado: 'pendiente',
        respuesta: '',
        firma: '',
        fechaConfirmacion: ''
    };

    incentivos.unshift(nuevo);
    guardarIncentivos();
    renderAdmin();
    renderEmpleado();

    evento.target.reset();
    document.getElementById('crear-fecha').value = new Date().toISOString().slice(0, 10);
    alert(`Incentivo creado para ${trabajador}.`);
});

function renderAdmin() {
    const lista = document.getElementById('lista-admin');

    if (!incentivos.length) {
        lista.innerHTML = `
            <div class="empty-state compact">
                <i class='bx bx-gift'></i>
                <h3>No hay incentivos</h3>
                <p>Crea el primero desde el formulario.</p>
            </div>`;
        return;
    }

    lista.innerHTML = incentivos.map(item => `
        <article class="admin-incentivo-item">
            <div class="admin-item-main">
                <div class="admin-item-icon"><i class='bx ${item.estado === 'confirmado' ? 'bx-check-circle' : 'bx-time-five'}'></i></div>
                <div>
                    <h4>${escapeHtml(item.titulo)}</h4>
                    <p><strong>${escapeHtml(item.trabajador)}</strong> · ${escapeHtml(item.cargo)}</p>
                    <small>${formatearFecha(item.fecha)}</small>
                </div>
            </div>
            <div class="admin-item-actions">
                <span class="status ${item.estado === 'confirmado' ? 'confirmed' : 'pending'}">
                    ${item.estado === 'confirmado' ? 'Confirmado' : 'Pendiente'}
                </span>
                <button type="button" class="view-btn" data-admin-ver="${item.id}">
                    ${item.estado === 'confirmado' ? 'Ver respuesta' : 'Ver incentivo'}
                    <i class='bx bx-right-arrow-alt'></i>
                </button>
            </div>
        </article>
    `).join('');

    lista.querySelectorAll('[data-admin-ver]').forEach(boton => {
        boton.addEventListener('click', () => mostrarDetalleAdmin(Number(boton.dataset.adminVer)));
    });
}

function mostrarDetalleAdmin(id) {
    const incentivo = incentivos.find(item => item.id === id);
    if (!incentivo) return;

    document.querySelector('.admin-grid').classList.add('hidden');
    document.getElementById('respuesta-admin').classList.remove('hidden');

    document.getElementById('admin-detalle-titulo').textContent = incentivo.titulo;
    document.getElementById('admin-detalle-trabajador').textContent = incentivo.trabajador;
    document.getElementById('admin-detalle-cargo').textContent = incentivo.cargo;
    document.getElementById('admin-detalle-fecha').textContent = formatearFecha(incentivo.fecha);
    document.getElementById('admin-detalle-estado-texto').textContent = incentivo.estado === 'confirmado' ? 'Confirmado' : 'Pendiente';
    document.getElementById('admin-detalle-motivo').textContent = incentivo.motivo;

    const estado = document.getElementById('admin-detalle-estado');
    estado.textContent = incentivo.estado === 'confirmado' ? 'Confirmado' : 'Pendiente';
    estado.className = `status ${incentivo.estado === 'confirmado' ? 'confirmed' : 'pending'}`;

    const respuesta = document.getElementById('admin-detalle-respuesta');
    respuesta.textContent = incentivo.respuesta || 'El trabajador todavía no ha confirmado este incentivo.';

    const firma = document.getElementById('admin-detalle-firma');
    firma.innerHTML = incentivo.firma
        ? `<img src="${incentivo.firma}" alt="Firma del trabajador">`
        : '<span>No se ha adjuntado una firma.</span>';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('btn-volver-admin-lista').addEventListener('click', () => {
    document.getElementById('respuesta-admin').classList.add('hidden');
    document.querySelector('.admin-grid').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('btn-volver').addEventListener('click', () => {
    window.location.href = '../usuario.html';
});

/* La vista administrativa se abre sola cuando quien inició sesión
   tiene el rol Administrador (ver login/login.js). ?vista=admin
   sigue funcionando como atajo manual para pruebas. */
const parametros = new URLSearchParams(window.location.search);
if (parametros.get('vista') === 'admin' || ES_ADMINISTRADOR) {
    mostrarVistaAdmin();
} else {
    renderEmpleado();
}
