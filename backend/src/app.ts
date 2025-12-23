import express from 'express';
import itemRoutes from './routes/itemRoutes';
import authRoutes from './routes/authRoutes';
import tableRoutes from './routes/tableRoutes';
import menuRoutes from './routes/menuRoutes';
import { authorizeToken } from './middlewares/authHandlers';
import { Response } from 'express';
import type { AuthenticatedRequest } from './middlewares/authHandlers';
//import { errorHandler } from './middlewares/authHandlers';

const app = express();

app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/table', tableRoutes);
app.use('/api/menu', menuRoutes);
app.get("/protected", authorizeToken, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    message: "Access granted",
    user: req.user
  });
});

// Global error handler (should be after routes)
//app.use(errorHandler);

export default app;