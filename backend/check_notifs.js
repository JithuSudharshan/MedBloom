import mongoose from 'mongoose';
import { ENV } from './src/config/env.js';
import Notification from './src/model/notificationSchema.js';

async function test() {
    await mongoose.connect(ENV.MONGO_URI);
    const notifs = await Notification.find({ receiverId: '6918c8549df6455d8d877d38' });
    console.log("Admin notifications:", notifs);
    process.exit(0);
}
test();
