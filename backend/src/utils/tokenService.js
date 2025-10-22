import crypto from 'crypto'
import redisClient from '../config/redisClient.js';

export async function generateAndStoreToken(userId) {

    //Generating random token
    const token = crypto.randomBytes(32).toString("hex");

    //Hashing the GEnerated Token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    //Storing the hashed Token in redis
    await redisClient.setEx(`verifyToken:${userId.toString()}`, 3600, hashedToken);

    return token
}