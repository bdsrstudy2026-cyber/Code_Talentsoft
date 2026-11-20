/* =========================================================
   Login — valida contra los usuarios mock del AuthContext y
   redirige a la pantalla inicial del rol (ROLE_HOME).
   Incluye accesos rápidos para probar cada rol.
   ========================================================= */
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_USERS } from '../data/mockUsers';
import { ROLE_HOME } from '../config/roles';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { isAuthenticated, user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Si ya hay sesión, no tiene sentido ver el login.
  if (isAuthenticated) return <Navigate to={ROLE_HOME[user.role] ?? '/'} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) return setError('Ingresa tu correo y tu contraseña.');
    if (!EMAIL_REGEX.test(email.trim())) return setError('Ingresa un correo electrónico válido.');

    setLoading(true);
    const result = await login({ email, password, remember });
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      setPassword('');
      return undefined;
    }
    return navigate(ROLE_HOME[result.user.role] ?? '/', { replace: true });
  };

  const fillDemo = (demoUser) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError('');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center gap-3 p-6">
        <img src="/img/logo.png" alt="" className="h-10 w-10 rounded-lg" />
        <span className="text-xl font-bold text-ink">Talentsoft</span>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-10">
        <div className="card w-full max-w-md bg-panel/85 p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} noValidate>
            <h1 className="text-2xl font-bold text-ink">Iniciar sesión</h1>
            <p className="mb-6 mt-1 text-sm text-muted">Ingresa con tu cuenta de Talentsoft</p>

            <label htmlFor="loginEmail" className="mb-1.5 block text-sm font-medium text-ink">
              Correo
            </label>
            <div className="relative mb-4">
              <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="loginEmail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field pl-10"
                placeholder="usuario@talentsoft.com"
              />
            </div>

            <label htmlFor="loginPassword" className="mb-1.5 block text-sm font-medium text-ink">
              Contraseña
            </label>
            <div className="relative mb-4">
              <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="loginPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field px-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-ink"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p role="alert" className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
                {error}
              </p>
            )}

            <label className="mb-5 flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 accent-brand"
              />
              Recuérdame
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : null}
              {loading ? 'Ingresando…' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Accesos rápidos de demostración (eliminar en producción) */}
          <div className="mt-6 border-t border-line pt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
              Cuentas demo · contraseña Talentsoft2026
            </p>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {MOCK_USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => fillDemo(u)}
                  className="rounded-lg border border-line bg-panel-alt px-3 py-2 text-left text-xs transition-colors hover:border-brand"
                >
                  <span className="block font-semibold text-ink">{u.role}</span>
                  <span className="block truncate text-muted">{u.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 pb-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Talentsoft · Sistema de Gestión de Talento Humano
      </footer>
    </div>
  );
}
