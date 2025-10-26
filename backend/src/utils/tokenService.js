import crypto from 'crypto'
import redisClient from '../config/redisClient.js';
import jwt from 'jsonwebtoken'
import { ENV } from '../config/env.js';

export const generateAndStoreToken = async (userId) => {

    try {
        //Generating random token
        const token = crypto.randomBytes(32).toString("hex");

        //Hashing the GEnerated Token
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        //Storing the hashed Token in redis and will expire in 30-Mins
        await redisClient.setEx(`verifyToken:${userId.toString()}`, 1800, hashedToken);

        return hashedToken

    } catch (error) {
        console.log("something went wrong while generating token", error)
    }

}

export const searchAndFindToken = async (userId) => {

    try {
        //chechking whether the token truly exist
        const isTokenExist = await redisClient.get(`verifyToken:${userId}`)
        const token = isTokenExist;
        return token

    } catch (error) {
        console.log("Something went wrong while verifying token", error)
    }

}

export const deleteToken = async (userId) => {

    try {
        //deleting the token after verification success
        await redisClient.del(`verifyToken:${userId}`)
        console.log("token deleted")
    } catch (error) {
        console.log("Error in deleting token", error)
    }
}

export const safeCompare = async (hash1, hash2) => {

    const buffer1 = Buffer.from(hash1, "utf8");
    const buffer2 = Buffer.from(hash2, "utf8");

    // Length check first
    if (buffer1.length !== buffer2.length) return false;

    // Constant-time comparison to prevent time based attacks
    const isMatch = crypto.timingSafeEqual(buffer1, buffer2);

    if (isMatch) {
        console.log(" Tokens match");
        return true
    } else {
        console.log(" Tokens do not match");
        return false
    }
}

export const generateAccessToken = (user_Id, user_email, user_role) => {
    return new Promise((resolve, reject) => {
        jwt.sign({
            userId: user_Id,
            userEmail: user_email,
            userRole: user_role
        }, ENV.JWT_ACCESS_SECRET, { expiresIn: '15m' },
            (err, token) => {
                if (err) reject(err);
                else resolve(token);
            })
    })
}

export const generateRefreshToken = (user_id) => {
    return new Promise((resolve, reject) => {
        jwt.sign({
            userId: user_id
        }, ENV.JWT_REFERSH_TOKEN, { expiresIn: '7d' },
            (err, token) => {
                if (err) reject(err)
                else resolve(token)
            })
    })
}

