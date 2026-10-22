import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { User } from './models/User';
import { seed } from './seed/seed';

import authRoutes from './routes/authRoutes';
import cylinderRoutes from './routes/cylinderRoutes';
import customerRoutes from './routes/customerRoutes';
import deliveryRoutes from './routes/deliveryRoutes';
import refillRoutes from './routes/refillRoutes';
import inspectionRoutes from './routes/inspectionRoutes';
import maintenanceRoutes from './routes/maintenanceRoutes';
import paymentRoutes from './routes/paymentRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import notificationRoutes from './routes/notificationRoutes';
import auditRoutes from './routes/auditRoutes';
import locationRoutes from './routes/locationRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const frontendEnv = process.env.FRONTEND_URL;
const allowedOrigins = frontendEnv
  ? frontendEnv.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || !frontendEnv || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'GasTrack API',
    database: 'MongoDB (Mongoose)',
    timestamp: new Date(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cylinders', cylinderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/refill', refillRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/locations', locationRoutes);

// Centralized error handler
app.use(errorHandler);

// Connect to DB and Start Server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is brand new
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Server] Database is empty. Automatically initializing demo data...');
      await seed(false);
    }

    const server = app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 GasTrack Backend running on port ${PORT}`);
      console.log(`📡 REST API endpoint: http://localhost:${PORT}/api`);
      console.log(`=========================================`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export default app;
