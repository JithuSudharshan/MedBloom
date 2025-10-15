import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
import app from "./app.js";

//connects to DataBase
connectDB()


app.listen(ENV.PORT, () => {
    console.log("===============================")
    console.log(`Server listening to PORT ${ENV.PORT}`)
    console.log("===============================")
})