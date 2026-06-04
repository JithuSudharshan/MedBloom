import mongoose from 'mongoose';
import { ENV } from './src/config/env.js';
import Admin from './src/model/adminModel.js';

async function test() {
    await mongoose.connect(ENV.MONGO_URI);
    const admins = await Admin.find();
    console.log("Total admins:", admins.length);
    admins.forEach(a => console.log(a._id, a.email));
    process.exit(0);
}
test();
