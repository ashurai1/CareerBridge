import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const cleanup = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerbridge');
        
        console.log('Connected! Dropping applications collection...');
        await mongoose.connection.collection('applications').drop();
        console.log('✅ Applications collection dropped successfully');
        
        console.log('Dropping indexes...');
        try {
            await mongoose.connection.collection('applications').dropIndexes();
            console.log('✅ Indexes dropped');
        } catch (err) {
            console.log('No indexes to drop');
        }
        
        await mongoose.disconnect();
        console.log('✅ Cleanup complete! Database is ready');
        process.exit(0);
    } catch (err) {
        console.error('❌ Cleanup error:', err.message);
        process.exit(1);
    }
};

cleanup();
