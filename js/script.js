/* =========================================================
   TALENTSOFT · RECLUTAMIENTO
   Script único compartido por todas las páginas. Cada módulo
   se inicializa solo si encuentra sus elementos en el DOM, así
   este mismo archivo funciona en las 6 páginas sin errores.
   ========================================================= */

/* ---------------------------------------------------------
   1. DATOS COMPARTIDOS
   Fuente única de candidatos: así el Banco de Candidatos, el
   Pipeline y la Evaluación Técnica muestran siempre la misma
   información y se pueden enlazar entre sí por "id".
   --------------------------------------------------------- */
const CANDIDATES = [
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
        phone: '+57 300 111 2233',
        location: 'Bogotá, Colombia',
        availability: '15 días',
        role: 'Operaria de Fileteadora',
        match: null,
        about: 'Operaria en formación con 2 años de experiencia en fileteadora y collarín. Buena disposición para el trabajo en equipo y aprendizaje de nuevas técnicas.'
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
        phone: '+57 310 222 3344',
        location: 'Soacha, Cundinamarca',
        availability: 'Inmediata',
        role: 'Mecánico de Maquinaria',
        match: null,
        about: 'Técnico con 5 años de experiencia en mantenimiento preventivo y correctivo de maquinaria industrial de confección.'
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
        phone: '+57 320 333 4455',
        location: 'Bogotá, Colombia',
        availability: 'Contratada',
        role: 'Operaria de Máquina Plana',
        match: null,
        about: 'Operaria senior con 8 años de experiencia. Referente del equipo en trazado y control de calidad de acabados.'
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
        phone: '+57 315 444 5566',
        location: 'Bogotá, Colombia',
        availability: 'Inmediata',
        role: 'Operario de Máquina Plana',
        match: null,
        about: 'Operario con 5 años de experiencia en máquina plana, recién postulado a la vacante activa.'
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
        phone: '+57 320 123 4567',
        location: 'Bogotá, Colombia',
        availability: 'Inmediata',
        role: 'Operaria de Máquina Plana',
        match: 41,
        evalStatus: 'rechazado',
        about: 'Operaria con más de 5 años de experiencia en el sector textil, especializada en el manejo de máquina plana y fileteadora. Alto nivel de atención al detalle y control de calidad en acabados. Capacidad probada para trabajar bajo presión y cumplir con cuotas de producción manteniendo altos estándares.'
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
        phone: '+57 301 555 6677',
        location: 'Soacha, Cundinamarca',
        availability: 'Inmediata',
        role: 'Operario de Máquina Plana',
        match: 92,
        evalStatus: 'aceptado',
        about: 'Operario con 6 años de experiencia, incluyendo labores de corte y trazo. Excelente desempeño en la prueba práctica y buen manejo de tiempos de producción.'
    }
];

const STATUS_LABEL = {
    proceso: 'En Proceso',
    disponible: 'Disponible',
    contratado: 'Contratado'
};

function getCandidateById(id) {
    return CANDIDATES.find(c => c.id === id) || null;
}

function showToast(message, icon = 'bx-check-circle') {
    let toast = document.querySelector('.ts-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'ts-toast';
        toast.innerHTML = `<i class='bx ${icon}'></i><span class="ts-toast-text"></span>`;
        document.body.appendChild(toast);
    }
    toast.querySelector('.ts-toast-text').textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ---------------------------------------------------------
   2. SIDEBAR: toggle, modo claro/oscuro y enlace activo
   --------------------------------------------------------- */
function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.toggle-btn');
    if (!sidebar || !toggleBtn) return;

    if (localStorage.getItem('ts-sidebar-open') === '1') {
        sidebar.classList.add('active');
    }

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        localStorage.setItem('ts-sidebar-open', sidebar.classList.contains('active') ? '1' : '0');
    });

    const modeBtn = document.querySelector('.sidebar .mode');
    const modeText = document.querySelector('.mode-text');

    const applyTheme = (light) => {
        document.body.classList.toggle('light-mode', light);
        if (modeText) modeText.innerText = light ? 'Modo oscuro' : 'Modo claro';
    };

    applyTheme(localStorage.getItem('ts-theme') === 'light');

    if (modeBtn) {
        modeBtn.addEventListener('click', () => {
            const nowLight = !document.body.classList.contains('light-mode');
            applyTheme(nowLight);
            localStorage.setItem('ts-theme', nowLight ? 'light' : 'dark');
        });
    }

    // Marca como activo el item del menú que corresponde a la página actual.
    // data-page puede traer varias páginas separadas por coma (ej: el ítem
    // "Reclutamiento" queda activo en las 5 pantallas del módulo).
    const currentPage = document.body.dataset.page;
    if (currentPage) {
        document.querySelectorAll('.list .list-item[data-page]').forEach(item => {
            const pages = item.dataset.page.split(',');
            item.classList.toggle('active', pages.includes(currentPage));
        });
    }
}

/* ---------------------------------------------------------
   2.1 SESIÓN: quién inició sesión y "Cerrar sesión"
   --------------------------------------------------------- */
function getCurrentUser() {
    const source = localStorage.getItem('ts-auth') === '1' ? localStorage : sessionStorage;
    if (source.getItem('ts-auth') !== '1') return null;
    return {
        email: source.getItem('ts-user-email') || '',
        name: source.getItem('ts-user-name') || 'Usuario',
        role: source.getItem('ts-user-role') || 'Empleado'
    };
}

function initSession() {
    const logoutLink = document.querySelector('.sidebar .bottom-content a');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            ['ts-auth', 'ts-user-email', 'ts-user-name', 'ts-user-role'].forEach(key => {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            });
            const loginPath = document.body.dataset.login || 'login/login.html';
            window.location.href = loginPath;
        });
    }
}

/* ---------------------------------------------------------
   2.2 MÓDULO USUARIO: muestra los datos de quien inició sesión
   --------------------------------------------------------- */
function initUsuario() {
    const nameEl = document.getElementById('admin-name');
    const roleEl = document.getElementById('admin-role');
    if (!nameEl || !roleEl) return;

    const user = getCurrentUser();
    if (user) {
        nameEl.textContent = user.name;
        roleEl.textContent = user.role;
    }
}

/* ---------------------------------------------------------
   3. BANCO DE CANDIDATOS: tabla, búsqueda, filtros, exportar
   --------------------------------------------------------- */
function initBancoCandidatos() {
    const tbody = document.querySelector('.candidates-table tbody');
    if (!tbody) return;

    const searchInput = document.querySelector('.filter-bar .search-input');
    const skillSelect = document.querySelectorAll('.filter-bar .filter-select')[0];
    const statusSelect = document.querySelectorAll('.filter-bar .filter-select')[1];
    const exportBtn = document.getElementById('btnExportar');

    const rowsData = CANDIDATES.map(c => ({ c, row: buildBancoRow(c) }));
    tbody.innerHTML = '';
    rowsData.forEach(({ row }) => tbody.appendChild(row));

    function buildBancoRow(c) {
        const tr = document.createElement('tr');
        tr.dataset.id = c.id;
        tr.dataset.status = c.status;
        tr.dataset.skills = c.skills.toLowerCase();
        tr.innerHTML = `
            <td>
                <div class="c-profile">
                    <div class="c-avatar" style="background:${c.avatarBg}; color:${c.avatarColor};">${c.initials}</div>
                    <div class="c-info">
                        <h4>${c.name}</h4>
                        <p>${c.email}</p>
                    </div>
                </div>
            </td>
            <td class="c-text">${c.skills}</td>
            <td class="c-text">${c.experience}</td>
            <td><span class="badge badge-${c.status === 'proceso' ? 'process' : c.status}">${STATUS_LABEL[c.status]}</span></td>
            <td>
                <div class="table-actions">
                    <a class="action-btn" title="Ver Perfil" href="evaluacion_tecnica.html?candidato=${c.id}"><i class="bx bx-show"></i></a>
                    <button class="action-btn" title="Descargar CV" data-download="${c.id}"><i class="bx bx-download"></i></button>
                </div>
            </td>
        `;
        return tr;
    }

    function applyFilters() {
        const term = (searchInput?.value || '').trim().toLowerCase();
        const skill = skillSelect?.value || 'todos';
        const status = statusSelect?.value || 'todos';
        let visibleCount = 0;

        tbody.querySelectorAll('tr').forEach(tr => {
            const name = tr.querySelector('h4')?.textContent.toLowerCase() || '';
            const email = tr.querySelector('.c-info p')?.textContent.toLowerCase() || '';
            const matchesTerm = !term || name.includes(term) || email.includes(term);
            const matchesSkill = skill === 'todos' || tr.dataset.skills.includes(skillLabel(skill));
            const matchesStatus = status === 'todos' || tr.dataset.status === statusKey(status);
            const visible = matchesTerm && matchesSkill && matchesStatus;
            tr.classList.toggle('hidden-row', !visible);
            if (visible) visibleCount++;
        });

        toggleEmptyState(visibleCount);
    }

    function skillLabel(value) {
        const map = { plana: 'máquina plana', fileteadora: 'fileteadora', calidad: 'calidad' };
        return (map[value] || value).toLowerCase();
    }

    function statusKey(value) {
        const map = { disponible: 'disponible', proceso: 'proceso', contratado: 'contratado' };
        return map[value] || value;
    }

    function toggleEmptyState(visibleCount) {
        let emptyRow = tbody.querySelector('.no-results-row');
        if (visibleCount === 0) {
            if (!emptyRow) {
                emptyRow = document.createElement('tr');
                emptyRow.className = 'no-results-row';
                emptyRow.innerHTML = `<td colspan="5" class="no-results">No se encontraron candidatos con esos filtros.</td>`;
                tbody.appendChild(emptyRow);
            }
        } else if (emptyRow) {
            emptyRow.remove();
        }
    }

    [searchInput, skillSelect, statusSelect].forEach(el => {
        el?.addEventListener('input', applyFilters);
        el?.addEventListener('change', applyFilters);
    });

    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-download]');
        if (!btn) return;
        const c = getCandidateById(btn.dataset.download);
        showToast(`Descargando CV de ${c ? c.name : 'candidato'}...`, 'bx-download');
    });

    exportBtn?.addEventListener('click', () => {
        const visibleRows = [...tbody.querySelectorAll('tr:not(.hidden-row):not(.no-results-row)')];
        const header = ['Candidato', 'Correo', 'Habilidades', 'Experiencia', 'Estado'];
        const lines = visibleRows.map(tr => {
            const c = getCandidateById(tr.dataset.id);
            return [c.name, c.email, c.skills, c.experience, STATUS_LABEL[c.status]]
                .map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
        });
        const csv = [header.join(','), ...lines].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'banco_candidatos.csv';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Datos exportados a CSV');
    });
}

/* ---------------------------------------------------------
   4. GESTIÓN DE VACANTES: búsqueda, filtro y nueva vacante
   --------------------------------------------------------- */
function initGestionVacantes() {
    const grid = document.querySelector('.vacantes-grid');
    if (!grid) return;

    const searchInput = document.querySelector('.filter-bar .search-input');
    const areaSelect = document.querySelector('.filter-bar .filter-select');
    const newBtn = document.getElementById('btnNuevaVacante');

    function applyFilters() {
        const term = (searchInput?.value || '').trim().toLowerCase();
        const area = areaSelect?.value || 'todas';
        let visible = 0;

        grid.querySelectorAll('.vacante-card').forEach(card => {
            const title = card.querySelector('.vacante-title')?.textContent.toLowerCase() || '';
            const cardArea = (card.dataset.area || '').toLowerCase();
            const matchesTerm = !term || title.includes(term);
            const matchesArea = area === 'todas' || cardArea === area;
            const show = matchesTerm && matchesArea;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
        });

        let emptyMsg = grid.querySelector('.no-results');
        if (visible === 0) {
            if (!emptyMsg) {
                emptyMsg = document.createElement('p');
                emptyMsg.className = 'no-results';
                emptyMsg.textContent = 'No hay vacantes que coincidan con tu búsqueda.';
                grid.appendChild(emptyMsg);
            }
        } else if (emptyMsg) {
            emptyMsg.remove();
        }
    }

    [searchInput, areaSelect].forEach(el => {
        el?.addEventListener('input', applyFilters);
        el?.addEventListener('change', applyFilters);
    });

    // Navega al pipeline cuando se pulsa "Ver proceso"
    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-ver-proceso]');
        if (!btn) return;
        window.location.href = `Pipeline.html?vacante=${encodeURIComponent(btn.dataset.verProceso)}`;
    });

    // Modal "Nueva Vacante"
    const overlay = document.getElementById('modalNuevaVacante');
    const form = document.getElementById('formNuevaVacante');
    const cancelBtn = document.getElementById('btnCancelarVacante');

    function openModal() { overlay?.classList.add('open'); form?.querySelector('input')?.focus(); }
    function closeModal() { overlay?.classList.remove('open'); form?.reset(); }

    newBtn?.addEventListener('click', openModal);
    cancelBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const titulo = form.querySelector('#vacanteTitulo').value.trim();
        const areaVal = form.querySelector('#vacanteArea').value;
        const areaNombres = { confeccion: 'Confección', corte: 'Corte y Trazo', calidad: 'Control de Calidad' };
        const cupos = form.querySelector('#vacanteCupos').value || '1';
        if (!titulo) return;

        const article = document.createElement('article');
        article.className = 'vacante-card is-new';
        article.dataset.area = areaVal;
        article.innerHTML = `
            <div class="card-header">
                <span class="badge badge-active">Activa</span>
                <span class="vacante-date">Hoy</span>
            </div>
            <h3 class="vacante-title">${titulo}</h3>
            <p class="vacante-area">Área: ${areaNombres[areaVal] || areaVal}</p>
            <div class="vacante-info">
                <div><span>Postulantes</span><strong>0</strong></div>
                <div><span>Vacantes</span><strong>${cupos}</strong></div>
            </div>
            <div class="card-actions">
                <button class="btn-secondary" style="width:100%;" data-ver-proceso="${titulo}">Ver proceso</button>
            </div>
        `;
        grid.prepend(article);
        closeModal();
        showToast('Vacante creada correctamente');
    });
}

/* ---------------------------------------------------------
   5. PIPELINE: tablero kanban con arrastrar y soltar
   --------------------------------------------------------- */
function initPipeline() {
    const board = document.querySelector('.kanban-board');
    if (!board) return;

    const columns = {
        nuevos: document.querySelector('[data-stage="nuevos"] .column-body'),
        evaluacion: document.querySelector('[data-stage="evaluacion"] .column-body'),
        entrevista: document.querySelector('[data-stage="entrevista"] .column-body'),
        contratados: document.querySelector('[data-stage="contratados"] .column-body')
    };

    function render() {
        Object.values(columns).forEach(col => { if (col) col.innerHTML = ''; });

        CANDIDATES.filter(c => c.pipelineStage && columns[c.pipelineStage]).forEach(c => {
            const card = document.createElement('a');
            card.href = `evaluacion_tecnica.html?candidato=${c.id}`;
            card.className = 'kanban-card' + (c.pipelineStage === 'contratados' ? ' success-card' : '');
            card.draggable = true;
            card.dataset.id = c.id;
            card.innerHTML = `
                <div class="card-avatar" style="background:${c.avatarBg}; color:${c.avatarColor};">${c.initials}</div>
                <div class="card-info">
                    <h4>${c.name}</h4>
                    ${c.match !== null
                        ? `<span class="match-badge">Perfil: ${c.match}%</span>`
                        : `<p>Exp: ${c.experience} • ${c.skills.split(',')[0]}</p>`}
                </div>
            `;
            attachDrag(card);
            columns[c.pipelineStage].appendChild(card);
        });

        updateCounts();
    }

    function updateCounts() {
        document.querySelectorAll('.kanban-column').forEach(col => {
            const stage = col.dataset.stage;
            const countEl = col.querySelector('.badge-count');
            if (countEl && columns[stage]) {
                countEl.textContent = columns[stage].children.length;
            }
        });
    }

    function attachDrag(card) {
        card.addEventListener('dragstart', () => card.classList.add('dragging'));
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
        // Evita que el navegador siga el enlace mientras se está arrastrando
        card.addEventListener('click', (e) => { if (card.classList.contains('just-dragged')) e.preventDefault(); });
    }

    document.querySelectorAll('.kanban-column').forEach(col => {
        const body = col.querySelector('.column-body');
        col.addEventListener('dragover', (e) => {
            e.preventDefault();
            col.classList.add('drag-over');
        });
        col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
        col.addEventListener('drop', (e) => {
            e.preventDefault();
            col.classList.remove('drag-over');
            const dragging = board.querySelector('.dragging');
            if (!dragging || !body) return;
            body.appendChild(dragging);
            const c = getCandidateById(dragging.dataset.id);
            if (c) c.pipelineStage = col.dataset.stage;
            dragging.classList.add('just-dragged');
            setTimeout(() => dragging.classList.remove('just-dragged'), 300);
            updateCounts();
            showToast(`${c ? c.name : 'Candidato'} movido a "${col.querySelector('h3').firstChild.textContent.trim()}"`);
        });
    });

    render();
}

/* ---------------------------------------------------------
   6. EVALUACIÓN TÉCNICA: lista de candidatos + panel detalle
   --------------------------------------------------------- */
function initEvaluacionTecnica() {
    const list = document.querySelector('.candidates-list');
    const detail = document.querySelector('.candidate-detail-section');
    if (!list || !detail) return;

    const evaluados = CANDIDATES.filter(c => c.match !== null);
    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get('candidato');

    list.innerHTML = evaluados.map(c => `
        <div class="candidate-card" data-id="${c.id}">
            <div class="candidate-avatar" style="background:${c.avatarBg}; color:${c.avatarColor};">${c.initials}</div>
            <div class="candidate-info">
                <h4>${c.name}</h4>
                <p>${c.email}</p>
                <span class="status-badge status-${c.evalStatus}">
                    <i class='bx ${c.evalStatus === 'aceptado' ? 'bx-check-circle' : 'bx-x-circle'}'></i>
                    ${c.evalStatus === 'aceptado' ? 'Aceptado' : 'Rechazado'}
                </span>
            </div>
            <div class="candidate-match ${c.match >= 70 ? 'text-green' : 'text-red'}">${c.match}%</div>
        </div>
    `).join('');

    function renderDetail(c) {
        if (!c) {
            detail.innerHTML = `
                <div class="empty-detail">
                    <i class='bx bx-user-x'></i>
                    <p>Este candidato todavía no tiene una evaluación técnica registrada.</p>
                </div>`;
            return;
        }
        detail.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">${c.initials}</div>
                <div class="profile-title">
                    <h2>${c.name}</h2>
                    <p>${c.role}</p>
                </div>
                <div class="profile-actions">
                    <button class="btn-secondary" data-action="descartar">Descartar</button>
                    <button class="btn-primary" data-action="contratar">Contratar</button>
                </div>
            </div>
            <div class="profile-info-grid">
                <div class="info-card"><span>Teléfono</span><p>${c.phone}</p></div>
                <div class="info-card"><span>Experiencia</span><p>${c.experience} en confección</p></div>
                <div class="info-card"><span>Ubicación</span><p>${c.location}</p></div>
                <div class="info-card"><span>Disponibilidad</span><p>${c.availability}</p></div>
            </div>
            <div class="profile-skills">
                <h3>Habilidades Destacadas</h3>
                <div class="skills-list">
                    ${c.skillTags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
                </div>
                <div class="profile-about">
                    <h3>Perfil Profesional</h3>
                    <p>${c.about}</p>
                </div>
            </div>
            <div class="card-actions" style="margin-top:24px;">
                <a class="btn-secondary" href="Historial_de_Procesos.html?candidato=${c.id}">
                    <i class='bx bx-history'></i> Ver historial del proceso
                </a>
            </div>
        `;

        detail.querySelector('[data-action="contratar"]').addEventListener('click', () => {
            c.status = 'contratado';
            c.pipelineStage = 'contratados';
            showToast(`${c.name} fue marcado como contratado`);
        });
        detail.querySelector('[data-action="descartar"]').addEventListener('click', () => {
            c.pipelineStage = null;
            showToast(`${c.name} fue descartado del proceso`);
        });
    }

    function selectCandidate(id) {
        const c = getCandidateById(id);
        list.querySelectorAll('.candidate-card').forEach(card => {
            card.classList.toggle('active', card.dataset.id === id);
        });
        renderDetail(c);
    }

    list.addEventListener('click', (e) => {
        const card = e.target.closest('.candidate-card');
        if (!card) return;
        selectCandidate(card.dataset.id);
    });

    const initial = evaluados.find(c => c.id === requestedId) || evaluados[0];
    if (initial) {
        selectCandidate(initial.id);
    } else {
        renderDetail(null);
    }

    // Búsqueda y filtro por estado en la lista de candidatos
    const searchInput = document.querySelector('.search-box .search-input input');
    const filterSelect = document.querySelector('.search-box .filter-input select');

    function applyFilters() {
        const term = (searchInput?.value || '').trim().toLowerCase();
        const status = filterSelect?.value || 'all';
        list.querySelectorAll('.candidate-card').forEach(card => {
            const c = getCandidateById(card.dataset.id);
            const matchesTerm = !term || c.name.toLowerCase().includes(term);
            const statusMap = { aceptados: 'aceptado', rechazados: 'rechazado', pendientes: 'pendiente' };
            const matchesStatus = status === 'all' || c.evalStatus === statusMap[status];
            card.style.display = matchesTerm && matchesStatus ? '' : 'none';
        });
    }

    searchInput?.addEventListener('input', applyFilters);
    filterSelect?.addEventListener('change', applyFilters);
}

/* ---------------------------------------------------------
   7. DASHBOARD (index.html): estadísticas rápidas
   --------------------------------------------------------- */
function initDashboard() {
    const statTotal = document.getElementById('statTotalCandidatos');
    if (!statTotal) return;

    statTotal.textContent = CANDIDATES.length;
    document.getElementById('statEnProceso').textContent =
        CANDIDATES.filter(c => c.status === 'proceso').length;
    document.getElementById('statDisponibles').textContent =
        CANDIDATES.filter(c => c.status === 'disponible').length;
    document.getElementById('statContratados').textContent =
        CANDIDATES.filter(c => c.status === 'contratado').length;
}

/* ---------------------------------------------------------
   INICIO
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initSession();
    initUsuario();
    initDashboard();
    initBancoCandidatos();
    initGestionVacantes();
    initPipeline();
    initEvaluacionTecnica();
});
