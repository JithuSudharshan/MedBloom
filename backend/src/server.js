import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
import app from "./app.js";
import { connectRedis } from "./config/redisClient.js";
import http from 'http';
import { initSocket } from './config/socket.IO.js';
import { initCronJobs } from './utils/cronJobs.js';
import { exec } from 'child_process';

//connects to DataBase
connectDB()

//connect to redis
connectRedis()

//connect to socket
const server = http.createServer(app);
initSocket(server);
initCronJobs();

import { execSync } from 'child_process';

// Kill any ghost process holding the port before starting
try {
    execSync(`lsof -t -i:${ENV.PORT} | xargs kill -9`);
    console.log(`Killed existing process on port ${ENV.PORT}`);
} catch (e) {
    // Port was free or command failed, ignore
}

setTimeout(() => {
    server.listen(ENV.PORT, () => {
        console.log("===============================")
        console.log(`Server listening to PORT ${ENV.PORT}`)
        console.log("===============================")
    }).on('error', (err) => {
        console.error("Server listen error:", err);
    });
}, 500);