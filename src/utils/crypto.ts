/**
 * Genera el hash SHA-256 de una cadena de texto usando Web Crypto API
 */
export async function createSha256Hash(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Compara una contraseña en texto plano contra un hash SHA-256
 */
export async function comparePasswordWithHash(password: string, hash: string): Promise<boolean> {
  const passwordHash = await createSha256Hash(password);
  return passwordHash === hash;
}
