/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],

  // El modo oscuro se activa agregando la clase "dark" a <html>
  // (ver src/contexts/ThemeContext.jsx).
  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      /*
       * TOKENS SEMÁNTICOS
       * Los colores "ink / muted / panel / panel-alt / line" leen variables CSS
       * definidas en src/index.css que cambian según el tema. Así los componentes
       * usan `bg-panel`, `text-muted`, etc. y NO necesitan escribir `dark:` en
       * cada clase.
       */
      colors: {
        brand: {
          DEFAULT: '#ff5722', // Naranja característico de TalentSoft
          hover: '#e64a19',
        },
        ink: 'rgb(var(--ts-ink) / <alpha-value>)',
        muted: 'rgb(var(--ts-muted) / <alpha-value>)',
        panel: 'rgb(var(--ts-panel) / <alpha-value>)',
        'panel-alt': 'rgb(var(--ts-panel-alt) / <alpha-value>)',
        line: 'rgb(var(--ts-line) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
