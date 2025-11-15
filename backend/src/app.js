import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from "./routes/userRoutes.js"
import cookieParser from 'cookie-parser'
import adminRoutes from "./routes/adminRoutes.js"

export const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.get('/', (req, res) => {
    res.json('Hello from backend!');
});
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)

export default app;
