import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected Successfully`)
        console.log("===============================")
    } catch (error) {
        console.error(`Failed to connect MongoDB: ${error.message}`);
        console.log("===============================")
        process.exit(1);
    }
}

export default connectDB;