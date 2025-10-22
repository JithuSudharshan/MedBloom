import { createClient } from 'redis'
import { ENV } from './env.js'

const redisClient = createClient({
    socket: {
        host: ENV.REDIS_HOST || "127.0.0.1",
        port: ENV.REDIS_PORT || 6379,
    }
})

redisClient.on("connect", () => {
    console.log("Redis connected succesfully")
    console.log("===============================")
})
redisClient.on("error", (err) => {
    console.log("Redis conncetion error : ", err)
    console.log("===============================")
})

export const connectRedis = async () => {
    await redisClient.connect();
}

export default redisClient; 