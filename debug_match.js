import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Transaction from './models/Transaction.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;

mongoose.connect(MONGO_URI).then(async () => {
    const user = await User.findOne({ email: 'devanshtantwaynir@gmail.com' });
    const userId = user._id;
    const txs = await Transaction.find({ buyerId: userId });
    console.log(`User ID: ${userId}`);
    console.log(`Matching Transactions found: ${txs.length}`);
    if (txs.length > 0) {
        console.log(`First Tx BuyerId: ${txs[0].buyerId}`);
    } else {
        const anyTx = await Transaction.findOne();
        if (anyTx) {
            console.log(`Any Tx BuyerId: ${anyTx.buyerId}`);
            console.log(`Are they same? ${anyTx.buyerId.toString() === userId.toString()}`);
        }
    }
    process.exit();
});
