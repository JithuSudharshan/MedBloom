import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/MEDBLOOM')
  .then(async () => {
    const { sendNotification } = await import('./src/utils/notificationHelper.js');
    const { default: User } = await import('./src/model/userModel.js');
    
    const someUser = await User.findOne();
    console.log("Found user:", someUser._id);

    console.log("Calling sendNotification...");
    const result = await sendNotification({
        receiverId: someUser._id,
        message: 'Test notification',
        type: 'wallet_topup',
        link: '/test'
    });

    console.log("Result:", result);
    process.exit(0);
  })
  .catch(err => {
    console.error('Test Error:', err);
    process.exit(1);
  });
