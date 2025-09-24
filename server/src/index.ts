import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import articlesRouter from './routes/articles.js';
import uploadRouter from './routes/upload.js';
import documentsRouter from './routes/documents.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Allow same-origin for PDF iframe embedding
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Request logging
app.use(requestLogger);

// CORS configuration
app.use(cors({
  origin: NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3001'
    : ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: NODE_ENV === 'production' ? '1y' : '1h'
}));

// Routes
app.use('/api/articles', articlesRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/documents', documentsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: NODE_ENV
  });
});

// System info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Rusty Raven Blog System',
    version: '2.0.0',
    environment: NODE_ENV,
    features: {
      typstCompilation: true,
      multiLanguage: true,
      darkMode: true
    }
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, '../uploads')}`);
  console.log(`🗄️  Data directory: ${path.join(__dirname, '../data')}`);
  console.log(`📚 Documents directory: ${path.join(__dirname, '../documents')}`);
});