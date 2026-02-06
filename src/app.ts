import express from 'express';
import { config } from './config/env';
import { rateLimiter } from './utils/RateLimiter';
import productRoutes from './routes/productRoutes';
import webhookRoutes from './routes/webhookRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(rateLimiter); // Apply rate limiting globally

// Routes
app.use('/products', productRoutes);
app.use('/webhook', webhookRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start Server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});