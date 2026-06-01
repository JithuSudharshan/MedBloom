import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/MEDBLOOM')
  .then(async () => {
    const { default: Notification } = await import('./src/model/notificationSchema.js');
    const notifs = await Notification.find().sort({ timestamp: -1 }).limit(5);
    console.log('Latest 5 notifications:', notifs);
    process.exit(0);
  })
  .catch(err => {
    console.error('DB Connection Error:', err);
    process.exit(1);
  });
