import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';
import uploadRoutes from './routes/upload.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

// CORS configuration to allow Angular frontend (Local, Render, Vercel, or custom domain)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl) or any web origin
      callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-device-id'],
    credentials: true,
  })
);

// Express payload parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'ArthroMed API Gateway',
  });
});

// Primary Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// Root route
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 2rem; max-width: 600px; margin: auto; text-align: center;">
      <h1 style="color: #0f2b48;">ArthroMed Orthopedic API</h1>
      <p style="color: #4b647f;">Backend API server running on port ${PORT}.</p>
      <p><a href="/api/products" style="color: #00897b; font-weight: bold;">View /api/products</a></p>
    </div>
  `);
});

// Global error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 ArthroMed Server is listening on port ${PORT}`);
  console.log(`🔑 Auth:      http://localhost:${PORT}/api/auth`);
  console.log(`📡 Products:  http://localhost:${PORT}/api/products`);
  console.log(`📤 Upload:    http://localhost:${PORT}/api/upload`);
  console.log(`===============================================`);
});

export default app;
