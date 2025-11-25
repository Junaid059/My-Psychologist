/**
 * Client-side authentication utilities
 * These functions run in the browser and help manage user authentication state
 */

export interface DecodedToken {
  id: string;
  email: string;
  userType: string;
  iat?: number;
  exp?: number;
}

/**
 * Decode a JWT token (browser-side)
 * Note: This is NOT secure verification, just decoding the payload
 * Server-side verification is still required for security
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Get the current user's ID from the stored token
 */
export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('userToken') || localStorage.getItem('user_token');
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.id || null;
}

/**
 * Get the current user's full data from localStorage
 */
export function getCurrentUser(): any | null {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem('user') || localStorage.getItem('user_data');
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Check if a user is currently logged in
 */
export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('userToken') || localStorage.getItem('user_token');
  const user = localStorage.getItem('user') || localStorage.getItem('user_data');
  
  return !!(token && user);
}

/**
 * Get the authentication token
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userToken') || localStorage.getItem('user_token');
}

/**
 * Logout the current user
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('userToken');
  localStorage.removeItem('user_token');
  localStorage.removeItem('user');
  localStorage.removeItem('user_data');
}

/**
 * Check if the token is expired
 */
export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
  return decoded.exp * 1000 < Date.now();
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export function requireAuth(redirectTo: string = '/login'): boolean {
  if (typeof window === 'undefined') return false;
  
  if (!isLoggedIn() || isTokenExpired()) {
    window.location.href = redirectTo;
    return false;
  }
  
  return true;
}
