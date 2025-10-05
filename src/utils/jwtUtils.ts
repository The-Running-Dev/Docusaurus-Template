/**
 * Utility functions for working with JWT tokens
 */

/**
 * Decode a JWT token without verification (client-side only)
 */
export const decodeJWTPayload = (token: string): any | null => {
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
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};

/**
 * Check if a JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) {
    return true; // Treat malformed tokens as expired
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Check if a JWT token will expire soon (within the next 5 minutes)
 */
export const isTokenExpiringSoon = (
  token: string,
  bufferMinutes: number = 5
): boolean => {
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const bufferSeconds = bufferMinutes * 60;
  return payload.exp < currentTime + bufferSeconds;
};
