import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

export const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.get('/', (req, res) => {
    res.json('Hello from backend!');
});

export default app;
