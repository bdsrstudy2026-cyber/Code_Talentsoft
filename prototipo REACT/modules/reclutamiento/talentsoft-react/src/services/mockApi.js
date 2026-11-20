/* =========================================================
   mockApi — "backend" simulado en memoria

   Simula la persistencia: los datos viven en una variable del módulo
   (sobreviven a que React desmonte y vuelva a montar los componentes,
   por ejemplo al cerrar sesión y volver a entrar) y cada llamada tarda
   unos milisegundos, como una petición real.

   Los datos se reinician al recargar la página (F5). Cuando haya API real,
   solo hay que reemplazar el cuerpo de estas funciones por fetch/axios;
   los contextos y las pantallas no cambian.
   ========================================================= */
import { INITIAL_CANDIDATES, INITIAL_VACANCIES } from '../data/mockRecruitment';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// "Base de datos" en memoria (copias para no mutar los datos originales).
const db = {
  candidates: structuredClone(INITIAL_CANDIDATES),
  vacancies: structuredClone(INITIAL_VACANCIES),
};

/** GET candidatos + vacantes */
export async function fetchRecruitmentData() {
  await wait(350);
  return structuredClone({ candidates: db.candidates, vacancies: db.vacancies });
}

/** PATCH candidato: aplica los cambios y devuelve el registro actualizado. */
export async function patchCandidate(id, changes) {
  await wait(120);
  db.candidates = db.candidates.map((c) => (c.id === id ? { ...c, ...changes } : c));
  return structuredClone(db.candidates.find((c) => c.id === id));
}

/** POST vacante: la agrega al inicio de la lista. */
export async function postVacancy({ title, area, slots }) {
  await wait(200);
  const vacancy = {
    id: `vac-${Date.now()}`,
    title,
    area,
    status: 'activa',
    postedLabel: 'Hoy',
    applicants: 0,
    slots: Number(slots) || 1,
  };
  db.vacancies = [vacancy, ...db.vacancies];
  return structuredClone(vacancy);
}
