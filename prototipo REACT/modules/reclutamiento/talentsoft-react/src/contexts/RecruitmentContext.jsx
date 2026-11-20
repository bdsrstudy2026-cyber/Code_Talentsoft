/* =========================================================
   RecruitmentContext — estado compartido del módulo de Reclutamiento

   Reemplaza el arreglo global CANDIDATES del prototipo: Dashboard,
   Banco, Pipeline, Evaluación e Historial leen y modifican el mismo
   estado, así siempre muestran información coherente.

   Uso:
     const { candidates, vacancies, loading, stats,
             getCandidateById, moveCandidate, hireCandidate,
             discardCandidate, addVacancy } = useRecruitment();

   Flujo de datos: useEffect carga desde mockApi al montar; las acciones
   actualizan la pantalla al instante (optimista) y luego "persisten"
   en mockApi.
   ========================================================= */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchRecruitmentData, patchCandidate, postVacancy } from '../services/mockApi';

const RecruitmentContext = createContext(null);

export function RecruitmentProvider({ children }) {
  const [candidates, setCandidates] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga inicial de datos.
  useEffect(() => {
    let cancelled = false;
    fetchRecruitmentData().then((data) => {
      if (cancelled) return;
      setCandidates(data.candidates);
      setVacancies(data.vacancies);
      setLoading(false);
    });
    return () => {
      cancelled = true; // evita setState si el componente ya se desmontó
    };
  }, []);

  /** Aplica cambios a un candidato en pantalla y en la "base de datos". */
  const updateCandidate = useCallback((id, changes) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, ...changes } : c)));
    return patchCandidate(id, changes);
  }, []);

  /** Mueve a un candidato entre etapas (drag & drop o selector). */
  const moveCandidate = useCallback(
    (id, stage) =>
      updateCandidate(id, {
        pipelineStage: stage,
        // Entrar a "Contratados" cambia el estado general; salir de ahí lo regresa a "En proceso".
        status: stage === 'contratados' ? 'contratado' : 'proceso',
      }),
    [updateCandidate],
  );

  const hireCandidate = useCallback((id) => moveCandidate(id, 'contratados'), [moveCandidate]);

  /** Saca al candidato del pipeline y lo devuelve al banco como "Disponible". */
  const discardCandidate = useCallback(
    (id) => updateCandidate(id, { pipelineStage: null, status: 'disponible' }),
    [updateCandidate],
  );

  const addVacancy = useCallback(async (data) => {
    const created = await postVacancy(data);
    setVacancies((prev) => [created, ...prev]);
    return created;
  }, []);

  const getCandidateById = useCallback((id) => candidates.find((c) => c.id === id) ?? null, [candidates]);

  /** Totales del Dashboard. */
  const stats = useMemo(
    () => ({
      total: candidates.length,
      inProcess: candidates.filter((c) => c.status === 'proceso').length,
      available: candidates.filter((c) => c.status === 'disponible').length,
      hired: candidates.filter((c) => c.status === 'contratado').length,
    }),
    [candidates],
  );

  const value = useMemo(
    () => ({
      candidates,
      vacancies,
      loading,
      stats,
      getCandidateById,
      moveCandidate,
      hireCandidate,
      discardCandidate,
      addVacancy,
    }),
    [candidates, vacancies, loading, stats, getCandidateById, moveCandidate, hireCandidate, discardCandidate, addVacancy],
  );

  return <RecruitmentContext.Provider value={value}>{children}</RecruitmentContext.Provider>;
}

export function useRecruitment() {
  const ctx = useContext(RecruitmentContext);
  if (!ctx) throw new Error('useRecruitment debe usarse dentro de <RecruitmentProvider>.');
  return ctx;
}
