/* =========================================================
   ThemeContext — modo oscuro / claro

   Uso:
     const { theme, isDark, toggleTheme } = useTheme();

   - Por defecto arranca en oscuro (deep dark).
   - Agrega/quita la clase "dark" en <html>; Tailwind y las variables
     CSS de src/index.css hacen el resto.
   - Recuerda la preferencia en localStorage ("ts-theme", la misma
     clave que usaba el prototipo HTML).
   ========================================================= */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);
const THEME_KEY = 'ts-theme';

function readStoredTheme() {
  try {
    return window.localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readStoredTheme);

  // Sincroniza <html> y guarda la preferencia cada vez que cambia el tema.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* almacenamiento bloqueado: el tema sigue funcionando en memoria */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  const value = useMemo(
    () => ({ theme, isDark: theme === 'dark', toggleTheme }),
    [theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>.');
  return ctx;
}
