import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;

mongoose.connect(MONGO_URI).then(async () => {
    const user = await User.findById('696dd7bb09b2b229e059f020');
    if (user) {
        console.log('User found for mismatch ID:');
        console.log('Name:', user.name);
        console.log('Email:', user.email);
        console.log('Agents count:', user.agents.length);
    } else {
        console.log('No user found for ID 696dd7bb09b2b229e059f020');
    }
    process.exit();
});
