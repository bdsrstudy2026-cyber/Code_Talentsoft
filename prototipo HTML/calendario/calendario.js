// ================================
// CALENDARIO Y EVENTOS
// ================================
const eventModal = document.getElementById("eventModal");
const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");
const eventForm = document.getElementById("eventForm");
const eventTitleInput = document.getElementById("event-title");
const eventDateInput = document.getElementById("event-date");
const eventHourInput = document.getElementById("event-hour");
const eventMinuteInput = document.getElementById("event-minute");
const eventAmpmInput = document.getElementById("event-ampm");
const eventDescriptionInput = document.getElementById("event-description");
const eventRoleSelect = document.getElementById("event-role");
const dayDetailsModal = document.getElementById("dayDetailsModal");
const closeDayDetails = document.getElementById("closeDayDetails");
const closeDayDetailsBottom = document.getElementById("closeDayDetailsBottom");
const dayDetailsTitle = document.getElementById("dayDetailsTitle");
const dayDetailsSubtitle = document.getElementById("dayDetailsSubtitle");
const dayEventsList = document.getElementById("dayEventsList");
const btnCreateEvent = document.getElementById("btnCreateEvent");
const btnCreateFromDay = document.getElementById("btnCreateFromDay");
const calendarDays = document.getElementById("calendarDays");
const currentMonthLabel = document.getElementById("currentMonthLabel");
const btnPrevMonth = document.getElementById("btnPrevMonth");
const btnNextMonth = document.getElementById("btnNextMonth");
const btnToday = document.getElementById("btnToday");

const STORAGE_KEY = "calendarEvents";
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const roleLabels = { empleado: "Empleado", jefe: "Jefe", entrevistador: "Entrevistador", administrador: "Administrador", todos: "Todos" };
let currentMonth = new Date(2026, 7, 1);
let events = loadEvents();
let selectedDayForCreation = null;

function parseTime12(time = "") {
    const raw = String(time).trim();
    let match = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) return { hour: String(Number(match[1])).padStart(2,"0"), minute: match[2], ampm: match[3].toUpperCase() };
    match = raw.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
        let h = Number(match[1]);
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        return { hour: String(h).padStart(2,"0"), minute: match[2], ampm };
    }
    return { hour:"", minute:"", ampm:"" };
}
function formatTime12(time = "") {
    const t = parseTime12(time);
    return t.hour && t.minute && t.ampm ? `${t.hour}:${t.minute} ${t.ampm}` : time || "";
}
function timeSortValue(time = "") {
    const t=parseTime12(time); if(!t.hour) return 9999;
    let h=Number(t.hour)%12; if(t.ampm==="PM") h+=12;
    return h*60+Number(t.minute);
}
function setCalendarTime(time="") {
    const t=parseTime12(time); eventHourInput.value=t.hour; eventMinuteInput.value=t.minute; eventAmpmInput.value=t.ampm;
}
function getCalendarTime() {
    if(!eventHourInput.value || !eventMinuteInput.value || !eventAmpmInput.value) return "";
    return `${eventHourInput.value}:${eventMinuteInput.value} ${eventAmpmInput.value}`;
}

function loadEvents() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed.map(e => ({ ...e, date: normalizeDateKey(e.date) })) : [];
        }
        return [
            { id: "demo-1", title: "Revisión de candidatos", date: "2026-08-24", time: "09:00 AM", description: "Revisión de candidatos pendientes.", role: "entrevistador" },
            { id: "demo-2", title: "Reunión administrativa", date: "2026-08-27", time: "02:00 PM", description: "Reunión de seguimiento administrativo.", role: "jefe" }
        ];
    } catch (error) { console.error(error); return []; }
}
function saveEvents(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
function dateToKey(date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`; }
function formatDate(dateStr) { return new Date(`${dateStr}T00:00:00`).toLocaleDateString("es-CO", { weekday:"long", day:"numeric", month:"long", year:"numeric" }); }
function roleLabel(role) { return roleLabels[role] || "Sin especificar"; }
function escapeHtml(str) { const div=document.createElement("div"); div.textContent=str||""; return div.innerHTML; }

function renderCalendar() {
    const year=currentMonth.getFullYear(), month=currentMonth.getMonth();
    currentMonthLabel.textContent=`${monthNames[month]} ${year}`;
    calendarDays.innerHTML="";
    const firstDay=new Date(year,month,1);
    const startOffset=(firstDay.getDay()+6)%7;
    const todayKey=dateToKey(new Date());
    for(let i=0;i<42;i++) {
        const date=new Date(year,month,i-startOffset+1), dateKey=dateToKey(date);
        const day=document.createElement("div");
        day.className=`day${date.getMonth()===month?"":" other-month"}`;
        day.dataset.date=dateKey;
        day.innerHTML=`<span class="day-number">${date.getDate()}</span>`;
        if(dateKey===todayKey) day.classList.add("today");

        // Los eventos se insertan directamente dentro del día que corresponde.
        // Esto evita depender de querySelector y hace que aparezcan siempre
        // después de crear/guardar un evento.
        const dayEvents = events
            .filter(e => normalizeDateKey(e.date) === dateKey)
            .sort((a,b) => timeSortValue(a.time) - timeSortValue(b.time));

        dayEvents.forEach(eventData => renderEventIntoDay(day, eventData));

        day.addEventListener("click", () => showDayDetails(dateKey));
        calendarDays.appendChild(day);
    }
}

function normalizeDateKey(value) {
    if (!value) return "";
    const raw = String(value).trim();
    const match = raw.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : raw;
}

function renderEventIntoDay(dayEl, eventData) {
    if (!dayEl || !eventData) return;

    const timeText = eventData.time ? formatTime12(eventData.time) : "Sin hora";
    const titleText = eventData.title || "Evento";

    const el = document.createElement("div");
    el.className = "event";
    el.dataset.id = eventData.id || "";
    el.title = `${timeText} · ${titleText}`;

    // Línea visible directamente en el calendario, estilo Google Calendar.
    const timeEl = document.createElement("span");
    timeEl.className = "event-time";
    timeEl.textContent = timeText;

    const separator = document.createElement("span");
    separator.className = "event-separator";
    separator.textContent = " · ";

    const titleEl = document.createElement("span");
    titleEl.className = "event-title";
    titleEl.textContent = titleText;

    el.append(timeEl, separator, titleEl);

    el.addEventListener("click", (e) => {
        e.stopPropagation();
        showDayDetails(normalizeDateKey(eventData.date));
    });

    dayEl.appendChild(el);
}
function renderAllEvents(){renderCalendar();}
function showDayDetails(dateStr){
    selectedDayForCreation=dateStr;
    const dayEvents=events.filter(e=>e.date===dateStr).sort((a,b)=>timeSortValue(a.time)-timeSortValue(b.time));
    dayDetailsTitle.textContent="Eventos del día"; dayDetailsSubtitle.textContent=formatDate(dateStr);
    if(!dayEvents.length){dayEventsList.innerHTML=`<div class="empty-day-events"><i class='bx bx-calendar-x'></i><h3>No hay eventos programados</h3><p>Este día está disponible para agregar una nueva actividad.</p></div>`;}
    else {
        dayEventsList.innerHTML=dayEvents.map(e=>`<article class="day-event-card" data-id="${e.id}"><div class="day-event-time">${formatTime12(e.time)||"Sin hora"}</div><div class="day-event-info"><h3>${escapeHtml(e.title)}</h3>${e.description?`<p>${escapeHtml(e.description)}</p>`:""}<span><i class='bx bx-group'></i> ${roleLabel(e.role)}</span></div><button type="button" class="btn-delete-event" data-id="${e.id}" title="Eliminar evento"><i class='bx bx-trash'></i></button></article>`).join("");
        dayEventsList.querySelectorAll(".btn-delete-event").forEach(btn=>btn.addEventListener("click",()=>{const id=btn.dataset.id,e=events.find(x=>x.id===id);if(e&&confirm(`¿Eliminar el evento "${e.title}"?`)){events=events.filter(x=>x.id!==id);saveEvents(events);renderAllEvents();showDayDetails(dateStr);}}));
    }
    dayDetailsModal.classList.add("active");
}
function closeDayModal(){dayDetailsModal.classList.remove("active");selectedDayForCreation=null;}
function openCreateModal(dateStr=""){eventForm.reset();setCalendarTime("");if(dateStr)eventDateInput.value=dateStr;eventModal.classList.add("active");eventTitleInput.focus();}
function closeEventModal(){eventModal.classList.remove("active");eventForm.reset();}

btnCreateEvent.addEventListener("click",()=>openCreateModal());
btnCreateFromDay.addEventListener("click",()=>{const date=selectedDayForCreation;closeDayModal();openCreateModal(date||"");});
btnPrevMonth.addEventListener("click",()=>{currentMonth=new Date(currentMonth.getFullYear(),currentMonth.getMonth()-1,1);renderAllEvents();});
btnNextMonth.addEventListener("click",()=>{currentMonth=new Date(currentMonth.getFullYear(),currentMonth.getMonth()+1,1);renderAllEvents();});
btnToday.addEventListener("click",()=>{const d=new Date();currentMonth=new Date(d.getFullYear(),d.getMonth(),1);renderAllEvents();});
closeModal.addEventListener("click",closeEventModal); cancelModal.addEventListener("click",closeEventModal); closeDayDetails.addEventListener("click",closeDayModal); closeDayDetailsBottom.addEventListener("click",closeDayModal);
eventModal.addEventListener("click",e=>{if(e.target===eventModal)closeEventModal();}); dayDetailsModal.addEventListener("click",e=>{if(e.target===dayDetailsModal)closeDayModal();});
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(eventModal.classList.contains("active"))closeEventModal();if(dayDetailsModal.classList.contains("active"))closeDayModal();});
eventForm.addEventListener("submit",e=>{e.preventDefault();const selectedTime=getCalendarTime();const newEvent={id:Date.now().toString(),title:eventTitleInput.value.trim(),date:eventDateInput.value,time:selectedTime,description:eventDescriptionInput.value.trim(),role:eventRoleSelect.value||"todos"};if(!newEvent.title||!newEvent.date||!selectedTime)return;events.push(newEvent);saveEvents(events);currentMonth=new Date(`${newEvent.date}T00:00:00`);currentMonth.setDate(1);renderAllEvents();closeEventModal();});
renderAllEvents();
