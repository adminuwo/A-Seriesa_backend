import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Transaction from './models/Transaction.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;

mongoose.connect(MONGO_URI).then(async () => {
    const user = await User.findOne({ email: 'devanshtantwaynir@gmail.com' });
    if (!user) {
        console.log('User not found');
        process.exit();
    }

    console.log('CURRENT USER ID:', user._id);

    const countTotal = await Transaction.countDocuments();
    const countMyId = await Transaction.countDocuments({ buyerId: user._id });
    const otherId = '696dd7bb09b2b229e059f020';
    const countOldId = await Transaction.countDocuments({ buyerId: otherId });

    console.log('Total Transactions:', countTotal);
    console.log('Transactions with current ID:', countMyId);
    console.log('Transactions with old ID (696dd7bb...):', countOldId);

    if (countOldId > 0 && countMyId === 0) {
        console.log('\nFIXING: Moving transactions to new ID...');
        await Transaction.updateMany({ buyerId: otherId }, { $set: { buyerId: user._id } });
        console.log('Migration Complete.');

        // Also add agents to the user if they were missing
        const txs = await Transaction.find({ buyerId: user._id });
        const agentIds = txs.map(t => t.agentId);
        user.agents = [...new Set([...user.agents, ...agentIds])];
        await user.save();
        console.log('User agents array updated.');
    }

    process.exit();
});
