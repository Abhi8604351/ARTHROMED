import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'arthromed-clinical-super-secret-key-2025';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  fullName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Creates a signed base64url HMAC-SHA256 token
 */
export function createToken(payload: AuthenticatedUser): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const data = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${data}`).digest('base64url');
  return `${header}.${data}.${signature}`;
}

/**
 * Verifies a token and returns payload or null
 */
export function verifyToken(token: string): AuthenticatedUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, data, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${data}`).digest('base64url');
    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      fullName: payload.fullName
    };
  } catch {
    return null;
  }
}

/**
 * Middleware: Requires any authenticated user
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
    return;
  }

  const token = authHeader.substring(7).trim();
  const user = verifyToken(token);

  if (!user) {
    res.status(401).json({ error: 'Invalid or expired session token.' });
    return;
  }

  req.user = user;
  next();
};

/**
 * Middleware: Requires user with 'admin' role
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
    return;
  }

  const token = authHeader.substring(7).trim();
  const user = verifyToken(token);

  if (!user) {
    res.status(401).json({ error: 'Invalid or expired administrative credentials.' });
    return;
  }

  if (user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Administrative privileges required to perform this action.' });
    return;
  }

  req.user = user;
  next();
};
