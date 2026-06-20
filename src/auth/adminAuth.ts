import { ADMIN_PASSWORD_HASH } from '../config/adminConfig';
import { comparePasswordWithHash } from '../utils/crypto';

const SESSION_KEY = 'admin-session-active';

/**
 * Valida la contraseña y, si es correcta, activa la sesión en sessionStorage
 */
export async function loginAdmin(password: string): Promise<boolean> {
  const isValid = await comparePasswordWithHash(password, ADMIN_PASSWORD_HASH);
  if (isValid) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
  return false;
}

/**
 * Cierra la sesión del administrador
 */
export function logoutAdmin(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Comprueba si la sesión del administrador está activa
 */
export function isAdminSessionActive(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}
