/* =====================================================
   SALUD OCUPACIONAL
   Prototipo: datos guardados en localStorage.
   La conexión con usuarios reales/notificaciones puede
   ser reemplazada posteriormente por el backend.
===================================================== */

const STORAGE_KEY = 'talentsoft_salud_ocupacional';

// Traduce el rol de quien inició sesión (ver login/login.js) al
// formato que usan los destinatarios de este módulo. Si no hay
// sesión detectada, se asume "empleados" como dato de demostración.
const MAPA_ROLES = {
    Empleado: 'empleados',
    Jefe: 'jefes',
    Entrevistador: 'entrevistadores',
    Administrador: 'empleados'
};
const sesionActual = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
const ROL_USUARIO_ACTUAL = sesionActual ? (MAPA_ROLES[sesionActual.role] || 'empleados') : 'empleados';
const ES_ADMINISTRADOR = sesionActual ? sesionActual.role === 'Administrador' : false;

const datosIniciales = [
    {
        id: 1,
        asunto: 'Pausas activas durante la jornada',
        descripcion: 'Realiza pausas activas durante la jornada laboral para disminuir la fatiga y favorecer el bienestar físico.',
        fecha: '2026-08-23',
        destinatarios: ['todos'],
        pdfName: 'Ejercicios_pausas_activas.pdf',
        pdfData: ''
    }
];

let materiales = cargarMateriales();
let materialSeleccionado = null;

const vistaEmpleado = document.getElementById('vista-empleado');
const vistaAdmin = document.getElementById('vista-admin');
const detalle = document.getElementById('detalle-material');
const listaMateriales = document.getElementById('lista-materiales');
const listaAdmin = document.getElementById('lista-admin');
const estadoVacio = document.getElementById('estado-vacio');
const form = document.getElementById('form-material');
const fecha = document.getElementById('fecha');
const destinatariosToggle = document.getElementById('destinatarios-toggle');
const destinatariosPanel = document.getElementById('destinatarios-panel');
const destinatariosResumen = document.getElementById('destinatarios-resumen');
const destinatariosChecks = [...document.querySelectorAll('input[name="destinatario"]')];

function cargarMateriales() {
    const guardados = localStorage.getItem(STORAGE_KEY);
    if (guardados) {
        try { return JSON.parse(guardados); } catch (_) {}
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datosIniciales));
    return [...datosIniciales];
}

function guardar() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materiales));
}

function formatearFecha(value) {
    if (!value) return 'Sin fecha';
    return new Date(value + 'T00:00:00').toLocaleDateString('es-CO', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
}

function esc(value = '') {
    return String(value).replace(/[&<>'"]/g, c => ({
        '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
    }[c]));
}

function normalizarDestinatarios(values) {
    if (values.includes('todos')) return ['todos'];
    return [...new Set(values)];
}

function destinatariosTexto(values) {
    const map = {
        todos: 'Todos los empleados',
        empleados: 'Empleados',
        jefes: 'Jefes',
        entrevistadores: 'Entrevistadores'
    };
    return values.map(v => map[v] || v).join(', ');
}

function esVisibleParaEmpleado(material) {
    return material.destinatarios.includes('todos') || material.destinatarios.includes(ROL_USUARIO_ACTUAL);
}

function actualizarDestinatariosUI() {
    const seleccionados = destinatariosChecks.filter(check => check.checked).map(check => check.value);
    destinatariosResumen.textContent = seleccionados.length ? destinatariosTexto(seleccionados) : 'Seleccionar destinatarios';
}

destinatariosToggle.addEventListener('click', () => {
    const ahoraCerrado = destinatariosPanel.classList.toggle('hidden');
    destinatariosToggle.setAttribute('aria-expanded', String(!ahoraCerrado));
    destinatariosToggle.classList.toggle('open', !ahoraCerrado);
});

destinatariosChecks.forEach(check => {
    check.addEventListener('change', () => {
        if (check.value === 'todos' && check.checked) {
            destinatariosChecks.forEach(other => { if (other.value !== 'todos') other.checked = false; });
        } else if (check.value !== 'todos' && check.checked) {
            const todos = destinatariosChecks.find(other => other.value === 'todos');
            if (todos) todos.checked = false;
        }
        actualizarDestinatariosUI();
    });
});

actualizarDestinatariosUI();

function mostrarVista(tipo) {
    vistaEmpleado.classList.toggle('hidden', tipo !== 'empleado');
    vistaAdmin.classList.toggle('hidden', tipo !== 'admin');
    detalle.classList.add('hidden');

    if (tipo === 'empleado') renderEmpleado();
    else renderAdmin();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderEmpleado() {
    const propios = materiales.filter(esVisibleParaEmpleado);
    document.getElementById('contador-materiales').textContent = `${propios.length} ${propios.length === 1 ? 'material' : 'materiales'}`;

    if (!propios.length) {
        listaMateriales.innerHTML = '';
        estadoVacio.classList.remove('hidden');
        return;
    }

    estadoVacio.classList.add('hidden');
    listaMateriales.innerHTML = propios.map(material => `
        <article class="material-card">
            <div class="card-icon"><i class='bx bx-plus-medical'></i></div>
            <div class="card-content">
                <h3>${esc(material.asunto)}</h3>
                <p>${esc(material.descripcion)}</p>
                <small>${formatearFecha(material.fecha)} · ${esc(material.pdfName)}</small>
            </div>
            <button type="button" class="view-btn" data-ver-material="${material.id}">
                Ver material <i class='bx bx-right-arrow-alt'></i>
            </button>
        </article>
    `).join('');

    listaMateriales.querySelectorAll('[data-ver-material]').forEach(button => {
        button.addEventListener('click', () => mostrarDetalle(Number(button.dataset.verMaterial)));
    });
}

function renderAdmin() {
    if (!materiales.length) {
        listaAdmin.innerHTML = '<div class="empty-state"><i class="bx bx-file"></i><h3>No hay materiales publicados</h3><p>Crea el primero desde el formulario.</p></div>';
        return;
    }

    listaAdmin.innerHTML = materiales.map(material => `
        <article class="admin-item">
            <div>
                <h4>${esc(material.asunto)}</h4>
                <p>${formatearFecha(material.fecha)} · ${esc(destinatariosTexto(material.destinatarios))}</p>
                <small>${esc(material.pdfName)}</small>
            </div>
            <div class="admin-actions">
                <span class="status published">Publicado</span>
                <button type="button" class="secondary-btn" data-admin-ver="${material.id}">Ver</button>
                <button type="button" class="secondary-btn" data-eliminar="${material.id}">Eliminar</button>
            </div>
        </article>
    `).join('');

    listaAdmin.querySelectorAll('[data-admin-ver]').forEach(button => {
        button.addEventListener('click', () => mostrarDetalle(Number(button.dataset.adminVer), true));
    });

    listaAdmin.querySelectorAll('[data-eliminar]').forEach(button => {
        button.addEventListener('click', () => eliminarMaterial(Number(button.dataset.eliminar)));
    });
}

function mostrarDetalle(id, desdeAdmin = false) {
    const material = materiales.find(item => item.id === id);
    if (!material) return;

    materialSeleccionado = material;
    vistaEmpleado.classList.add('hidden');
    vistaAdmin.classList.add('hidden');
    detalle.classList.remove('hidden');

    document.getElementById('detalle-asunto').textContent = material.asunto;
    document.getElementById('detalle-fecha').textContent = formatearFecha(material.fecha);
    document.getElementById('detalle-destinatarios').textContent = destinatariosTexto(material.destinatarios);
    document.getElementById('detalle-descripcion').textContent = material.descripcion;
    document.getElementById('detalle-pdf').textContent = material.pdfName;

    const btnVer = document.getElementById('btn-ver-pdf');
    const btnDescargar = document.getElementById('btn-descargar-pdf');

    if (material.pdfData) {
        btnVer.classList.remove('hidden');
        btnDescargar.classList.remove('hidden');
        btnVer.onclick = () => window.open(material.pdfData, '_blank', 'noopener');
        btnDescargar.onclick = () => {
            const enlace = document.createElement('a');
            enlace.href = material.pdfData;
            enlace.download = material.pdfName;
            enlace.click();
        };
    } else {
        btnVer.classList.add('hidden');
        btnDescargar.classList.add('hidden');
    }

    detalle.dataset.returnView = desdeAdmin ? 'admin' : 'empleado';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function eliminarMaterial(id) {
    if (!confirm('¿Eliminar este material?')) return;
    materiales = materiales.filter(item => item.id !== id);
    guardar();
    renderAdmin();
}

document.getElementById('btn-vista-admin').addEventListener('click', () => mostrarVista('admin'));
document.getElementById('btn-vista-empleado').addEventListener('click', () => mostrarVista('empleado'));
document.getElementById('btn-volver').addEventListener('click', () => {
    window.location.href = '../usuario.html';
});
document.getElementById('btn-volver-lista').addEventListener('click', () => {
    mostrarVista(detalle.dataset.returnView || 'empleado');
});

form.addEventListener('submit', event => {
    event.preventDefault();

    const file = document.getElementById('pdf').files[0];
    const selected = destinatariosChecks.filter(check => check.checked).map(check => check.value);

    if (!file || file.type !== 'application/pdf') {
        alert('Selecciona un archivo PDF.');
        return;
    }

    if (!selected.length) {
        alert('Selecciona al menos un destinatario.');
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        materiales.unshift({
            id: Date.now(),
            asunto: document.getElementById('asunto').value.trim(),
            descripcion: document.getElementById('descripcion').value.trim(),
            fecha: fecha.value,
            destinatarios: normalizarDestinatarios(selected),
            pdfName: file.name,
            pdfData: reader.result
        });

        guardar();
        form.reset();
        destinatariosChecks.forEach(check => { check.checked = check.value === 'todos'; });
        actualizarDestinatariosUI();
        destinatariosPanel.classList.add('hidden');
        destinatariosToggle.classList.remove('open');
        destinatariosToggle.setAttribute('aria-expanded', 'false');
        fecha.value = new Date().toISOString().slice(0, 10);
        renderAdmin();
        alert('Material publicado correctamente.');
    };

    reader.readAsDataURL(file);
});

// Mantiene el comportamiento del menú lateral del sistema si style.css usa la clase "close".
const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.querySelector('.toggle-btn');
if (sidebar && toggleBtn) {
    toggleBtn.addEventListener('click', () => sidebar.classList.toggle('close'));
}

fecha.value = new Date().toISOString().slice(0, 10);
// Los administradores entran directo a la vista de gestión;
// el resto ve primero los materiales dirigidos a su rol.
mostrarVista(ES_ADMINISTRADOR ? 'admin' : 'empleado');
