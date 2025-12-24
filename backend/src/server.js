import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
import app from "./app.js";
import { connectRedis } from "./config/redisClient.js";
import http from 'http';
import { initSocket } from './config/socket.IO.js';

//connects to DataBase
connectDB()

//connect to redis
connectRedis()

//connect to socket
const server = http.createServer(app);
initSocket(server);

server.listen(ENV.PORT, () => {
    console.log("===============================")
    console.log(`Server listening to PORT ${ENV.PORT}`)
    console.log("===============================")
});