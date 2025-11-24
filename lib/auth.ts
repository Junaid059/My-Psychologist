// Authentication utilities
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const TOKEN_EXPIRY = '7d';

export interface UserPayload {
  id: string;
  email: string;
  userType: 'user' | 'admin' | 'employee';
}

/**
 * Generate JWT token
 */
export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Hash password
 */
export function hashPassword(password: string): string {
  return bcryptjs.hashSync(password, 10);
}

/**
 * Compare password with hash
 */
export function comparePassword(password: string, hash: string): boolean {
  return bcryptjs.compareSync(password, hash);
}

/**
 * Generate random ID
 */
export function generateId(prefix: string = ''): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get token from request headers
 */
export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export default {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  generateId,
  isValidEmail,
  getTokenFromRequest
};
