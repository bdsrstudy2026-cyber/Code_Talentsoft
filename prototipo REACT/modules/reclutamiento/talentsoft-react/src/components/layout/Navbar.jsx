/**
 * Navbar.jsx — TalentSoft
 * ---------------------------------------------------------------
 * Barra de navegación lateral:
 *   · Escritorio (≥ lg): sidebar fijo, colapsable a solo iconos.
 *   · Móvil / tablet:    barra superior + menú lateral deslizable.
 *   · Modo oscuro / claro con botón (switch accesible).
 *   · El menú se filtra según el rol: cada ítem declara el permiso
 *     que necesita y solo se muestra si el usuario lo tiene.
 *
 * DEPENDENCIAS
 *   npm i react-router-dom lucide-react
 *   · useAuth()   → src/contexts/AuthContext.jsx   ({ user, can, logout })
 *   · useTheme()  → src/contexts/ThemeContext.jsx  ({ isDark, toggleTheme })
 *   · PERMISSIONS → src/config/roles.js
 *   · Tailwind con los tokens de tailwind.config.js
 *     (brand, ink, muted, panel, panel-alt, line) y darkMode: 'class'.
 *
 * USO
 *   <div className="flex min-h-screen flex-col lg:flex-row">
 *     <Navbar />
 *     <main className="min-w-0 flex-1 p-4 lg:p-8"><Outlet /></main>
 *   </div>
 *
 * AGREGAR UNA OPCIÓN AL MENÚ
 *   Añade un objeto a NAV_ITEMS con { to, label, icon, permission }.
 */
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  PieChart,
  Settings,
  Sun,
  User,
  UserSearch,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PERMISSIONS as P } from '../../config/roles';

/* ---------------------------------------------------------------
   OPCIONES DEL MENÚ
   `end: true` → el ítem solo se marca activo en la ruta exacta
   (necesario para "/", que si no quedaría activo en todas).
   --------------------------------------------------------------- */
const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, permission: P.DASHBOARD_VIEW, end: true },
  { to: '/usuario', label: 'Usuario', icon: User, permission: P.PROFILE_VIEW },
  { to: '/asistencia', label: 'Asistencia', icon: Clock, permission: P.ATTENDANCE_VIEW },
  { to: '/reportes', label: 'Reportes', icon: PieChart, permission: P.REPORTS_VIEW },
  // Queda activo en todas las pantallas del módulo (/reclutamiento/...)
  { to: '/reclutamiento', label: 'Reclutamiento', icon: UserSearch, permission: P.RECRUITMENT_VIEW },
  { to: '/eventos', label: 'Eventos', icon: CalendarDays, permission: P.EVENTS_VIEW },
  { to: '/configuracion', label: 'Configuración', icon: Settings, permission: P.SETTINGS_MANAGE },
];

const COLLAPSE_KEY = 'ts-sidebar-collapsed';

/** Lee/guarda la preferencia de sidebar colapsado (tolerante a storage bloqueado). */
function readCollapsed() {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === '1';
  } catch {
    return false;
  }
}
function writeCollapsed(value) {
  try {
    window.localStorage.setItem(COLLAPSE_KEY, value ? '1' : '0');
  } catch {
    /* se ignora */
  }
}

/** "Laura Martínez" → "LM" */
function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

/* ===============================================================
   Ítem de navegación
   =============================================================== */
function NavItem({ item, collapsed, onNavigate }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        [
          'group flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-medium transition-colors',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
          collapsed ? 'justify-center' : '',
          isActive ? 'bg-brand/15 text-brand' : 'text-ink/80 hover:bg-ink/10 hover:text-ink',
        ].join(' ')
      }
    >
      <Icon size={20} className="shrink-0" aria-hidden="true" />
      {/* En modo colapsado el texto sigue disponible para lectores de pantalla */}
      <span className={collapsed ? 'sr-only' : 'truncate'}>{item.label}</span>
    </NavLink>
  );
}

/* ===============================================================
   Switch de tema (oscuro / claro)
   =============================================================== */
function ThemeToggle({ collapsed }) {
  const { isDark, toggleTheme } = useTheme();
  const Icon = isDark ? Moon : Sun;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isDark}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={collapsed ? (isDark ? 'Modo claro' : 'Modo oscuro') : undefined}
      onClick={toggleTheme}
      className={[
        'flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-medium text-ink/80 transition-colors',
        'hover:bg-ink/10 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        collapsed ? 'justify-center' : '',
      ].join(' ')}
    >
      <Icon size={20} className="shrink-0" aria-hidden="true" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate text-left">{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
          {/* Interruptor visual */}
          <span
            aria-hidden="true"
            className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${isDark ? 'bg-ink/20' : 'bg-brand'}`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                isDark ? 'left-0.5' : 'left-[1.1rem]'
              }`}
            />
          </span>
        </>
      )}
    </button>
  );
}

/* ===============================================================
   Contenido del sidebar (se reutiliza en escritorio y móvil)
   =============================================================== */
function SidebarContent({ collapsed, onToggleCollapse, onNavigate, onClose }) {
  const { user, can, logout } = useAuth();
  const navigate = useNavigate();

  // Solo los ítems que el rol puede ver.
  const visibleItems = NAV_ITEMS.filter((item) => can(item.permission));

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Cabecera: logo + colapsar / cerrar */}
      <div className={`flex h-16 shrink-0 items-center px-3 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && <span className="pl-2 text-2xl font-bold tracking-tight text-ink">Talentsoft</span>}

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
            aria-expanded={!collapsed}
            className="rounded-lg p-2 text-ink/80 transition-colors hover:bg-ink/10 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="rounded-lg p-2 text-ink/80 transition-colors hover:bg-ink/10 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navegación principal */}
      <nav aria-label="Navegación principal" className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-1">
          {visibleItems.map((item) => (
            <li key={item.to}>
              <NavItem item={item} collapsed={collapsed} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Pie: usuario, tema y cierre de sesión */}
      <div className="shrink-0 space-y-1 border-t border-line/60 p-3">
        {user && (
          <div
            className={`mb-2 flex items-center gap-3 rounded-lg px-2 py-2 ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? `${user.name} · ${user.role}` : undefined}
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white"
            >
              {getInitials(user.name)}
            </span>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.role}</p>
              </div>
            )}
          </div>
        )}

        <ThemeToggle collapsed={collapsed} />

        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? 'Cerrar sesión' : undefined}
          className={[
            'flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-medium text-ink/80 transition-colors',
            'hover:bg-red-500/15 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
            collapsed ? 'justify-center' : '',
          ].join(' ')}
        >
          <LogOut size={20} className="shrink-0" aria-hidden="true" />
          <span className={collapsed ? 'sr-only' : 'truncate'}>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}

/* ===============================================================
   NAVBAR (exportado)
   =============================================================== */
export default function Navbar() {
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      writeCollapsed(!prev);
      return !prev;
    });
  };

  // Cierra el menú móvil al cambiar de página.
  useEffect(() => setMobileOpen(false), [pathname]);

  // Mientras el menú móvil está abierto: bloquea el scroll y permite cerrar con Esc.
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKeyDown = (e) => e.key === 'Escape' && setMobileOpen(false);
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ---------- ESCRITORIO: sidebar fijo y colapsable ---------- */}
      <aside
        className={[
          'sticky top-0 hidden h-screen shrink-0 self-start lg:block',
          'border-r border-line/60 bg-panel-alt/70 backdrop-blur-2xl',
          'transition-[width] duration-300 ease-in-out',
          collapsed ? 'w-20' : 'w-64',
        ].join(' ')}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
      </aside>

      {/* ---------- MÓVIL: barra superior ---------- */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line/60 bg-panel-alt/80 px-4 backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={mobileOpen}
          className="-ml-2 rounded-lg p-2 text-ink transition-colors hover:bg-ink/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
        >
          <Menu size={22} />
        </button>

        <span className="text-xl font-bold tracking-tight text-ink">Talentsoft</span>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
          className="-mr-2 rounded-lg p-2 text-ink transition-colors hover:bg-ink/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
        >
          {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      {/* ---------- MÓVIL: menú lateral deslizable ---------- */}
      <div className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}>
        {/* Fondo oscuro: al tocarlo se cierra el menú */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          aria-label="Menú de navegación"
          className={[
            'absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-line bg-panel-alt shadow-2xl',
            'transition-[transform,visibility] duration-300 ease-in-out',
            mobileOpen ? 'visible translate-x-0' : 'invisible -translate-x-full',
          ].join(' ')}
        >
          <SidebarContent
            collapsed={false}
            onNavigate={() => setMobileOpen(false)}
            onClose={() => setMobileOpen(false)}
          />
        </aside>
      </div>
    </>
  );
}
