import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
import app from "./app.js";
import { connectRedis } from "./config/redisClient.js";
import http from 'http';
import { initSocket } from './config/socket.IO.js';
import { initCronJobs } from './utils/cronJobs.js';

// Connect to services
connectDB();
connectRedis();

// Create HTTP server
const server = http.createServer(app);
initSocket(server);
initCronJobs();

server.listen(ENV.PORT, () => {
    console.log("===============================")
    console.log(`Server listening on PORT ${ENV.PORT}`)
    console.log("===============================")
}).on('error', (err) => {
    console.error("Server failed to start:", err);
    process.exit(1);
});