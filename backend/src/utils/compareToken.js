import crypto from "crypto";

export async function safeCompare(hash1, hash2) {

    const buffer1 = Buffer.from(hash1, "utf8");
    const buffer2 = Buffer.from(hash2, "utf8");

    // Length check first
    if (buffer1.length !== buffer2.length) return false;

    // Constant-time comparison
    const isMatch = crypto.timingSafeEqual(buffer1, buffer2);
    if (isMatch) {
        console.log(" Tokens match");
        return true
    } else {
        console.log(" Tokens do not match");
        return false
    }
}



