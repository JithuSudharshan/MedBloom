import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { ENV } from './config/env.js';
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import "./config/passport.js";

export const app = express()

// Middlewares
app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(helmet())

// Session configuration with MongoDB store
app.use(session({
    secret: ENV.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: MongoStore.create({
        mongoUrl: ENV.MONGO_URI,
        touchAfter: 24 * 3600, // Lazy session update
        crypto: {
            secret: ENV.SESSION_SECRET
        }
    }),
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
    },
    name: 'sessionId'
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.get('/', (req, res) => {
    res.json('Hello from backend!')
})

app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/oauth', oauthRoutes)

export default app
