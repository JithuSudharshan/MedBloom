import crypto from 'crypto'
import redisClient from '../config/redisClient.js';

export async function generateAndStoreToken(userId) {

    try {
        //Generating random token
        const token = crypto.randomBytes(32).toString("hex");

        //Hashing the GEnerated Token
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        //Storing the hashed Token in redis
        await redisClient.setEx(`verifyToken:${userId.toString()}`, 3600, hashedToken);

        return hashedToken

    } catch (error) {
        console.log("something went wrong while generating token", error)
    }

}

export async function searchAndFindToken(userId) {

    try {
        //chechking whether the token truly exist
        const isTokenExist = await redisClient.get(`verifyToken:${userId}`)
        const token = isTokenExist;
        return token

    } catch (error) {
        console.log("Something went wrong while verifying token", error)
    }

}

export async function deleteToken(userId) {

    try {
        //deleting the token after verification success
        await redisClient.del(`verifyToken:${userId}`)
    } catch (error) {
        console.log("Error in deleting token", error)
    }
}