import express from 'express';
import Notification from '../model/notificationSchema.js';

const router = express.Router();

// GET all notifications for logged-in user (paginated)
router.get('/', async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;

        const totalNotifications = await Notification.countDocuments({ receiverId: req.user._id });
        const totalPages = Math.ceil(totalNotifications / limit);

        const notifications = await Notification
            .find({ receiverId: req.user._id })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        res.json({ 
            success: true, 
            notifications,
            currentPage: page,
            totalPages,
            hasMore: page < totalPages
        });
    } catch (err) {
        next(err);
    }
});

// PATCH mark one notification as read
router.patch('/:id/read', async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, receiverId: req.user._id },
            { read: true },
            { new: true }
        );
        res.json({ success: true, notification });
    } catch (err) {
        next(err);
    }
});

// PATCH mark all as read
router.patch('/read-all', async (req, res, next) => {
    try {
        await Notification.updateMany(
            { receiverId: req.user._id, read: false },
            { read: true }
        );
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

export default router;
