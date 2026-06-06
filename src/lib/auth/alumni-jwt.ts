import jwt from 'jsonwebtoken';

export interface AlumniTokenPayload {
  id: string;
  email: string;
  name?: string;
}

export function generateAlumniAccessToken(payload: AlumniTokenPayload): string {
  return jwt.sign(
    payload, 
    process.env.ACCESS_TOKEN_SECRET!, 
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any});
}

export function generateAlumniRefreshToken(payload: { id: string }): string {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any });
}

export function verifyAlumniAccessToken(token: string): AlumniTokenPayload {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as AlumniTokenPayload;
  } catch {
    throw new Error('Invalid or expired alumni access token');
  }
}

export function verifyAlumniRefreshToken(token: string): { id: string } {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { id: string };
  } catch {
    throw new Error('Invalid or expired refresh token');
  }
}