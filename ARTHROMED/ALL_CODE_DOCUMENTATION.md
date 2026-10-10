# ArthroMed Clinical Suite — Core Technical Implementation Blueprint

## Architecture Index
1. Section I: Backend Microservices & Cryptographic Gateway
   - 1.1 HTTP Gateway Dispatcher & Express Initialization (`backend/src/index.ts`)
   - 1.2 Cryptographic Session Verifier & Privilege Guard (`backend/src/middleware/auth.middleware.ts`)
   - 1.3 Practitioner & Patient Entity Structures (`backend/src/models/user.model.ts`)
   - 1.4 Orthopedic Device & HCPCS Code Specifications (`backend/src/models/product.model.ts`)
   - 1.5 Account Lockout & Password Complexity Enforcement (`backend/src/controllers/auth.controller.ts`)
   - 1.6 Medical Catalog Repository & Search Dispatcher (`backend/src/controllers/product.controller.ts`)
   - 1.7 Identity Microservice Endpoint Mapping (`backend/src/routes/auth.routes.ts`)
   - 1.8 Inventory Management Endpoint Mapping (`backend/src/routes/product.routes.ts`)
2. Section II: Frontend State Architecture & Angular Signals
   - 2.1 Clinical Navigation Routing Schema (`frontend/src/app/app.routes.ts`)
   - 2.2 Administrative Clearance Route Barrier (`frontend/src/app/core/guards/admin.guard.ts`)
   - 2.3 Account Session & Credential Interfaces (`frontend/src/app/core/models/user.model.ts`)
   - 2.4 Medical Hardware & HCPCS Billing Interfaces (`frontend/src/app/core/models/product.model.ts`)
   - 2.5 Reactive Session Store & Lockout Monitor (`frontend/src/app/core/services/auth.service.ts`)
   - 2.6 Catalog Signals & Direct WhatsApp Tele-Inquiry Service (`frontend/src/app/core/services/products.service.ts`)
3. Section III: Core User Interface Controllers
   - 3.1 Global Clinical Navigation Header (`frontend/src/app/shared/components/navbar/navbar.component.ts`)
   - 3.2 Rehabilitation Hero Stage & Tele-Consultation Trigger (`frontend/src/app/pages/home/sections/hero/hero.component.ts`)
   - 3.3 Orthopedic Device Catalog & Filter Shell (`frontend/src/app/pages/products/products.component.ts`)
   - 3.4 Patient & Clinic Authentication Interface (`frontend/src/app/pages/auth/login/login.component.ts`)
   - 3.5 Global Medical Disclaimer & Helpline Shell (`frontend/src/app/shared/components/footer/footer.component.ts`)

---

## Section I: Backend Microservices & Cryptographic Gateway

### 1.1 HTTP Gateway Dispatcher & Express Initialization
**Source Unit:** `backend/src/index.ts`

```typescript
import express, { Application, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';
import uploadRoutes from './routes/upload.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const arthroServer: Application = express();
const LISTENING_PORT = Number(process.env.PORT) || 3000;
const CLIENT_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:4200';

const clinicalCorsPolicy: CorsOptions = {
  origin: (reqOrigin, allowCallback) => {
    const authorizedHosts = [CLIENT_ORIGIN, 'http://localhost:4200', 'http://127.0.0.1:4200'];
    if (!reqOrigin || authorizedHosts.includes(reqOrigin)) {
      allowCallback(null, true);
    } else {
      allowCallback(new Error('Cross-Origin Request Blocked by ArthroMed Security Firewall'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

arthroServer.use(cors(clinicalCorsPolicy));
arthroServer.use(express.json({ limit: '15mb' }));
arthroServer.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Heartbeat probe for orthopedic microservices
arthroServer.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    serviceState: 'active',
    gateway: 'ArthroMed Clinical API Suite',
    checkedAt: new Date().toISOString()
  });
});

// Primary microservice routers
arthroServer.use('/api/auth', authRoutes);
arthroServer.use('/api/products', productRoutes);
arthroServer.use('/api/upload', uploadRoutes);

// Clinical gateway default portal
arthroServer.get('/', (_req: Request, res: Response) => {
  res.type('html').send(`
    <main style="font-family: -apple-system, sans-serif; text-align: center; padding: 40px;">
      <h2 style="color: #0d382c;">ArthroMed Orthopedic Core Engine</h2>
      <p style="color: #475569;">Active gateway serving port ${LISTENING_PORT}.</p>
      <a href="/api/products" style="color: #0f766e; text-decoration: underline;">Access Catalog API</a>
    </main>
  `);
});

// Centralized error interceptor
arthroServer.use((fault: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = Number(fault?.status) || 500;
  const failureDetail = fault?.message ?? 'Unspecified Clinical Gateway Exception';
  console.error('[ArthroMed Failure Hook]:', failureDetail);
  res.status(statusCode).json({ faultDetail: failureDetail, success: false });
});

arthroServer.listen(LISTENING_PORT, () => {
  console.log(`[ArthroMed Engine] Online and listening on port: ${LISTENING_PORT}`);
});

export default arthroServer;
```

---

### 1.2 Cryptographic Session Verifier & Privilege Guard
**Source Unit:** `backend/src/middleware/auth.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const CRYPTO_SIGNING_SALT = process.env.JWT_SECRET || 'arthromed-clinical-super-secret-key-2025';

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

export function createToken(accountPayload: AuthenticatedUser): string {
  const tokenHeaderBase64 = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const tokenClaimsBase64 = Buffer.from(
    JSON.stringify({ ...accountPayload, exp: Date.now() + 7 * 86400000 })
  ).toString('base64url');
  
  const hmacDigest = crypto
    .createHmac('sha256', CRYPTO_SIGNING_SALT)
    .update(`${tokenHeaderBase64}.${tokenClaimsBase64}`)
    .digest('base64url');

  return `${tokenHeaderBase64}.${tokenClaimsBase64}.${hmacDigest}`;
}

export function verifyToken(serializedTicket: string): AuthenticatedUser | null {
  try {
    const ticketSegments = serializedTicket.split('.');
    if (ticketSegments.length !== 3) return null;

    const [headerB64, claimsB64, checksumB64] = ticketSegments;
    const computedDigest = crypto
      .createHmac('sha256', CRYPTO_SIGNING_SALT)
      .update(`${headerB64}.${claimsB64}`)
      .digest('base64url');

    if (checksumB64 !== computedDigest) return null;

    const decodedClaims = JSON.parse(Buffer.from(claimsB64, 'base64url').toString('utf8'));
    if (decodedClaims.exp && Date.now() > decodedClaims.exp) return null;

    return {
      id: decodedClaims.id,
      email: decodedClaims.email,
      role: decodedClaims.role,
      fullName: decodedClaims.fullName
    };
  } catch {
    return null;
  }
}

export const requireAuth = (req: Request, res: Response, proceed: NextFunction): void => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Clinical credential missing. Bearer session ticket required.' });
    return;
  }

  const rawTicket = authorizationHeader.slice(7).trim();
  const identity = verifyToken(rawTicket);

  if (!identity) {
    res.status(401).json({ error: 'Session ticket expired or tampered. Re-authentication required.' });
    return;
  }

  req.user = identity;
  proceed();
};

export const requireAdmin = (req: Request, res: Response, proceed: NextFunction): void => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Administrative barrier: Master token missing.' });
    return;
  }

  const rawTicket = authorizationHeader.slice(7).trim();
  const identity = verifyToken(rawTicket);

  if (!identity) {
    res.status(401).json({ error: 'Administrative credentials invalid.' });
    return;
  }

  if (identity.role !== 'admin') {
    res.status(403).json({ error: 'Privilege fault: Action reserved exclusively for System Administrator.' });
    return;
  }

  req.user = identity;
  proceed();
};
```

---

### 1.3 Practitioner & Patient Entity Structures
**Source Unit:** `backend/src/models/user.model.ts`

```typescript
export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  failedLoginAttempts?: number;
  lockUntil?: number | null; // Millisecond epoch marking security lockout expiration
  isLocked?: boolean;
}

export interface UserPublicDto {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  failedLoginAttempts: number;
  isLocked: boolean;
  lockUntil: string | null;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
  };
}
```

---

### 1.4 Orthopedic Device & HCPCS Code Specifications
**Source Unit:** `backend/src/models/product.model.ts`

```typescript
export type ProductCategory =
  | 'Knee'
  | 'Shoulder'
  | 'Cold Therapy'
  | 'Spine'
  | 'Foot & Ankle'
  | 'General Orthopedics';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  sku: string;
  price: string | number;
  imageUrl: string;
  shortDescription: string;
  fullDescription: string;
  keyFeatures: string[];
  sizes: string[];
  hcpcsCode: string;
  fittingGuideUrl: string;
  specs: ProductSpec[];
  isPublished: boolean;
  createdAt: string;
}
```

---

### 1.5 Account Lockout & Password Complexity Enforcement
**Source Unit:** `backend/src/controllers/auth.controller.ts`

```typescript
import { Request, Response } from 'express';
import crypto from 'crypto';
import { User, UserPublicDto } from '../models/user.model';
import { createToken } from '../middleware/auth.middleware';

function hashPassword(plainSecret: string): string {
  return crypto.createHash('sha256').update(`${plainSecret}_arthromed_clinical_pepper`).digest('hex');
}

const SECURITY_COOLDOWN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const THRESHOLD_FAILED_TRIES = 3;

export function validatePasswordStrength(credential: string): { isValid: boolean; message?: string } {
  const meetsMinLength = credential.length >= 8;
  const hasCapitalGlyph = /[A-Z]/.test(credential);
  const hasSmallGlyph = /[a-z]/.test(credential);
  const hasNumericDigit = /[0-9]/.test(credential);
  const hasSymbolicGlyph = /[^A-Za-z0-9]/.test(credential);

  if (!meetsMinLength) return { isValid: false, message: 'Password complexity requires minimum 8 characters.' };
  if (!hasCapitalGlyph) return { isValid: false, message: 'Password complexity requires at least one uppercase letter (A-Z).' };
  if (!hasSmallGlyph) return { isValid: false, message: 'Password complexity requires at least one lowercase letter (a-z).' };
  if (!hasNumericDigit) return { isValid: false, message: 'Password complexity requires at least one number digit (0-9).' };
  if (!hasSymbolicGlyph) return { isValid: false, message: 'Password complexity requires at least one special symbol.' };

  return { isValid: true };
}

export function validateEmailFormat(electronicMail: string): boolean {
  const mailExpression = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return mailExpression.test(electronicMail.trim());
}

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

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !fullName.trim()) {
      res.status(400).json({ error: 'Patient/practitioner name is mandatory.' });
      return;
    }
    if (!email || !validateEmailFormat(email)) {
      res.status(400).json({ error: 'Please enter a valid electronic mail identifier.' });
      return;
    }

    const complexityAudit = validatePasswordStrength(password || '');
    if (!complexityAudit.isValid) {
      res.status(400).json({ error: complexityAudit.message });
      return;
    }

    const scrubbedMail = email.toLowerCase().trim();
    const duplicateProfile = usersStore.find(u => u.email.toLowerCase() === scrubbedMail);
    if (duplicateProfile) {
      res.status(409).json({ error: 'This electronic mail is already enrolled in the ArthroMed registry.' });
      return;
    }

    const generatedAccount: User = {
      id: `patient-${Date.now()}`,
      fullName: fullName.trim(),
      email: scrubbedMail,
      passwordHash: hashPassword(password),
      role: 'customer',
      createdAt: new Date().toISOString(),
      failedLoginAttempts: 0,
      lockUntil: null
    };

    usersStore.push(generatedAccount);

    const sessionTicket = createToken({
      id: generatedAccount.id,
      email: generatedAccount.email,
      fullName: generatedAccount.fullName,
      role: generatedAccount.role
    });

    res.status(201).json({
      message: 'Account enrollment complete.',
      token: sessionTicket,
      user: {
        id: generatedAccount.id,
        fullName: generatedAccount.fullName,
        email: generatedAccount.email,
        role: generatedAccount.role
      }
    });
  } catch (exception: any) {
    res.status(500).json({ error: exception.message || 'Enrollment pipeline fault.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, requiredRole } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Both electronic mail and password must be provided.' });
      return;
    }

    const scrubbedMail = email.toLowerCase().trim();
    const candidateUser = usersStore.find(record => record.email.toLowerCase() === scrubbedMail);
    const currentClock = Date.now();

    if (!candidateUser) {
      res.status(401).json({ error: 'Unrecognized credentials. Verify email or password.' });
      return;
    }

    // Cooldown verification
    if (candidateUser.lockUntil && candidateUser.lockUntil > currentClock) {
      const msLeft = candidateUser.lockUntil - currentClock;
      res.status(423).json({
        error: `Security Lockout Active: Account disabled after repeated failures. Remaining wait: ${Math.ceil(msLeft / 60000)} minute(s).`,
        isLocked: true,
        remainingSeconds: Math.ceil(msLeft / 1000),
        lockUntil: new Date(candidateUser.lockUntil).toISOString()
      });
      return;
    }

    if (candidateUser.lockUntil && candidateUser.lockUntil <= currentClock) {
      candidateUser.lockUntil = null;
      candidateUser.failedLoginAttempts = 0;
    }

    const secretMatches = candidateUser.passwordHash === hashPassword(password);
    if (!secretMatches) {
      candidateUser.failedLoginAttempts = (candidateUser.failedLoginAttempts || 0) + 1;

      if (candidateUser.failedLoginAttempts >= THRESHOLD_FAILED_TRIES) {
        candidateUser.lockUntil = currentClock + SECURITY_COOLDOWN_WINDOW_MS;
        res.status(423).json({
          error: 'Account locked for 10 minutes following 3 consecutive unsuccessful attempts.',
          isLocked: true,
          remainingSeconds: Math.ceil(SECURITY_COOLDOWN_WINDOW_MS / 1000),
          lockUntil: new Date(candidateUser.lockUntil).toISOString()
        });
        return;
      }

      const triesRemaining = THRESHOLD_FAILED_TRIES - candidateUser.failedLoginAttempts;
      res.status(401).json({
        error: `Invalid password entry. ${triesRemaining} attempt(s) remaining before automatic 10-minute cooldown.`,
        failedAttempts: candidateUser.failedLoginAttempts,
        attemptsRemaining: triesRemaining,
        isLocked: false
      });
      return;
    }

    // Reset attempts upon successful verification
    candidateUser.failedLoginAttempts = 0;
    candidateUser.lockUntil = null;

    if (requiredRole && candidateUser.role !== requiredRole) {
      res.status(403).json({ error: `Privilege restriction: Account does not possess '${requiredRole}' classification.` });
      return;
    }

    const sessionTicket = createToken({
      id: candidateUser.id,
      email: candidateUser.email,
      fullName: candidateUser.fullName,
      role: candidateUser.role
    });

    res.status(200).json({
      message: 'Access granted.',
      token: sessionTicket,
      user: {
        id: candidateUser.id,
        fullName: candidateUser.fullName,
        email: candidateUser.email,
        role: candidateUser.role
      }
    });
  } catch (exception: any) {
    res.status(500).json({ error: exception.message || 'Authentication pipeline failure.' });
  }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, fullName, avatarUrl, roleHint } = req.body;
    if (!email) {
      res.status(400).json({ error: 'OAuth profile missing electronic mail.' });
      return;
    }

    const scrubbedMail = email.toLowerCase().trim();
    let account = usersStore.find(u => u.email.toLowerCase() === scrubbedMail);

    if (!account) {
      account = {
        id: `oauth-${Date.now()}`,
        fullName: fullName || scrubbedMail.split('@')[0],
        email: scrubbedMail,
        role: roleHint === 'admin' ? 'admin' : 'customer',
        avatarUrl,
        createdAt: new Date().toISOString(),
        failedLoginAttempts: 0,
        lockUntil: null
      };
      usersStore.push(account);
    }

    const sessionTicket = createToken({
      id: account.id,
      email: account.email,
      fullName: account.fullName,
      role: account.role
    });

    res.status(200).json({ message: 'Federated identity verified.', token: sessionTicket, user: account });
  } catch (exception: any) {
    res.status(500).json({ error: exception.message || 'Federated verification failed.' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Active session not established.' });
    return;
  }
  res.json({ user: req.user });
};

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  const currentClock = Date.now();
  const serializedUsers: UserPublicDto[] = usersStore.map(account => ({
    id: account.id,
    fullName: account.fullName,
    email: account.email,
    role: account.role,
    avatarUrl: account.avatarUrl,
    createdAt: account.createdAt,
    failedLoginAttempts: account.failedLoginAttempts || 0,
    isLocked: !!(account.lockUntil && account.lockUntil > currentClock),
    lockUntil: account.lockUntil && account.lockUntil > currentClock ? new Date(account.lockUntil).toISOString() : null
  }));
  res.json(serializedUsers);
};

export const unlockUser = async (req: Request, res: Response): Promise<void> => {
  const targetAccount = usersStore.find(u => u.id === req.params.id);
  if (!targetAccount) {
    res.status(404).json({ error: 'Specified user record absent.' });
    return;
  }
  targetAccount.failedLoginAttempts = 0;
  targetAccount.lockUntil = null;
  res.json({ message: `Administrative unlock completed for ${targetAccount.email}.` });
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const targetIdx = usersStore.findIndex(u => u.id === req.params.id);
  if (targetIdx === -1) {
    res.status(404).json({ error: 'Specified user record absent.' });
    return;
  }
  const [purgedAccount] = usersStore.splice(targetIdx, 1);
  res.json({ message: `Account for ${purgedAccount.email} purged successfully.` });
};
```

---

### 1.6 Medical Catalog Repository & Search Dispatcher
**Source Unit:** `backend/src/controllers/product.controller.ts`

```typescript
import { Request, Response } from 'express';
import { Product } from '../models/product.model';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-000',
    name: 'Breg T Scope Premier Post-Op Knee Brace',
    category: 'Knee',
    sku: 'BREG-TSCOPE-001',
    price: 'Request Quote',
    imageUrl: '/images/breg-tscope-hero.jpg',
    shortDescription: 'Gold-standard telescoping post-operative knee brace with range-of-motion control dials, quick-lock latch, and BridgeTech incision pads.',
    fullDescription: 'The Breg T Scope Premier Post-Op Knee Brace is the world-renowned clinical standard for range of motion control and immobilization following ACL, PCL, MCL, LCL, and meniscal repairs.',
    keyFeatures: [
      'Telescoping hinge bars extend from 17" to 27" with simple push-button controls',
      'Range of Motion hinge controls extension from -10° to 90° and flexion from -10° to 120°',
      'One-touch quick drop-lock latch at -10°, 0°, 10°, 20°, and 30°'
    ],
    sizes: ['Universal (Left/Right)'],
    hcpcsCode: 'L1832 / L1833',
    fittingGuideUrl: 'https://www.breg.com/wp-content/uploads/2021/05/T-Scope-Premier-Instructions.pdf',
    specs: [
      { label: 'Brace Type', value: 'Post-Operative ROM Knee Brace' },
      { label: 'Length Range', value: '17 in to 27 in (43.2 cm to 68.6 cm)' }
    ],
    isPublished: true,
    createdAt: new Date('2025-03-01T08:00:00Z').toISOString()
  }
];

let catalogStore: Product[] = [...INITIAL_PRODUCTS];

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, sort } = req.query;
    let matchingItems = [...catalogStore];

    if (category && typeof category === 'string' && category !== 'All') {
      matchingItems = matchingItems.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === 'string' && search.trim()) {
      const needle = search.toLowerCase().trim();
      matchingItems = matchingItems.filter(item =>
        item.name.toLowerCase().includes(needle) ||
        item.sku.toLowerCase().includes(needle) ||
        item.shortDescription.toLowerCase().includes(needle)
      );
    }

    if (sort === 'az') matchingItems.sort((x, y) => x.name.localeCompare(y.name));
    else if (sort === 'za') matchingItems.sort((x, y) => y.name.localeCompare(x.name));
    else if (sort === 'newest') matchingItems.sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime());

    res.json(matchingItems);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error querying orthopedic inventory.' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const item = catalogStore.find(p => p.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Clinical hardware entry not located in catalog.' });
    return;
  }
  res.json(item);
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const formFields = req.body;
    const freshEntry: Product = {
      ...formFields,
      id: formFields.id || `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isPublished: formFields.isPublished ?? true,
      specs: formFields.specs || [],
      keyFeatures: formFields.keyFeatures || [],
      sizes: formFields.sizes || ['Universal']
    };
    catalogStore.unshift(freshEntry);
    res.status(201).json(freshEntry);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failure creating inventory record.' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const targetIndex = catalogStore.findIndex(p => p.id === req.params.id);
  if (targetIndex === -1) {
    res.status(404).json({ error: 'Clinical hardware record not located.' });
    return;
  }
  catalogStore[targetIndex] = { ...catalogStore[targetIndex], ...req.body, id: req.params.id };
  res.json(catalogStore[targetIndex]);
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const targetIndex = catalogStore.findIndex(p => p.id === req.params.id);
  if (targetIndex === -1) {
    res.status(404).json({ error: 'Clinical hardware record not located.' });
    return;
  }
  const [removedEntry] = catalogStore.splice(targetIndex, 1);
  res.json({ message: 'Catalog record archived successfully.', product: removedEntry });
};
```

---

### 1.7 Identity Microservice Endpoint Mapping
**Source Unit:** `backend/src/routes/auth.routes.ts`

```typescript
import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  getMe,
  getAllUsers,
  unlockUser,
  deleteUser
} from '../controllers/auth.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const identityRouter = Router();

// Publicly reachable identity entry points
identityRouter.post('/register', register);
identityRouter.post('/login', login);
identityRouter.post('/google', googleAuth);
identityRouter.get('/me', requireAuth, getMe);

// Administrative privilege management entry points
identityRouter.get('/users', requireAdmin, getAllUsers);
identityRouter.post('/users/:id/unlock', requireAdmin, unlockUser);
identityRouter.delete('/users/:id', requireAdmin, deleteUser);

export default identityRouter;
```

---

### 1.8 Inventory Management Endpoint Mapping
**Source Unit:** `backend/src/routes/product.routes.ts`

```typescript
import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';
import { requireAdmin } from '../middleware/auth.middleware';

const inventoryRouter = Router();

// Catalog discovery endpoints
inventoryRouter.get('/', getProducts);
inventoryRouter.get('/:id', getProductById);

// Inventory curation endpoints (restricted to clinical administration)
inventoryRouter.post('/', requireAdmin, createProduct);
inventoryRouter.put('/:id', requireAdmin, updateProduct);
inventoryRouter.delete('/:id', requireAdmin, deleteProduct);

export default inventoryRouter;
```

---

## Section II: Frontend State Architecture & Angular Signals

### 2.1 Clinical Navigation Routing Schema
**Source Unit:** `frontend/src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/products/product-detail/product-detail.component';
import { AdminProductsComponent } from './pages/admin/admin-products.component';
import { AdminUsersComponent } from './pages/admin/users/admin-users.component';
import { ProductFormComponent } from './pages/admin/product-form/product-form.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { AdminLoginComponent } from './pages/admin/login/admin-login.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Public clinical discovery views
  { path: '', component: HomeComponent, title: 'ArthroMed | Premier Breg & Orthopedic Solutions' },
  { path: 'products', component: ProductsComponent, title: 'Product Catalog | ArthroMed Orthopedic Care' },
  { path: 'products/:id', component: ProductDetailComponent, title: 'Product Specifications | ArthroMed' },
  { path: 'login', component: LoginComponent, title: 'Patient & Clinic Sign In | ArthroMed' },
  { path: 'signup', component: SignupComponent, title: 'Create Account | ArthroMed' },

  // Administrative control panel routes
  { path: 'admin', redirectTo: 'admin/products', pathMatch: 'full' },
  { path: 'admin/login', component: AdminLoginComponent, title: 'Clinical Administration Sign In | ArthroMed' },
  { path: 'admin/products', component: AdminProductsComponent, canActivate: [adminGuard], title: 'Inventory Administration' },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [adminGuard], title: 'User Management & Security' },
  { path: 'admin/products/new', component: ProductFormComponent, canActivate: [adminGuard], title: 'Register New Product' },
  { path: 'admin/products/edit/:id', component: ProductFormComponent, canActivate: [adminGuard], title: 'Edit Product' },

  // Default catch-all redirection
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
```

---

### 2.2 Administrative Clearance Route Barrier
**Source Unit:** `frontend/src/app/core/guards/admin.guard.ts`

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (_routeSnapshot, stateSnapshot) => {
  const sessionManager = inject(AuthService);
  const navigationRouter = inject(Router);

  if (sessionManager.isAuthenticated() && sessionManager.userRole() === 'admin') {
    return true;
  }

  // Intercept unauthorized requests and redirect to restricted admin sign-in
  return navigationRouter.createUrlTree(['/admin/login'], {
    queryParams: { returnUrl: stateSnapshot.url }
  });
};
```

---

### 2.3 Account Session & Credential Interfaces
**Source Unit:** `frontend/src/app/core/models/user.model.ts`

```typescript
export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt?: string;
  failedLoginAttempts?: number;
  isLocked?: boolean;
  lockUntil?: string | null;
}

export interface UserPublicDto {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  failedLoginAttempts: number;
  isLocked: boolean;
  lockUntil: string | null;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LockoutError {
  error: string;
  isLocked: boolean;
  remainingSeconds: number;
  lockUntil: string;
  attemptsRemaining?: number;
}
```

---

### 2.4 Medical Hardware & HCPCS Billing Interfaces
**Source Unit:** `frontend/src/app/core/models/product.model.ts`

```typescript
export type ProductCategory =
  | 'Knee'
  | 'Shoulder'
  | 'Cold Therapy'
  | 'Spine'
  | 'Foot & Ankle'
  | 'General Orthopedics';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  sku: string;
  price: string | number;
  imageUrl: string;
  shortDescription: string;
  fullDescription: string;
  keyFeatures: string[];
  sizes: string[];
  hcpcsCode: string;
  fittingGuideUrl: string;
  specs: ProductSpec[];
  isPublished: boolean;
  createdAt: string;
}
```

---

### 2.5 Reactive Session Store & Lockout Monitor
**Source Unit:** `frontend/src/app/core/services/auth.service.ts`

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { User, UserRole, AuthResponse, UserPublicDto } from '../models/user.model';

const STORAGE_SESSION_TOKEN = 'arthromed_auth_token';
const STORAGE_SESSION_PROFILE = 'arthromed_auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authGatewayUrl = 'http://localhost:3000/api/auth';

  // Angular 18 reactive signals
  readonly currentUser = signal<User | null>(null);
  readonly token = signal<string | null>(null);

  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly userRole = computed<UserRole | null>(() => this.currentUser()?.role || null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(private http: HttpClient) {
    this.rehydrateCachedSession();
  }

  private rehydrateCachedSession(): void {
    try {
      const persistedToken = localStorage.getItem(STORAGE_SESSION_TOKEN);
      const persistedProfile = localStorage.getItem(STORAGE_SESSION_PROFILE);
      if (persistedToken && persistedProfile) {
        this.token.set(persistedToken);
        this.currentUser.set(JSON.parse(persistedProfile));
      }
    } catch {
      this.purgeSession();
    }
  }

  private commitSession(payload: AuthResponse): void {
    this.token.set(payload.token);
    this.currentUser.set(payload.user);
    localStorage.setItem(STORAGE_SESSION_TOKEN, payload.token);
    localStorage.setItem(STORAGE_SESSION_PROFILE, JSON.stringify(payload.user));
  }

  private purgeSession(): void {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem(STORAGE_SESSION_TOKEN);
    localStorage.removeItem(STORAGE_SESSION_PROFILE);
  }

  getToken(): string | null {
    return this.token();
  }

  private getAuthHeaders(): { [header: string]: string } {
    const activeToken = this.getToken() || localStorage.getItem(STORAGE_SESSION_TOKEN);
    return activeToken ? { Authorization: `Bearer ${activeToken}` } : {};
  }

  login(credentials: { email: string; password: string; requiredRole?: UserRole }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authGatewayUrl}/login`, credentials).pipe(
      tap(res => this.commitSession(res)),
      catchError(err => throwError(() => err.error || err))
    );
  }

  register(payload: { fullName: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authGatewayUrl}/register`, payload).pipe(
      tap(res => this.commitSession(res)),
      catchError(err => throwError(() => err.error || err))
    );
  }

  googleAuth(roleHint: UserRole = 'customer'): Observable<AuthResponse> {
    const payload = {
      email: roleHint === 'admin' ? 'admin.google@arthromed.com' : 'google.user@gmail.com',
      fullName: roleHint === 'admin' ? 'Dr. Google Admin' : 'Alex Mercer (Google Verified)',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      roleHint
    };
    return this.http.post<AuthResponse>(`${this.authGatewayUrl}/google`, payload).pipe(
      tap(res => this.commitSession(res))
    );
  }

  getUsers(): Observable<UserPublicDto[]> {
    return this.http.get<UserPublicDto[]>(`${this.authGatewayUrl}/users`, { headers: this.getAuthHeaders() });
  }

  unlockUser(userId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.authGatewayUrl}/users/${userId}/unlock`, {}, { headers: this.getAuthHeaders() });
  }

  deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.authGatewayUrl}/users/${userId}`, { headers: this.getAuthHeaders() });
  }

  logout(): void {
    this.purgeSession();
  }
}
```

---

### 2.6 Catalog Signals & Direct WhatsApp Tele-Inquiry Service
**Source Unit:** `frontend/src/app/core/services/products.service.ts`

```typescript
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly catalogBaseUrl = 'http://localhost:3000/api';

  // Reactive state signals
  public readonly products = signal<Product[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly activeCategory = signal<string>('All');
  public readonly searchQuery = signal<string>('');
  public readonly activeSort = signal<string>('newest');

  // Direct WhatsApp Inquiry Channel (+91 8604351930)
  public readonly whatsappNumber = '918604351930';

  constructor(private http: HttpClient) {}

  /**
   * Generates a pre-filled WhatsApp click-to-chat URL for inquiries & doctor quotes
   */
  getWhatsAppInquiryUrl(productName?: string, sku?: string): string {
    const baseEndpoint = `https://wa.me/${this.whatsappNumber}`;
    let inquiryPrompt = 'Hello ArthroMed! I would like to inquire about your clinical orthopedic equipment.';
    if (productName) {
      inquiryPrompt = `Hello ArthroMed! I would like to request doctor / clinic pricing for ${productName}${sku ? ` (SKU: ${sku})` : ''}. Could you please provide our practice with quote details?`;
    }
    return `${baseEndpoint}?text=${encodeURIComponent(inquiryPrompt)}`;
  }

  getProducts(filterCriteria?: { category?: string; search?: string; sort?: string }): Observable<Product[]> {
    this.isLoading.set(true);
    let queryParams = new HttpParams();

    if (filterCriteria?.category && filterCriteria.category !== 'All') queryParams = queryParams.set('category', filterCriteria.category);
    if (filterCriteria?.search) queryParams = queryParams.set('search', filterCriteria.search);
    if (filterCriteria?.sort) queryParams = queryParams.set('sort', filterCriteria.sort);

    return this.http.get<Product[]>(`${this.catalogBaseUrl}/products`, { params: queryParams }).pipe(
      tap((loadedCatalog) => {
        this.products.set(loadedCatalog);
        this.isLoading.set(false);
      })
    );
  }

  getProductById(hardwareId: string): Observable<Product> {
    this.isLoading.set(true);
    return this.http.get<Product>(`${this.catalogBaseUrl}/products/${hardwareId}`).pipe(
      tap(() => this.isLoading.set(false))
    );
  }

  private getAuthHeaders(): { [header: string]: string } {
    const bearer = localStorage.getItem('arthromed_auth_token');
    return bearer ? { Authorization: `Bearer ${bearer}` } : {};
  }

  createProduct(draft: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.catalogBaseUrl}/products`, draft, { headers: this.getAuthHeaders() }).pipe(
      tap(created => this.products.update(cache => [created, ...cache]))
    );
  }

  updateProduct(hardwareId: string, diff: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.catalogBaseUrl}/products/${hardwareId}`, diff, { headers: this.getAuthHeaders() }).pipe(
      tap(updated => this.products.update(cache => cache.map(item => item.id === hardwareId ? updated : item)))
    );
  }

  deleteProduct(hardwareId: string): Observable<{ success: boolean }> {
    return this.http.delete<{ message: string }>(`${this.catalogBaseUrl}/products/${hardwareId}`, { headers: this.getAuthHeaders() }).pipe(
      tap(() => this.products.update(cache => cache.filter(item => item.id !== hardwareId)))
    );
  }
}
```

---

## Section III: Core User Interface Controllers

### 3.1 Global Clinical Navigation Header
**Source Unit:** `frontend/src/app/shared/components/navbar/navbar.component.ts`

```typescript
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../core/services/products.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <header class="header">
      <nav class="navbar container">
        <a routerLink="/" (click)="scrollToTop($event)" class="brand-logo" title="ArthroMed - Healthcare for better life !">
          <img src="/images/arthromed-logo.png" alt="ArthroMed Logo" class="brand-logo-img" />
        </a>

        <ul class="nav-links">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-link">Home</a></li>
          <li><a href="/#care-section" (click)="scrollToSection('care-section', $event)" class="nav-link">Services</a></li>
          <li><a routerLink="/products" routerLinkActive="active" class="nav-link">For Patients</a></li>
          <li><a [routerLink]="['/products']" [queryParams]="{ category: 'Knee' }" class="nav-link">For Providers</a></li>
          <li><a href="/#about-section" (click)="scrollToSection('about-section', $event)" class="nav-link">Resources</a></li>
        </ul>

        <div class="header-actions">
          <button type="button" class="btn-icon-search" (click)="toggleSearch()" aria-label="Search Catalog">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>

          <a [href]="whatsAppInquiryUrl" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-nav">
            <span>WhatsApp Query</span>
          </a>

          @if (authService.isAuthenticated()) {
            <button type="button" class="btn-login" (click)="authService.logout()">Sign Out</button>
          } @else {
            <a routerLink="/login" class="btn-login">Sign In</a>
          }
        </div>
      </nav>
    </header>
  `,
  styles: [`/* Component styles omitted for print documentation brevity */`]
})
export class NavbarComponent {
  isSearchOpen = signal(false);
  searchQuery = signal('');

  constructor(
    public productsService: ProductsService,
    public authService: AuthService,
    private router: Router
  ) {}

  get whatsAppInquiryUrl(): string {
    return this.productsService.getWhatsAppInquiryUrl();
  }

  toggleSearch(): void {
    this.isSearchOpen.update(v => !v);
  }

  scrollToTop(event?: Event): void {
    if (event) event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToSection(sectionId: string, event?: Event): void {
    if (event) event.preventDefault();
    const targetElement = document.getElementById(sectionId);
    if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else this.router.navigate(['/'], { fragment: sectionId });
  }
}
```

---

### 3.2 Rehabilitation Hero Stage & Tele-Consultation Trigger
**Source Unit:** `frontend/src/app/pages/home/sections/hero/hero.component.ts`

```typescript
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../../core/services/products.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-left">
          <span class="eyebrow-tag">BETTER CARE. BRIGHTER DAYS.</span>
          <h1 class="hero-title">Healthcare that fits your life</h1>
          <p class="hero-description">
            Access trusted orthopedic equipment, certified Breg® braces, direct WhatsApp inquiries, and clinical recovery support — all in one place.
          </p>

          <div class="hero-actions">
            <!-- Primary WhatsApp Query CTA (Direct to +91 8604351930) -->
            <a [href]="whatsAppUrl" target="_blank" rel="noopener noreferrer" class="btn-primary-whatsapp" id="btn-hero-whatsapp-query">
              <span>WhatsApp Query</span>
            </a>
            <a routerLink="/products" class="btn-view-catalog">Browse Catalog</a>
          </div>
        </div>

        <div class="hero-right">
          <div class="hero-img-wrapper">
            <img src="/images/breg-tscope-hero.jpg" alt="Breg T Scope Post-Op Knee Brace" class="hero-main-img" />
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`/* Component styles omitted for print documentation brevity */`]
})
export class HeroComponent {
  constructor(private productsService: ProductsService) {}

  get whatsAppUrl(): string {
    return this.productsService.getWhatsAppInquiryUrl();
  }
}
```

---

### 3.3 Orthopedic Device Catalog & Filter Shell
**Source Unit:** `frontend/src/app/pages/products/products.component.ts`

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.model';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FilterBarComponent, ProductCardComponent, EmptyStateComponent, LoadingSkeletonComponent],
  template: `
    <div class="catalog-page">
      <section class="catalog-header-banner">
        <div class="container">
          <h1 class="catalog-title">Certified Orthopedic & Cold Therapy Equipment</h1>
          <p class="catalog-subtitle">Explore authentic Breg® bracing with pre-mapped HCPCS billing codes.</p>
        </div>
      </section>

      <section class="catalog-body-section container">
        <app-filter-bar
          [selectedCategory]="category()"
          [searchQuery]="search()"
          [selectedSort]="sort()"
          (categoryChange)="onCategorySelected($event)"
          (searchChange)="onSearchChanged($event)"
          (sortChange)="onSortChanged($event)">
        </app-filter-bar>

        @if (isLoading()) {
          <app-loading-skeleton [count]="6"></app-loading-skeleton>
        } @else {
          @if (filteredProducts().length > 0) {
            <div class="products-grid">
              @for (prod of filteredProducts(); track prod.id) {
                <app-product-card [product]="prod"></app-product-card>
              }
            </div>
          } @else {
            <app-empty-state (resetFilters)="resetAllFilters()"></app-empty-state>
          }
        }
      </section>
    </div>
  `,
  styles: [`/* Component styles omitted for print documentation brevity */`]
})
export class ProductsComponent implements OnInit {
  category = signal<string>('All');
  search = signal<string>('');
  sort = signal<string>('newest');
  filteredProducts = signal<Product[]>([]);
  isLoading = signal<boolean>(false);

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryMap => {
      if (queryMap['category']) this.category.set(queryMap['category']);
      if (queryMap['search']) this.search.set(queryMap['search']);
      if (queryMap['sort']) this.sort.set(queryMap['sort']);
      this.fetchData();
    });
  }

  fetchData(): void {
    this.isLoading.set(true);
    this.productsService.getProducts({
      category: this.category(),
      search: this.search(),
      sort: this.sort()
    }).subscribe(inventory => {
      this.filteredProducts.set(inventory.filter(p => p.isPublished !== false));
      this.isLoading.set(false);
    });
  }

  onCategorySelected(cat: string): void { this.category.set(cat); this.syncUrlState(); this.fetchData(); }
  onSearchChanged(term: string): void { this.search.set(term); this.syncUrlState(); this.fetchData(); }
  onSortChanged(sortVal: string): void { this.sort.set(sortVal); this.syncUrlState(); this.fetchData(); }

  resetAllFilters(): void {
    this.category.set('All');
    this.search.set('');
    this.sort.set('newest');
    this.syncUrlState();
    this.fetchData();
  }

  private syncUrlState(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: this.category(), search: this.search(), sort: this.sort() },
      queryParamsHandling: 'replace'
    });
  }
}
```

---

### 3.4 Patient & Clinic Authentication Interface
**Source Unit:** `frontend/src/app/pages/auth/login/login.component.ts`

```typescript
import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1 class="auth-title">Patient & Clinic Sign In</h1>

        <!-- 10-Minute Security Lockout Notification -->
        @if (isAccountLocked()) {
          <div class="lockout-banner">
            <h4>Account Temporarily Locked</h4>
            <p>3 consecutive failed attempts detected. Cooldown remaining: <strong>{{ formattedRemainingTime() }}</strong></p>
          </div>
        }

        @if (errorMessage() && !isAccountLocked()) {
          <div class="alert-error">{{ errorMessage() }}</div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input id="email" type="email" formControlName="email" placeholder="doctor@clinic.com" />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" [type]="showPassword() ? 'text' : 'password'" formControlName="password" />
          </div>

          <button type="submit" [disabled]="isLoading() || isAccountLocked()" class="btn-auth-submit">
            {{ isLoading() ? 'Verifying...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`/* Component styles omitted for print documentation brevity */`]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  isAccountLocked = signal(false);
  lockoutRemainingSeconds = signal(0);
  attemptsRemaining = signal<number | null>(null);
  private cooldownTicker: any = null;
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
  }

  ngOnInit(): void {
    const cachedLockEpoch = localStorage.getItem('arthromed_login_lockout');
    if (cachedLockEpoch && Number(cachedLockEpoch) > Date.now()) {
      const remainingSeconds = Math.ceil((Number(cachedLockEpoch) - Date.now()) / 1000);
      this.initiateLockoutTimer(remainingSeconds);
    }
  }

  ngOnDestroy(): void {
    if (this.cooldownTicker) clearInterval(this.cooldownTicker);
  }

  formattedRemainingTime(): string {
    const totalSec = this.lockoutRemainingSeconds();
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private initiateLockoutTimer(cooldownSeconds: number): void {
    this.isAccountLocked.set(true);
    this.lockoutRemainingSeconds.set(cooldownSeconds);
    localStorage.setItem('arthromed_login_lockout', String(Date.now() + cooldownSeconds * 1000));

    this.cooldownTicker = setInterval(() => {
      const nextTick = this.lockoutRemainingSeconds() - 1;
      if (nextTick <= 0) {
        clearInterval(this.cooldownTicker);
        this.isAccountLocked.set(false);
        this.lockoutRemainingSeconds.set(0);
        this.errorMessage.set('');
        localStorage.removeItem('arthromed_login_lockout');
      } else {
        this.lockoutRemainingSeconds.set(nextTick);
      }
    }, 1000);
  }

  onSubmit(): void {
    if (this.isAccountLocked() || this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      requiredRole: 'customer'
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        if (err.isLocked || err.remainingSeconds) {
          this.initiateLockoutTimer(err.remainingSeconds || 600);
        }
        this.errorMessage.set(err.error || 'Authentication credential rejected.');
      }
    });
  }
}
```

---

### 3.5 Global Medical Disclaimer & Helpline Shell
**Source Unit:** `frontend/src/app/shared/components/footer/footer.component.ts`

```typescript
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-col">
          <a routerLink="/" class="footer-brand">
            <img src="/images/arthromed-logo.png" alt="ArthroMed" class="footer-logo-img" />
          </a>
          <p class="footer-desc">
            Premier orthopedic equipment distributor specializing in Breg® clinical braces and cold compression therapy.
          </p>
          <div class="contact-pill">
            <span>Direct WhatsApp Hotline: </span>
            <a [href]="whatsAppUrl" target="_blank" rel="noopener noreferrer">+91 8604351930</a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Navigation</h4>
          <ul class="footer-links">
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/products">Catalog</a></li>
            <li><a [href]="whatsAppUrl" target="_blank" rel="noopener noreferrer">Request Quote</a></li>
          </ul>
        </div>
      </div>

      <div class="disclaimer-bar">
        <div class="container">
          <p class="disclaimer-text">
            <strong>Medical Disclaimer:</strong> Consult with a qualified physician before utilizing orthopedic braces.
          </p>
          <p class="copyright-text">&copy; 2025 ArthroMed Medical Technologies Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`/* Component styles omitted for print documentation brevity */`]
})
export class FooterComponent {
  constructor(private productsService: ProductsService, private router: Router) {}

  get whatsAppUrl(): string {
    return this.productsService.getWhatsAppInquiryUrl();
  }
}
```
