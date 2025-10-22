import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
import app from "./app.js";
import { connectRedis } from "./config/redisClient.js";

//connects to DataBase
connectDB()

//connect to redis
connectRedis()


app.listen(ENV.PORT, () => {
    console.log("===============================")
    console.log(`Server listening to PORT ${ENV.PORT}`)
    console.log("===============================")
})