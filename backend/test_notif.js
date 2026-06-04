import mongoose from 'mongoose';
import { ENV } from './src/config/env.js';
import Notification from './src/model/notificationSchema.js';
import Admin from './src/model/adminModel.js';

async function test() {
    await mongoose.connect(ENV.MONGO_URI);
    const admin = await Admin.findOne();
    if (!admin) {
        console.log("No admin");
        process.exit(0);
    }
    console.log("Admin ID:", admin._id);
    const notifs = await Notification.find({ receiverId: admin._id });
    console.log("Notifications for Admin:", notifs.length);
    process.exit(0);
}
test();
