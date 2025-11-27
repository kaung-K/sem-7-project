import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import {runPayoutJob} from './Util/CronHandler.js';
import dotenv from 'dotenv';
import './models/Base.js';
import './models/User.js'; // ✅ force registration of the discriminator


import userRoutes from './routes/users.routes.js';
import notificationRoutes from './routes/notifications.routes.js';
import authRoutes from './Controller/AuthController.js';
import { stripeWebhookHandler } from './Util/StripeHandler.js';  // Named import
import protectedResRoutes from './Controller/PrivateResController.js';
import publicResRoutes from './Controller/PublicResController.js';
import { createAdminUser } from './createAdmin.js';
import analyticsRoutes from "./routes/analytics.routes.js";

// Middleware
import authMiddleware from './middleware/AuthMiddleware.js';  // Correct path to your authMiddleware
//import checkAuthorization from './middleware/Authorization.js';  // Optional, only needed if you have separate authorization logic

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
// Stripe webhook
app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), stripeWebhookHandler);


app.get('/', (req, res) => {
  res.send('🎉 API is running! Try /api/comments or /api/users or /api/posts');
});

// ✅ Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB connected');
  await createAdminUser();   // <-- just add this
})
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Routes
app.use('/api/user', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/private', protectedResRoutes);
app.use('/api/public', publicResRoutes);
app.use("/api/analytics", analyticsRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  runPayoutJob();
});
