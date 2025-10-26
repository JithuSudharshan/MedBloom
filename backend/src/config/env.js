import dotenv from "dotenv"

dotenv.config();

//All backend .env variables
export const ENV = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "production",
    MONGO_URI: process.env.MONGO_URI,
    SALTROUND: Number(process.env.SALTROUND),
    JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
    REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
    REDIS_PORT: process.env.REDIS_PORT6379,
    MAILER_HOST: process.env.MAILER_HOST,
    MAILER_PORT: process.env.MAILER_PORT,
    SERVICE: process.env.SERVICE,
    SECURE: process.env.SECURE,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "my secret access token",
    JWT_REFERSH_TOKEN: process.env.JWT_REFERSH_TOKEN || "my secret refresh token"
}