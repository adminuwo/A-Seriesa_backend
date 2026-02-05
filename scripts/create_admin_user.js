import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import connectDB from '../config/db.js';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        await connectDB();
        console.log('Connected to Database');

        const oldEmail = 'bhoomzpatel6@gmail.com';
        const newEmail = 'admin@uwo24.com';
        const password = 'admin@123';
        const name = 'Admin User';

        // 1. Check if the old admin exists
        let oldUser = await User.findOne({ email: oldEmail });

        // 2. Check if the new admin email already exists (to avoid duplicate key error)
        let newUser = await User.findOne({ email: newEmail });

        if (oldUser) {
            console.log(`Found old admin (${oldEmail}). Updating email to ${newEmail}...`);

            if (newUser) {
                // If the target email ALSO exists, we can't just rename. 
                // We'll delete the old one and promote the new one.
                console.log(`Target email (${newEmail}) also exists. Deleting old user and updating target user.`);
                await User.deleteOne({ email: oldEmail });
                oldUser = newUser; // Proceed to update newUser
            } else {
                // Rename old user
                oldUser.email = newEmail;
            }

            const salt = await bcrypt.genSalt(10);
            oldUser.password = await bcrypt.hash(password, salt);
            oldUser.role = 'admin';
            oldUser.isVerified = true;
            await oldUser.save();
            console.log(`Successfully changed admin from ${oldEmail} to ${newEmail}.`);

        } else if (newUser) {
            console.log(`User ${newEmail} already exists. Promoting to admin...`);
            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(password, salt);
            newUser.role = 'admin';
            newUser.isVerified = true;
            await newUser.save();
            console.log(`User ${newEmail} promoted to Admin.`);
        } else {
            console.log(`Neither ${oldEmail} nor ${newEmail} found. Creating new admin (${newEmail})...`);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = new User({
                name,
                email: newEmail,
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            });
            await user.save();
            console.log('Admin user created successfully.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
