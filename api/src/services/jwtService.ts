import jwt from 'jsonwebtoken';

const DEFAULT_SECRET = process.env.JWT_SECRET || 'changeme';
const DEFAULT_EXPIRES_IN = '15m';
const DEFAULT_REFRESH_EXPIRES_IN = '7d';

export function signAccessToken(
  payload: string | object | Buffer,
  secret?: string,
  expiresIn?: string
) {
  const usedSecret: string = secret ?? DEFAULT_SECRET;
  return jwt.sign(payload, usedSecret, {
    expiresIn: expiresIn || DEFAULT_EXPIRES_IN
  } as jwt.SignOptions);
}

export function signRefreshToken(
  payload: string | object | Buffer,
  secret?: string,
  expiresIn?: string
) {
  const usedSecret: string = secret ?? DEFAULT_SECRET;
  return jwt.sign(payload, usedSecret, {
    expiresIn: expiresIn || DEFAULT_REFRESH_EXPIRES_IN
  } as jwt.SignOptions);
}

export function verifyToken(token: string, secret?: string) {
  try {
    return jwt.verify(token, secret || DEFAULT_SECRET);
  } catch (_err) {
    return null;
  }
}
