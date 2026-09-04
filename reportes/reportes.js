/* =====================================================
   MÓDULO REPORTES E INDICADORES ESTADÍSTICOS

   No hay backend ni base de datos real todavía, así que los
   números de aquí son de EJEMPLO (coherentes entre sí, pero
   no vienen de asistencia.js ni de datos-empleados.js). El
   día que haya datos reales, solo hay que reemplazar
   DATOS_REPORTES por lo que devuelva el servidor; el resto
   del archivo (gráficas, filtros, export) no cambia.
===================================================== */

const MESES_LABEL = ['Ene', 'Feb', 'Mar', 'Abr', 'May'];
const MESES_VALUE = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05'];

/* Evolución mensual de ausentismo: "proyección" es un estimado
   de cómo habría seguido subiendo/bajando el ausentismo SIN
   un sistema de gestión (dato hipotético, no medido); "real"
   es el dato con Talentsoft ya en uso. */
const AUSENTISMO = {
    proyeccion: [14, 13, 12, 11.2, 10.5],
    real: [14, 10.5, 7.8, 5.6, 4.1],
    meta: 5
};

/* Indicadores generales por mes (vista "Todos" los talleres). */
const KPI_POR_MES = [
    { horasRetardo: 31.2, productividad: 84.1, novedades: 15, justificadas: 9 },
    { horasRetardo: 29.6, productividad: 85.4, novedades: 14, justificadas: 10 },
    { horasRetardo: 28.9, productividad: 86.7, novedades: 16, justificadas: 11 },
    { horasRetardo: 27.1, productividad: 87.5, novedades: 17, justificadas: 12 },
    { horasRetardo: 27.8, productividad: 88.8, novedades: 18, justificadas: 12 }
];

/* Multiplicador ilustrativo por taller: al no tener datos reales
   separados por taller, se usa para que los filtros "Taller A/B/C"
   se sientan interactivos y muestren variación creíble. */
const MULTIPLICADOR_TALLER = {
    todos: 1,
    tallerA: 0.85,
    tallerB: 1.18,
    tallerC: 0.97
};

/* Productividad y horas de retardo por línea de confección
   (mes de referencia; se ajustan con el multiplicador del taller). */
const LINEAS_BASE = [
    { nombre: 'Camisas', productividad: 89, retardo: 5.2 },
    { nombre: 'Pantalones', productividad: 85, retardo: 6.1 },
    { nombre: 'Deportiva', productividad: 93, retardo: 4.0 },
    { nombre: 'Ropa Interior', productividad: 79, retardo: 9.4 },
    { nombre: 'Uniformes', productividad: 87, retardo: 3.1 }
];

/* =====================================================
   ESTADO DE LOS FILTROS
===================================================== */

const estado = {
    mesIndex: MESES_VALUE.length - 1, // Mayo por defecto, igual que el prototipo
    taller: 'todos'
};


/* =====================================================
   UTILIDADES
===================================================== */

function fmt(numero, decimales = 1) {
    return numero.toLocaleString('es-CO', {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales
    });
}

function crearSVG(viewBox) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', viewBox);
    return svg;
}

function el(tag, attrs, texto) {
    const ns = 'http://www.w3.org/2000/svg';
    const node = document.createElementNS(ns, tag);
    Object.keys(attrs || {}).forEach(k => node.setAttribute(k, attrs[k]));
    if (texto !== undefined) node.textContent = texto;
    return node;
}


/* =====================================================
   TARJETAS KPI
===================================================== */

function renderKPIs() {

    const mult = MULTIPLICADOR_TALLER[estado.taller];
    const mesActual = KPI_POR_MES[estado.mesIndex];
    const mesAnterior = KPI_POR_MES[estado.mesIndex - 1] || mesActual;

    const ausentismoMes = AUSENTISMO.real[estado.mesIndex] * mult;
    const ausentismoAnterior = AUSENTISMO.real[Math.max(0, estado.mesIndex - 1)] * mult;
    const cambioAusentismo = ausentismoAnterior
        ? ((ausentismoMes - ausentismoAnterior) / ausentismoAnterior) * 100
        : 0;

    const horasRetardo = mesActual.horasRetardo * mult;
    const cambioHoras = horasRetardo - (mesAnterior.horasRetardo * mult);

    const productividad = Math.min(99, mesActual.productividad * (2 - mult));
    const cambioProductividad = productividad - Math.min(99, mesAnterior.productividad * (2 - mult));

    const novedades = Math.round(mesActual.novedades * mult);
    const justificadas = Math.min(novedades, Math.round(mesActual.justificadas * mult));

    document.getElementById('kpi-ausentismo').textContent = `${fmt(ausentismoMes)}%`;
    document.getElementById('kpi-ausentismo-trend').innerHTML =
        tendencia(cambioAusentismo, true, `vs ${estado.mesIndex > 0 ? MESES_LABEL[estado.mesIndex - 1] : 'mes anterior'}`);

    document.getElementById('kpi-retardo').textContent = `${fmt(horasRetardo)}h`;
    document.getElementById('kpi-retardo-trend').innerHTML =
        tendencia(cambioHoras, false, `vs ${estado.mesIndex > 0 ? MESES_LABEL[estado.mesIndex - 1] : 'mes anterior'}`, 'h');

    document.getElementById('kpi-productividad').textContent = `${fmt(productividad)}%`;
    document.getElementById('kpi-productividad-trend').innerHTML =
        tendencia(cambioProductividad, false, `vs ${estado.mesIndex > 0 ? MESES_LABEL[estado.mesIndex - 1] : 'mes anterior'}`);

    document.getElementById('kpi-novedades').textContent = novedades;
    document.getElementById('kpi-novedades-trend').textContent = `${justificadas} justificadas`;
}

/* Pinta la flecha y el color de una tendencia. Para ausentismo y
   horas de retardo, BAJAR es bueno (verde); para productividad,
   SUBIR es bueno. "positivoEsBueno" controla ese sentido. */
function tendencia(cambio, positivoEsBueno, etiqueta, sufijo = '%') {
    const sube = cambio >= 0;
    const esBueno = positivoEsBueno ? sube : !sube;
    const clase = Math.abs(cambio) < 0.05 ? 'neutral' : (esBueno ? 'down' : 'up');
    const icono = sube ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt';
    return `<i class='bx ${icono}'></i> ${sube ? '+' : ''}${fmt(cambio)}${sufijo} ${etiqueta}`;
}


/* =====================================================
   GRÁFICA 1: EVOLUCIÓN DE AUSENTISMO MENSUAL (línea)
===================================================== */

function renderGraficaAusentismo() {

    const mult = MULTIPLICADOR_TALLER[estado.taller];
    const proyeccion = AUSENTISMO.proyeccion.map(v => v * mult);
    const real = AUSENTISMO.real.map(v => v * mult);
    const meta = AUSENTISMO.meta * mult;

    const ancho = 560, alto = 220;
    const margen = { top: 15, right: 15, bottom: 28, left: 32 };
    const w = ancho - margen.left - margen.right;
    const h = alto - margen.top - margen.bottom;

    const maxValor = Math.max(...proyeccion, ...real) * 1.15;
    const escalaX = i => margen.left + (i / (MESES_LABEL.length - 1)) * w;
    const escalaY = v => margen.top + h - (v / maxValor) * h;

    const svg = crearSVG(`0 0 ${ancho} ${alto}`);

    // Líneas de cuadrícula horizontales (0%, 4 pasos)
    for (let i = 0; i <= 4; i++) {
        const y = margen.top + (h / 4) * i;
        svg.appendChild(el('line', { x1: margen.left, x2: margen.left + w, y1: y, y2: y, class: 'rep-grid-line' }));
        const valorEtiqueta = maxValor - (maxValor / 4) * i;
        svg.appendChild(el('text', { x: margen.left - 6, y: y + 3, class: 'rep-axis-text', 'text-anchor': 'end' }, `${Math.round(valorEtiqueta)}%`));
    }

    // Meses en el eje X
    MESES_LABEL.forEach((mes, i) => {
        svg.appendChild(el('text', { x: escalaX(i), y: alto - 6, class: 'rep-axis-text', 'text-anchor': 'middle' }, mes));
    });

    // Línea de meta (punteada verde)
    const yMeta = escalaY(meta);
    svg.appendChild(el('line', { x1: margen.left, x2: margen.left + w, y1: yMeta, y2: yMeta, class: 'rep-goal-line' }));
    svg.appendChild(el('text', { x: margen.left + w - 2, y: yMeta - 5, class: 'rep-goal-label', 'text-anchor': 'end' }, `Meta ${fmt(meta, 0)}%`));

    // Línea de proyección (sin sistema) — punteada gris, con círculos huecos
    const puntosProyeccion = proyeccion.map((v, i) => `${escalaX(i)},${escalaY(v)}`).join(' ');
    svg.appendChild(el('polyline', { points: puntosProyeccion, class: 'rep-line-projection' }));
    proyeccion.forEach((v, i) => {
        svg.appendChild(el('circle', { cx: escalaX(i), cy: escalaY(v), r: 3.5, class: 'rep-line-dot-projection' }));
    });

    // Línea real (con Talentsoft) — sólida naranja, con círculos rellenos
    const puntosReal = real.map((v, i) => `${escalaX(i)},${escalaY(v)}`).join(' ');
    svg.appendChild(el('polyline', { points: puntosReal, class: 'rep-line-real' }));
    real.forEach((v, i) => {
        svg.appendChild(el('circle', { cx: escalaX(i), cy: escalaY(v), r: 4, class: 'rep-line-dot' }));
    });

    const contenedor = document.getElementById('grafica-ausentismo');
    contenedor.innerHTML = '';
    contenedor.appendChild(svg);

    // Insight dinámico: cuánto bajó el ausentismo real desde enero
    const reduccion = ((proyeccion[0] - real[real.length - 1]) / proyeccion[0]) * 100;
    document.getElementById('rep-insight-ausentismo').innerHTML = `
        <i class='bx bx-check-circle'></i>
        <span>
            <strong>Impacto real:</strong> el ausentismo bajó de ${fmt(proyeccion[0], 0)}%
            en ${MESES_LABEL[0]} a ${fmt(real[real.length - 1])}% en ${MESES_LABEL[MESES_LABEL.length - 1]}
            — una reducción del ${fmt(Math.abs(reduccion), 0)}% frente al punto de partida.
            <span class="rep-insight-note">La curva "proyección" es un estimado de referencia, no un dato medido.</span>
        </span>
    `;

    const tagEl = document.getElementById('rep-tag-ausentismo');
    tagEl.textContent = `${reduccion >= 0 ? '↓' : '↑'} ${fmt(Math.abs(reduccion), 0)}%`;
}


/* =====================================================
   GRÁFICA 2: PRODUCTIVIDAD VS HORAS DE RETARDO (barras)
===================================================== */

function renderGraficaProductividad() {

    const mult = MULTIPLICADOR_TALLER[estado.taller];
    const lineas = LINEAS_BASE.map(l => ({
        nombre: l.nombre,
        productividad: Math.min(99, Math.round(l.productividad * (2 - mult))),
        retardo: Math.round(l.retardo * mult * 10) / 10
    }));

    const ancho = 560, alto = 220;
    const margen = { top: 15, right: 32, bottom: 40, left: 32 };
    const w = ancho - margen.left - margen.right;
    const h = alto - margen.top - margen.bottom;

    const grupoAncho = w / lineas.length;
    const barraAncho = Math.min(26, grupoAncho / 3.2);

    const maxProd = 100;
    const maxRetardo = 12;

    const escalaYProd = v => margen.top + h - (v / maxProd) * h;
    const escalaYRetardo = v => margen.top + h - (v / maxRetardo) * h;

    const svg = crearSVG(`0 0 ${ancho} ${alto}`);

    // Cuadrícula + eje izquierdo (productividad %)
    for (let i = 0; i <= 4; i++) {
        const val = (maxProd / 4) * i;
        const y = escalaYProd(val);
        svg.appendChild(el('line', { x1: margen.left, x2: margen.left + w, y1: y, y2: y, class: 'rep-grid-line' }));
        svg.appendChild(el('text', { x: margen.left - 6, y: y + 3, class: 'rep-axis-text', 'text-anchor': 'end' }, `${Math.round(val)}%`));
    }

    // Eje derecho (horas de retardo)
    for (let i = 0; i <= 4; i++) {
        const val = (maxRetardo / 4) * i;
        const y = escalaYRetardo(val);
        svg.appendChild(el('text', { x: margen.left + w + 6, y: y + 3, class: 'rep-axis-text' }, `${Math.round(val)}h`));
    }

    let lineaCritica = lineas[0];

    lineas.forEach((linea, i) => {

        const centroGrupo = margen.left + grupoAncho * i + grupoAncho / 2;

        // Barra de productividad (izquierda del par)
        const xProd = centroGrupo - barraAncho - 3;
        const yProd = escalaYProd(linea.productividad);
        svg.appendChild(el('rect', {
            x: xProd, y: yProd, width: barraAncho,
            height: (margen.top + h) - yProd, rx: 3,
            class: 'rep-bar-productividad'
        }));

        // Barra de horas de retardo (derecha del par)
        const xRet = centroGrupo + 3;
        const yRet = escalaYRetardo(linea.retardo);
        svg.appendChild(el('rect', {
            x: xRet, y: yRet, width: barraAncho,
            height: (margen.top + h) - yRet, rx: 3,
            class: 'rep-bar-retardo'
        }));

        // Etiqueta de la línea de confección
        svg.appendChild(el('text', {
            x: centroGrupo, y: alto - 6, class: 'rep-axis-text', 'text-anchor': 'middle'
        }, linea.nombre));

        if (linea.retardo > lineaCritica.retardo) lineaCritica = linea;
    });

    const contenedor = document.getElementById('grafica-productividad');
    contenedor.innerHTML = '';
    contenedor.appendChild(svg);

    // Insight dinámico: la línea con más horas de retardo y su
    // impacto frente al promedio de productividad de las demás.
    const otras = lineas.filter(l => l.nombre !== lineaCritica.nombre);
    const promedioOtras = otras.reduce((s, l) => s + l.productividad, 0) / otras.length;
    const impacto = ((lineaCritica.productividad - promedioOtras) / promedioOtras) * 100;

    document.getElementById('rep-insight-productividad').innerHTML = `
        <i class='bx bx-error'></i>
        <span>
            <strong>Línea crítica:</strong> ${lineaCritica.nombre} acumula
            ${fmt(lineaCritica.retardo)}h de retardo este mes, impactando la
            productividad en ${fmt(impacto, 1)}% respecto al promedio de las demás líneas.
        </span>
    `;

    document.getElementById('rep-tag-productividad').textContent = `Riesgo: ${lineaCritica.nombre}`;
}


/* =====================================================
   FILTROS
===================================================== */

function renderTodo() {
    renderKPIs();
    renderGraficaAusentismo();
    renderGraficaProductividad();

    const nombresTaller = { todos: 'Todos', tallerA: 'Taller A', tallerB: 'Taller B', tallerC: 'Taller C' };
    const periodoTexto = `${MESES_LABEL[estado.mesIndex]} ${MESES_VALUE[estado.mesIndex].slice(0, 4)}`;

    document.getElementById('rep-docs-periodo').textContent =
        `${periodoTexto} · ${nombresTaller[estado.taller]}`;

    document.querySelector('#rep-subtitulo-productividad').textContent =
        `Por línea de confección · ${nombresTaller[estado.taller]}`;
}

document.getElementById('rep-mes-select').addEventListener('change', (e) => {
    estado.mesIndex = Number(e.target.value);
    renderTodo();
});

document.querySelectorAll('.rep-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        document.querySelectorAll('.rep-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        estado.taller = pill.dataset.taller;
        renderTodo();
    });
});

document.getElementById('btnActualizarDatos').addEventListener('click', function () {
    const icono = this.querySelector('i');
    icono.classList.add('rep-spin');
    setTimeout(() => {
        renderTodo();
        icono.classList.remove('rep-spin');
        if (typeof showToast === 'function') {
            showToast('Datos actualizados');
        }
    }, 500);
});


/* =====================================================
   EXPORTACIÓN DE DOCUMENTOS

   No hay generador real de PDF ni de archivo plano PILA
   todavía: "Descargar" arma un CSV con el resumen de datos que
   se está viendo en pantalla (útil para revisar la información),
   y "Imprimir" abre el diálogo de impresión del navegador, que
   permite guardar como PDF. El día que haya backend, estos
   mismos botones deberían apuntar a los archivos oficiales.
===================================================== */

function construirCSVResumen() {
    const mult = MULTIPLICADOR_TALLER[estado.taller];
    const lineas = LINEAS_BASE.map(l => ({
        nombre: l.nombre,
        productividad: Math.min(99, Math.round(l.productividad * (2 - mult))),
        retardo: Math.round(l.retardo * mult * 10) / 10
    }));

    const filas = [
        ['Línea de confección', 'Productividad (%)', 'Horas de retardo'],
        ...lineas.map(l => [l.nombre, l.productividad, l.retardo])
    ];

    return filas.map(fila => fila.join(',')).join('\n');
}

function descargarArchivo(nombre, contenido, tipo) {
    const blob = new Blob([contenido], { type: tipo });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
}

document.querySelectorAll('.rep-btn-descargar').forEach(btn => {
    btn.addEventListener('click', () => {
        const nombreDoc = btn.dataset.doc;
        const periodo = `${MESES_LABEL[estado.mesIndex]}-2026`;
        const csv = construirCSVResumen();
        descargarArchivo(`${nombreDoc}_${periodo}.csv`, csv, 'text/csv;charset=utf-8;');
        if (typeof showToast === 'function') {
            showToast('Descarga iniciada');
        }
    });
});

document.querySelectorAll('.rep-btn-imprimir').forEach(btn => {
    btn.addEventListener('click', () => window.print());
});


/* =====================================================
   INICIO
===================================================== */

renderTodo();
