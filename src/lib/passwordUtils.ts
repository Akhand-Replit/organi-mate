
import bcrypt from 'bcryptjs';

/**
 * Hashes a plain password.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

/**
 * Compares a plain password to a hashed password.
 */
export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(password, hashed);
}
