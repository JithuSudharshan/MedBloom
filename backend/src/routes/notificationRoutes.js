import express from 'express';
import Notification from '../model/notificationSchema.js';

const router = express.Router();

// GET all notifications for logged-in user (doctor)
router.get('/', async (req, res, next) => {
    try {
        const notifications = await Notification
            .find({ receiverId: req.user._id })
            .sort({ timestamp: -1 });

        res.json({ success: true, notifications });
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
