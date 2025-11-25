import cloudinary from "../config/cloudinary.js"
import streamifier from "streamifier"

export const uploadToCloudinary = async (req, res, next) => {
    try {
        if (!req.file) return next()

        // Use Cloudinary upload stream for buffer uploads
        const streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "medbloom/profile pictures" },
                    (error, result) => {
                        if (result) resolve(result)
                        else reject(error)
                    }
                );
                streamifier.createReadStream(buffer).pipe(stream);
            })
        }

        const result = await streamUpload(req.file.buffer)
        req.body.profile_url = result.secure_url
        next()
    } catch (error) {
        console.log("Cloudinary Error:", error)
        return res.status(500).json({ success: false, message: "Image upload failed" })
    }
}
