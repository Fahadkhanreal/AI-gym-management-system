/**
 * Admin session management — handles token storage, expiry, and idle timeout.
 *
 * - Uses sessionStorage (auto-clears on tab close)
 * - Token expiry after 24 hours
 * - Idle timeout after 30 minutes of inactivity
 */

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_USER_KEY = "admin_user";
const TOKEN_EXPIRY_KEY = "admin_token_expiry";
const TOKEN_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const IDLE_CHECK_INTERVAL = 60 * 1000; // Check every minute

let idleTimer: ReturnType<typeof setInterval> | null = null;
let lastActivity = Date.now();

/**
 * Update last activity timestamp on user interaction.
 */
function updateActivity() {
  lastActivity = Date.now();
}

/**
 * Start tracking user activity for idle timeout.
 */
function startIdleTracking() {
  // Reset
  if (idleTimer) clearInterval(idleTimer);

  // Listen for user activity
  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", updateActivity, { passive: true });
    window.addEventListener("keydown", updateActivity, { passive: true });
    window.addEventListener("click", updateActivity, { passive: true });
    window.addEventListener("scroll", updateActivity, { passive: true });
    window.addEventListener("touchstart", updateActivity, { passive: true });
  }

  // Check every minute if idle timeout exceeded
  idleTimer = setInterval(() => {
    const token = getToken();
    if (!token) {
      stopIdleTracking();
      return;
    }

    const now = Date.now();
    if (now - lastActivity > IDLE_TIMEOUT_MS) {
      clearSession();
      stopIdleTracking();
      redirectToLogin();
    }
  }, IDLE_CHECK_INTERVAL);
}

/**
 * Stop idle tracking and remove listeners.
 */
function stopIdleTracking() {
  if (idleTimer) {
    clearInterval(idleTimer);
    idleTimer = null;
  }
  if (typeof window !== "undefined") {
    window.removeEventListener("mousemove", updateActivity);
    window.removeEventListener("keydown", updateActivity);
    window.removeEventListener("click", updateActivity);
    window.removeEventListener("scroll", updateActivity);
    window.removeEventListener("touchstart", updateActivity);
  }
}

/**
 * Save auth data to sessionStorage with expiry timestamp.
 */
export function setSession(token: string, user: any) {
  try {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    sessionStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + TOKEN_DURATION_MS));
    startIdleTracking();
  } catch {
    // sessionStorage might be full or unavailable
  }
}

/**
 * Get the stored token. Returns null if expired or not found.
 * Checks sessionStorage first, then localStorage (backward compat).
 */
export function getToken(): string | null {
  try {
    // Check sessionStorage first (new)
    let token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    let expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);

    // Fallback to localStorage (old — migrate on first read)
    if (!token) {
      token = localStorage.getItem(ADMIN_TOKEN_KEY);
      expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
      // Migrate to sessionStorage
      if (token) {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
        sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiry || String(Date.now() + TOKEN_DURATION_MS));
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
      }
    }

    if (!token) return null;

    // Check expiry
    if (expiry && Date.now() > Number(expiry)) {
      clearSession();
      return null;
    }

    return token;
  } catch {
    return null;
  }
}

/**
 * Get the stored user object.
 */
export function getUser(): any | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Clear all admin session data.
 */
export function clearSession() {
  try {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_USER_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch {
    // ignore
  }
}

/**
 * Check if the user is authenticated (token exists and not expired).
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Redirect to admin login page.
 */
export function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.href = "/admin/login";
  }
}

/**
 * Initialize session management — call once on admin page load.
 * Starts idle tracking if a valid token exists.
 */
export function initSession() {
  const token = getToken();
  if (token) {
    startIdleTracking();
  }
}

/**
 * Handle logout — clear session, stop tracking, redirect.
 */
export function logout() {
  clearSession();
  stopIdleTracking();
  redirectToLogin();
}
