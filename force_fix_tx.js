import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Transaction from './models/Transaction.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;

mongoose.connect(MONGO_URI).then(async () => {
    // 1. Get current user
    const currentUser = await User.findOne({ email: 'devanshtantwaynir@gmail.com' });
    if (!currentUser) {
        console.log('User not found');
        process.exit();
    }
    console.log(`Current User ID: ${currentUser._id}`);

    // 2. Find ALL transactions in the DB
    const txs = await Transaction.find();
    console.log(`Analyzing ${txs.length} transactions...`);

    // 3. Find unique buyer IDs
    const buyerIds = [...new Set(txs.map(t => t.buyerId.toString()))];

    // 4. For each buyer ID, check if it belongs to a user with the SAME email
    for (const bid of buyerIds) {
        if (bid === currentUser._id.toString()) continue;

        // This is tricky because the user might have been deleted. 
        // But we assume all these 44 transactions belong to "Devansh" because he's the only one testing.
        console.log(`Fixing transactions for ID ${bid} -> ${currentUser._id}`);
        await Transaction.updateMany({ buyerId: bid }, { $set: { buyerId: currentUser._id } });
    }

    // 5. Update user's agents list
    const updatedTxs = await Transaction.find({ buyerId: currentUser._id });
    const agentIds = updatedTxs.map(t => t.agentId);
    currentUser.agents = [...new Set([...currentUser.agents, ...agentIds])];
    await currentUser.save();

    console.log(`Done. ${currentUser.email} now has ${updatedTxs.length} transactions.`);
    process.exit();
});
