import Notification from "../model/notificationSchema.js";
import { getIO } from "../config/socket.IO.js";
import User from "../model/userModel.js";
import Admin from "../model/adminModel.js";

/**
 * Creates a notification in the database and emits it via Socket.IO
 * 
 * @param {Object} options
 * @param {string} options.senderId - Optional ID of the user sending the notification
 * @param {string} options.receiverId - ID of the user receiving the notification
 * @param {string} options.message - The notification message
 * @param {string} options.type - The type of notification (enum)
 * @param {string} options.link - Optional link for the notification to redirect to
 */
export const sendNotification = async ({ senderId, receiverId, message, type, link }) => {
    try {
        if (!receiverId || !message || !type) {
            console.error("Missing required fields for notification:", { receiverId, message, type });
            return null;
        }

        // 1. Save to Database
        const newNotification = new Notification({
            senderId: senderId || null,
            receiverId,
            message,
            type,
            link: link || ''
        });

        const savedNotification = await newNotification.save();

        // 2. Emit via Socket.IO
        try {
            const io = getIO();
            // We assume the user joins a room with their user ID when they connect
            io.to(receiverId.toString()).emit('notification', savedNotification);
        } catch (socketError) {
            // Socket error shouldn't crash the calling function
            console.error("Socket.IO Error emitting notification:", socketError);
        }

        return savedNotification;
    } catch (error) {
        console.error("Failed to send notification:", error);
        return null;
    }
};

/**
 * Convenience helper to send a notification directly to the Admin
 * 
 * @param {Object} options
 * @param {string} options.message - The notification message
 * @param {string} options.type - The type of notification (enum)
 * @param {string} options.link - Optional link for the notification to redirect to
 */
export const notifyAdmin = async ({ message, type, link }) => {
    try {
        const adminUser = await Admin.findOne().select('_id');
        if (!adminUser) {
            console.error("Admin user not found, could not send admin notification.");
            return null;
        }

        return await sendNotification({
            receiverId: adminUser._id,
            message,
            type,
            link
        });
    } catch (error) {
        console.error("Failed to notify admin:", error);
        return null;
    }
};
