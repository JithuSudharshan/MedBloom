import mongoose from 'mongoose';
import User from './model/userModel.js';

mongoose.connect('mongodb+srv://jithuspillai2621_db_user:jithu1234@medbloom.ic07gzw.mongodb.net/?retryWrites=true&w=majority&appName=MedBloom')
  .then(async () => {
    const roles = await User.distinct('role');
    console.log("Roles found:", roles);
    
    const admin = await User.findOne({ role: 'admin' });
    console.log("Admin user:", admin);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
