import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 ShopSphere API Server running on http://localhost:${PORT}`);
    console.log(`📡 Healthcheck available at: http://localhost:${PORT}/api/health`);
    console.log(`👤 Demo Account: demo@shopsphere.com | Password: demo12345`);
    console.log(`====================================================`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
