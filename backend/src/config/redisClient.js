import { createClient } from 'redis'
import { ENV } from './env.js'

//redis configuration
const redisClient = createClient({
    socket: {
        host: ENV.REDIS_HOST || "127.0.0.1",
        port: ENV.REDIS_PORT || 6379,
    }
})

//redis events to start server
redisClient.on("connect", () => {
    console.log("Redis connected succesfully")
    console.log("===============================")
})
redisClient.on("error", (err) => {
    console.log("Redis conncetion error : ", err)
    console.log("===============================")
})

//redis server start function
export const connectRedis = async () => {
    await redisClient.connect();
}

export default redisClient; 