import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from './models/Transaction.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;

mongoose.connect(MONGO_URI).then(async () => {
    const txs = await Transaction.find();
    console.log(`Total Txs: ${txs.length}`);
    const counts = {};
    txs.forEach(t => {
        const bid = t.buyerId.toString();
        counts[bid] = (counts[bid] || 0) + 1;
    });
    console.log('Buyer ID Counts:', counts);
    process.exit();
});
