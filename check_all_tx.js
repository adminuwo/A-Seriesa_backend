import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Transaction from './models/Transaction.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;

mongoose.connect(MONGO_URI).then(async () => {
    const users = await User.find({ email: /devansh/i });
    console.log('USERS:');
    for (const u of users) {
        const count = await Transaction.countDocuments({ buyerId: u._id });
        console.log(`Email: ${u.email} | ID: ${u._id} | TxCount: ${count}`);
    }

    // Also find ALL transactions and print their buyerIds
    const lastTxs = await Transaction.find().sort({ createdAt: -1 }).limit(5);
    console.log('\nLAST 5 TRANSACTIONS:');
    lastTxs.forEach(t => {
        console.log(`TxID: ${t.transactionId} | BuyerId: ${t.buyerId} | Status: ${t.status}`);
    });

    process.exit();
});
