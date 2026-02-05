
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/db.js';
import Transaction from '../models/Transaction.js';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const clearTransactions = async () => {
    try {
        await connectDB();
        console.log('Connected to Database');

        const count = await Transaction.countDocuments();
        console.log(`Found ${count} transactions.`);

        if (count > 0) {
            await Transaction.deleteMany({});
            console.log('All transactions have been deleted successfully.');
        } else {
            console.log('No transactions to delete.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error clearing transactions:', error);
        process.exit(1);
    }
};

clearTransactions();
