import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from './models/Transaction.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;

mongoose.connect(MONGO_URI).then(async () => {
    const txs = await Transaction.find().limit(44);
    const buyerIds = [...new Set(txs.map(t => t.buyerId.toString()))];
    console.log('Unique Buyer IDs in Transactions:', buyerIds);
    process.exit();
});
