// ================================
// REFERENCIAS AL DOM
// ================================

const opciones = document.querySelector(".opciones");
const contenido = document.getElementById("contenido-capacitacion");

const titulo = document.querySelector("h1");
const descripcion = document.querySelector(".descripcion");

const videosBtn = document.getElementById("videos");
const documentosBtn = document.getElementById("documentos");
const envivoBtn = document.getElementById("envivo");
const evaluacionBtn = document.getElementById("evaluacion");

const contentModal = document.getElementById("contentModal");
const modalTitle = document.getElementById("modalTitle");
const contentForm = document.getElementById("contentForm");
const closeContentModal = document.getElementById("closeContentModal");
const cancelContentModal = document.getElementById("cancelContentModal");

const groupTitulo = document.getElementById("group-titulo");
const groupDescripcion = document.getElementById("group-descripcion");
const groupFechaHora = document.getElementById("group-fecha-hora");
const labelEnlace = document.getElementById("label-enlace");

const inputTitulo = document.getElementById("content-titulo");
const inputDescripcion = document.getElementById("content-descripcion");
const inputFecha = document.getElementById("content-fecha");
const inputHour = document.getElementById("content-hour");
const inputMinute = document.getElementById("content-minute");
const inputAmpm = document.getElementById("content-ampm");
const inputEnlace = document.getElementById("content-enlace");

let currentType = null; // "videos" | "documentos" | "envivo" | "evaluacion"
let editingId = null;


// ================================
// DATOS: guardar / cargar por tipo
// ================================

const STORAGE_KEYS = {
    videos: "capacitacionVideos",
    documentos: "capacitacionDocumentos",
    envivo: "capacitacionEnVivo",
    evaluacion: "capacitacionEvaluaciones"
};

function loadItems(type) {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS[type]);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error("No se pudieron leer los datos guardados:", error);
        return [];
    }
}

function saveItems(type, items) {
    try {
        localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(items));
    } catch (error) {
        console.error("No se pudieron guardar los datos:", error);
    }
}

function parseTime12(time = "") {
    const raw=String(time).trim();
    let m=raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if(m) return {hour:String(Number(m[1])).padStart(2,"0"),minute:m[2],ampm:m[3].toUpperCase()};
    m=raw.match(/^(\d{1,2}):(\d{2})$/);
    if(m){let h=Number(m[1]);const ampm=h>=12?"PM":"AM";h=h%12||12;return {hour:String(h).padStart(2,"0"),minute:m[2],ampm};}
    return {hour:"",minute:"",ampm:""};
}
function formatTime12(time="") { const t=parseTime12(time); return t.hour&&t.minute&&t.ampm ? `${t.hour}:${t.minute} ${t.ampm}` : time||""; }
function setContentTime(time="") { const t=parseTime12(time); inputHour.value=t.hour; inputMinute.value=t.minute; inputAmpm.value=t.ampm; }
function getContentTime() { if(!inputHour.value||!inputMinute.value||!inputAmpm.value) return ""; return `${inputHour.value}:${inputMinute.value} ${inputAmpm.value}`; }

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
}

function getYouTubeThumbnail(url) {
    try {
        const parsed = new URL(url);
        let id = "";

        if (parsed.hostname.includes("youtu.be")) {
            id = parsed.pathname.replace("/", "").split("/")[0];
        } else if (parsed.hostname.includes("youtube.com")) {
            id = parsed.searchParams.get("v") || "";
            if (!id && parsed.pathname.includes("/shorts/")) {
                id = parsed.pathname.split("/shorts/")[1].split("/")[0];
            }
            if (!id && parsed.pathname.includes("/embed/")) {
                id = parsed.pathname.split("/embed/")[1].split("/")[0];
            }
        }

        return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    } catch {
        return null;
    }
}

function actionButtons(type, id) {
    return `
        <div class="contenido-actions">
            <button class="btn-editar" type="button" onclick="editarContenido('${type}', '${id}')">
                <i class='bx bx-edit'></i> Editar
            </button>
            <button class="btn-eliminar" type="button" onclick="eliminarContenido('${type}', '${id}')">
                <i class='bx bx-trash'></i> Eliminar
            </button>
        </div>`;
}


// ================================
// VISTAS: Videos / Documentos / En Vivo
// ================================

const SECCIONES = {
    videos: { icono: "🎥", nombre: "Videos" },
    documentos: { icono: "📄", nombre: "Documentos" },
    envivo: { icono: "🔴", nombre: "En Vivo" }
};

function mostrarSeccion(type) {
    opciones.style.display = "none";
    titulo.style.display = "none";
    descripcion.style.display = "none";
    contenido.style.display = "block";

    if (type === "evaluacion") {
        renderEvaluacion();
    } else {
        renderSeccion(type);
    }
}

function renderSeccion(type) {
    const info = SECCIONES[type];

    contenido.innerHTML = `
        <button class="volver" onclick="volverInicio()">← Volver</button>

        <div class="contenido-header">
            <h2>${info.icono} ${info.nombre}</h2>
            <button class="btn-agregar" id="btn-agregar-${type}">+ Agregar</button>
        </div>

        <div class="lista-contenido" id="lista-${type}"></div>
    `;

    document
        .getElementById(`btn-agregar-${type}`)
        .addEventListener("click", () => openContentModal(type));

    renderItems(type);
}

function renderItems(type) {
    const items = loadItems(type);
    const lista = document.getElementById(`lista-${type}`);

    if (items.length === 0) {
        lista.innerHTML = `<p class="sin-contenido">Aún no hay contenido agregado.</p>`;
        return;
    }

    lista.innerHTML = items
        .slice()
        .reverse() // lo más reciente primero
        .map(item => {
            const thumbnail = (type === "videos" || type === "envivo") ? getYouTubeThumbnail(item.enlace) : null;
            return `
            <div class="contenido-item">
                ${thumbnail ? `<a href="${escapeHtml(item.enlace)}" target="_blank" rel="noopener noreferrer" class="video-thumbnail"><img src="${thumbnail}" alt="Miniatura de ${escapeHtml(item.titulo)}" loading="lazy"><span class="play-overlay"><i class='bx bx-play'></i></span>${type === "envivo" ? `<span class="live-badge">EN VIVO</span>` : ""}</a>` : (type === "videos" || type === "envivo") ? `<div class="video-thumbnail video-placeholder"><i class='bx ${type === "envivo" ? "bx-broadcast" : "bx-video"}'></i>${type === "envivo" ? `<span class="live-badge">EN VIVO</span>` : ""}</div>` : ""}
                <div class="contenido-item-body">
                    <h3>${escapeHtml(item.titulo)}</h3>
                    ${item.descripcion ? `<p>${escapeHtml(item.descripcion)}</p>` : ""}
                    ${type === "envivo" && item.fecha ? `<p class="meta">📅 ${item.fecha}${item.hora ? " · " + formatTime12(item.hora) : ""}</p>` : ""}
                    <a href="${escapeHtml(item.enlace)}" target="_blank" rel="noopener noreferrer" class="enlace-item">Abrir enlace →</a>
                    ${actionButtons(type, item.id)}
                </div>
            </div>`;
        })
        .join("");
}


// ================================
// VISTA: Evaluación
// ================================

function renderEvaluacion() {
    const evaluaciones = loadItems("evaluacion")
        .slice()
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const actual = evaluaciones[0];
    const anteriores = evaluaciones.slice(1);

    contenido.innerHTML = `
        <button class="volver" onclick="volverInicio()">← Volver</button>

        <div class="contenido-header">
            <h2>📝 Evaluación</h2>
            <button class="btn-agregar" id="btn-agregar-evaluacion">+ Nueva evaluación</button>
        </div>

        ${actual ? `
            <div class="evaluacion-actual">
                <span class="etiqueta-actual">Evaluación actual</span>
                <p class="meta">Publicada el ${formatearFecha(actual.fecha)}</p>
                <a href="${escapeHtml(actual.enlace)}" target="_blank" rel="noopener noreferrer" class="btn-ir-evaluacion">Ir a la evaluación →</a>
                ${actionButtons("evaluacion", actual.id)}
            </div>
        ` : `<p class="sin-contenido">Aún no se ha publicado ninguna evaluación.</p>`}

        ${anteriores.length > 0 ? `
            <h3 class="subtitulo-historial">Evaluaciones anteriores</h3>
            <div class="lista-contenido">
                ${anteriores.map(ev => `
                    <div class="contenido-item">
                        <p class="meta">Publicada el ${formatearFecha(ev.fecha)}</p>
                        <a href="${escapeHtml(ev.enlace)}" target="_blank" rel="noopener noreferrer" class="enlace-item">Abrir enlace →</a>
                        ${actionButtons("evaluacion", ev.id)}
                    </div>
                `).join("")}
            </div>
        ` : ""}
    `;

    document
        .getElementById("btn-agregar-evaluacion")
        .addEventListener("click", () => openContentModal("evaluacion"));
}

function formatearFecha(iso) {
    const fecha = new Date(iso);
    return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}


// ================================
// MODAL GENÉRICO (mismo comportamiento que el del calendario)
// ================================

function openContentModal(type, item = null) {
    currentType = type;
    editingId = item ? item.id : null;
    contentForm.reset();

    const titulos = {
        videos: "Agregar video",
        documentos: "Agregar documento",
        envivo: "Agregar sesión en vivo",
        evaluacion: "Publicar nueva evaluación"
    };
    modalTitle.textContent = item ? titulos[type].replace("Agregar video", "Editar video").replace("Agregar documento", "Editar documento").replace("Agregar sesión en vivo", "Editar sesión en vivo").replace("Publicar nueva evaluación", "Editar evaluación") : titulos[type];

    const esEvaluacion = type === "evaluacion";

    // Mostrar/ocultar campos según el tipo de contenido
    groupTitulo.style.display = esEvaluacion ? "none" : "flex";
    groupDescripcion.style.display = esEvaluacion ? "none" : "flex";
    groupFechaHora.style.display = type === "envivo" ? "flex" : "none";

    labelEnlace.textContent = esEvaluacion
        ? "Enlace del formulario (Google Forms)"
        : "Enlace";
    inputEnlace.placeholder = esEvaluacion
        ? "https://forms.google.com/..."
        : "https://...";

    // Validación requerida según el tipo
    inputTitulo.required = !esEvaluacion;
    inputEnlace.required = true;
    inputFecha.required = type === "envivo";
    inputHour.required = type === "envivo";
    inputMinute.required = type === "envivo";
    inputAmpm.required = type === "envivo";

    if (item) {
        inputTitulo.value = item.titulo || "";
        inputDescripcion.value = item.descripcion || "";
        inputFecha.value = item.fecha || "";
        setContentTime(item.hora || "");
        inputEnlace.value = item.enlace || "";
    }

    contentModal.classList.add("active");
    (esEvaluacion ? inputEnlace : inputTitulo).focus();
}

function closeModalContent() {
    contentModal.classList.remove("active");
    contentForm.reset();
    currentType = null;
    editingId = null;
}

closeContentModal.addEventListener("click", closeModalContent);
cancelContentModal.addEventListener("click", closeModalContent);

// Cerrar al hacer clic fuera de la ventana del modal
contentModal.addEventListener("click", (e) => {
    if (e.target === contentModal) {
        closeModalContent();
    }
});

// Cerrar con la tecla Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && contentModal.classList.contains("active")) {
        closeModalContent();
    }
});


// ================================
// GUARDAR CONTENIDO NUEVO
// ================================

contentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!currentType) return;

    const items = loadItems(currentType);
    const index = editingId ? items.findIndex(item => item.id === editingId) : -1;

    if (currentType === "evaluacion") {
        const evaluacion = {
            id: editingId || Date.now().toString(),
            enlace: inputEnlace.value.trim(),
            fecha: index >= 0 ? items[index].fecha : new Date().toISOString()
        };

        if (index >= 0) items[index] = evaluacion;
        else items.push(evaluacion);

        saveItems("evaluacion", items);
        closeModalContent();
        renderEvaluacion();
        return;
    }

    const item = {
        id: editingId || Date.now().toString(),
        titulo: inputTitulo.value.trim(),
        descripcion: inputDescripcion.value.trim(),
        enlace: inputEnlace.value.trim()
    };

    if (currentType === "envivo") {
        item.fecha = inputFecha.value;
        item.hora = getContentTime();
    }

    if (index >= 0) items[index] = item;
    else items.push(item);

    saveItems(currentType, items);
    const tipoGuardado = currentType;
    closeModalContent();
    renderSeccion(tipoGuardado);
});

function editarContenido(type, id) {
    const item = loadItems(type).find(item => item.id === id);
    if (!item) return;
    openContentModal(type, item);
}

function eliminarContenido(type, id) {
    const item = loadItems(type).find(item => item.id === id);
    if (!item) return;

    const nombre = item.titulo || "esta evaluación";
    if (!confirm(`¿Seguro que deseas eliminar "${nombre}"?\n\nEsta acción no se puede deshacer.`)) return;

    const items = loadItems(type).filter(item => item.id !== id);
    saveItems(type, items);

    if (type === "evaluacion") renderEvaluacion();
    else renderSeccion(type);
}



// ================================
// NAVEGACIÓN PRINCIPAL
// ================================

videosBtn.addEventListener("click", () => mostrarSeccion("videos"));
documentosBtn.addEventListener("click", () => mostrarSeccion("documentos"));
envivoBtn.addEventListener("click", () => mostrarSeccion("envivo"));
evaluacionBtn.addEventListener("click", () => mostrarSeccion("evaluacion"));

function volverInicio() {
    contenido.style.display = "none";
    opciones.style.display = "grid";
    titulo.style.display = "block";
    descripcion.style.display = "block";
}
