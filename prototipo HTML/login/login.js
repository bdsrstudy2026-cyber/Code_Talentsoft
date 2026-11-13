/* =========================================================
   TALENTSOFT · LOGIN
   Valida el acceso contra una lista de cuentas de demostración
   (los mismos empleados que ya aparecen en Configuración), abre
   sesión en el navegador y redirige directo al módulo de
   Asistencia, que es donde cualquier persona que inicia sesión
   necesita marcar su entrada.
   ========================================================= */

const DEMO_USERS = [
    { email: 'admin@talentsoft.com', password: 'Talentsoft2026', name: 'Laura Martínez', role: 'Administrador' },
    { email: 'jefe@talentsoft.com', password: 'Talentsoft2026', name: 'Andrés Ramírez', role: 'Jefe' },
    { email: 'empleado@talentsoft.com', password: 'Talentsoft2026', name: 'Camila Torres', role: 'Empleado' },
    { email: 'entrevistador@talentsoft.com', password: 'Talentsoft2026', name: 'Sofía Pardo', role: 'Entrevistador' }
];

const form = document.getElementById('formLogin');
const emailInput = document.getElementById('loginEmail');
const passwordInput = document.getElementById('loginPassword');
const rememberInput = document.getElementById('loginRemember');
const errorEl = document.getElementById('loginError');
const submitBtn = document.getElementById('btnLogin');
const togglePassword = document.getElementById('togglePassword');
const yearEl = document.getElementById('footerYear');

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

/* Mostrar / ocultar contraseña */
if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
        const showing = passwordInput.type === 'text';
        passwordInput.type = showing ? 'password' : 'text';
        togglePassword.querySelector('i').className = showing ? 'bx bx-lock-alt' : 'bx bx-lock-open-alt';
    });
}

function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.add('show');
}

function clearError() {
    errorEl.textContent = '';
    errorEl.classList.remove('show');
}

[emailInput, passwordInput].forEach(input => {
    input.addEventListener('input', clearError);
});

/* Si ya había una sesión abierta (por ejemplo, "Recuérdame"
   activo en localStorage), no hace falta volver a loguearse. */
(function redirectIfAlreadyLogged() {
    const yaLogueado = localStorage.getItem('ts-auth') === '1' || sessionStorage.getItem('ts-auth') === '1';
    if (yaLogueado) {
        window.location.href = '../asistencia/asistencia.html';
    }
})();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
        showError('Ingresa tu correo y tu contraseña.');
        return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
        showError('Ingresa un correo electrónico válido.');
        return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simula el tiempo de una petición real al servidor.
    setTimeout(() => {
        const usuario = DEMO_USERS.find(u => u.email === email && u.password === password);

        if (!usuario) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            showError('Correo o contraseña incorrectos.');
            passwordInput.value = '';
            passwordInput.focus();
            return;
        }

        // "Recuérdame" marcado -> la sesión sobrevive a cerrar el
        // navegador (localStorage). Si no, dura solo la pestaña
        // actual (sessionStorage), como cualquier sistema real.
        const storage = rememberInput.checked ? localStorage : sessionStorage;
        storage.setItem('ts-auth', '1');
        storage.setItem('ts-user-email', usuario.email);
        storage.setItem('ts-user-name', usuario.name);
        storage.setItem('ts-user-role', usuario.role);

        window.location.href = '../asistencia/asistencia.html';
    }, 500);
});
