import { Request, Response } from 'express';
import crypto from 'crypto';
import { User, UserPublicDto } from '../models/user.model';
import { createToken } from '../middleware/auth.middleware';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'arthromed-salt').digest('hex');
}

// 10 minutes in milliseconds
const LOCKOUT_DURATION_MS = 10 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 3;

// Device / IP Rate Limiting for Account Registration: Max 2 accounts per device in 24 hours
const REGISTRATION_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_ACCOUNTS_PER_DEVICE_24H = 2;
const deviceRegistrationHistory = new Map<string, number[]>();

// Password strength validator (minimum 8 characters, letters, numbers, and symbols)
export function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one letter (a-z or A-Z).' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number (0-9).' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one symbol or special character (!@#$%^&*...).' };
  }
  return { isValid: true };
}

// Email format validator
export function validateEmailFormat(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

// In-memory persistent users store
export const usersStore: User[] = [
  {
    id: 'user-admin-01',
    fullName: 'Clinical System Administrator',
    email: 'admin@arthromed.com',
    passwordHash: hashPassword('admin123'),
    role: 'admin',
    createdAt: new Date('2025-01-01').toISOString(),
    failedLoginAttempts: 0,
    lockUntil: null
  },
  {
    id: 'user-cust-01',
    fullName: 'Sarah Jenkins, DPT',
    email: 'customer@arthromed.com',
    passwordHash: hashPassword('customer123'),
    role: 'customer',
    createdAt: new Date('2025-01-10').toISOString(),
    failedLoginAttempts: 0,
    lockUntil: null
  }
];

/**
 * POST /api/auth/register
 * Customer registration with strict email and strong password validation
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !fullName.trim()) {
      res.status(400).json({ error: 'Full name is required.' });
      return;
    }

    if (!email || !validateEmailFormat(email)) {
      res.status(400).json({ error: 'Please provide a valid email address (e.g., name@example.com).' });
      return;
    }

    const passwordValidation = validatePasswordStrength(password || '');
    if (!passwordValidation.isValid) {
      res.status(400).json({ error: passwordValidation.message });
      return;
    }

    // Enforce device registration limit: maximum 2 accounts per device in 24 hours
    const clientIdentifier = (req.headers['x-device-id'] as string) ||
                             (req.headers['x-forwarded-for'] as string) ||
                             req.ip ||
                             req.socket.remoteAddress ||
                             'local-device';

    const now = Date.now();
    const pastRegistrations = (deviceRegistrationHistory.get(clientIdentifier) || []).filter(
      ts => now - ts < REGISTRATION_WINDOW_MS
    );

    if (pastRegistrations.length >= MAX_ACCOUNTS_PER_DEVICE_24H) {
      const oldest = Math.min(...pastRegistrations);
      const remainingMs = REGISTRATION_WINDOW_MS - (now - oldest);
      const remainingHours = Math.ceil(remainingMs / (60 * 60 * 1000));
      res.status(429).json({
        error: `Device registration limit reached: A maximum of 2 accounts can be created from this device within a 24-hour window. Please try again in ${remainingHours} hour(s) or sign in with your existing account.`,
        isDeviceLimit: true,
        remainingMs
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = usersStore.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      res.status(409).json({ error: 'An account with this email address already exists. Please log in.' });
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      role: 'customer',
      createdAt: new Date().toISOString(),
      failedLoginAttempts: 0,
      lockUntil: null
    };

    usersStore.push(newUser);

    // Record registration timestamp for device rate limiting
    pastRegistrations.push(now);
    deviceRegistrationHistory.set(clientIdentifier, pastRegistrations);

    const token = createToken({
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role
    });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error during registration.' });
  }
};

/**
 * POST /api/auth/login
 * Customer & Admin Login with 3-attempt 10-minute lockout rule
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, requiredRole } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = usersStore.find(u => u.email.toLowerCase() === normalizedEmail);
    const now = Date.now();

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password credentials.' });
      return;
    }

    // Check if account is currently locked
    if (user.lockUntil && user.lockUntil > now) {
      const remainingMs = user.lockUntil - now;
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      const remainingSeconds = Math.ceil(remainingMs / 1000);

      res.status(423).json({
        error: `Security Lockout: Your account is temporarily locked due to 3 consecutive failed attempts. Please wait ${remainingMinutes} minute(s) before trying again.`,
        isLocked: true,
        remainingSeconds,
        lockUntil: new Date(user.lockUntil).toISOString()
      });
      return;
    }

    // Auto-unlock if lockout duration has passed
    if (user.lockUntil && user.lockUntil <= now) {
      user.lockUntil = null;
      user.failedLoginAttempts = 0;
    }

    // Check password
    const isPasswordCorrect = user.passwordHash === hashPassword(password);

    if (!isPasswordCorrect) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = now + LOCKOUT_DURATION_MS;
        const lockUntilIso = new Date(user.lockUntil).toISOString();

        res.status(423).json({
          error: `Security Lockout: Incorrect password entered 3 times. Your account has been temporarily locked for 10 minutes.`,
          isLocked: true,
          remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
          lockUntil: lockUntilIso
        });
        return;
      }

      const attemptsRemaining = MAX_FAILED_ATTEMPTS - user.failedLoginAttempts;
      res.status(401).json({
        error: `Incorrect password. You have ${attemptsRemaining} attempt(s) remaining before your account is locked for 10 minutes.`,
        failedAttempts: user.failedLoginAttempts,
        attemptsRemaining,
        isLocked: false
      });
      return;
    }

    // Password is correct - reset failed attempts immediately
    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    // Check role restriction if requested
    if (requiredRole && user.role !== requiredRole) {
      res.status(403).json({
        error: `Access Denied: This account does not possess '${requiredRole}' administrative credentials.`
      });
      return;
    }

    const token = createToken({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    });

    res.status(200).json({
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error during login.' });
  }
};

/**
 * POST /api/auth/google
 */
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, fullName, avatarUrl, roleHint } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Google authentication requires email parameter.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = usersStore.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      user = {
        id: `usr-g-${Date.now()}`,
        fullName: fullName || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        role: roleHint === 'admin' ? 'admin' : 'customer',
        avatarUrl,
        createdAt: new Date().toISOString(),
        failedLoginAttempts: 0,
        lockUntil: null
      };
      usersStore.push(user);
    }

    const token = createToken({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    });

    res.status(200).json({
      message: 'Google authentication verified',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Google authentication failed.' });
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized session.' });
    return;
  }
  res.json({ user: req.user });
};

/**
 * GET /api/auth/users
 * Protected: Admin can view all registered users
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = Date.now();
    const usersDto: UserPublicDto[] = usersStore.map(u => {
      const isCurrentlyLocked = !!(u.lockUntil && u.lockUntil > now);
      return {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        avatarUrl: u.avatarUrl,
        createdAt: u.createdAt,
        failedLoginAttempts: u.failedLoginAttempts || 0,
        isLocked: isCurrentlyLocked,
        lockUntil: u.lockUntil && u.lockUntil > now ? new Date(u.lockUntil).toISOString() : null
      };
    });

    res.json(usersDto);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching users.' });
  }
};

/**
 * POST /api/auth/users/:id/unlock
 * Protected: Admin can manually unlock a locked user
 */
export const unlockUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = usersStore.find(u => u.id === id);

    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    res.json({
      message: `Account for ${user.fullName} (${user.email}) has been successfully unlocked.`,
      user: {
        id: user.id,
        email: user.email,
        isLocked: false
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error unlocking user.' });
  }
};

/**
 * DELETE /api/auth/users/:id
 * Protected: Admin can delete a user account
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idx = usersStore.findIndex(u => u.id === id);

    if (idx === -1) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const deleted = usersStore.splice(idx, 1)[0];
    res.json({ message: `User ${deleted.email} deleted successfully.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error deleting user.' });
  }
};
