import dotenv from "dotenv"

dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
    REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
    REDIS_PORT: process.env.REDIS_PORT6379,
    MAILER_HOST: process.env.MAILER_HOST,
    MAILER_PORT: process.env.MAILER_PORT,
    SERVICE: process.env.SERVICE,
    SECURE: process.env.SECURE,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS
}