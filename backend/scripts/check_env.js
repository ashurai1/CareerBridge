import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go up one level to backend root
const envPath = path.join(__dirname, '../.env');

console.log('--- Environment Variable Debugger ---');
console.log(`Checking for .env at: ${envPath}`);

if (fs.existsSync(envPath)) {
    console.log('✅ .env file found.');
} else {
    console.error('❌ .env file NOT found at expected path!');
}

// Load .env
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('❌ Error loading .env file:', result.error);
} else {
    console.log('✅ dotenv loaded successfully.');
}

console.log('\nChecking Keys:');
const checkKey = (key) => {
    if (process.env[key]) {
        console.log(`✅ ${key}: LOADED (Length: ${process.env[key].length})`);
    } else {
        console.error(`❌ ${key}: MISSING`);
    }
};

checkKey('GOOGLE_CLIENT_ID');
checkKey('GOOGLE_CLIENT_SECRET');
checkKey('TWITTER_CONSUMER_KEY');
checkKey('GITHUB_CLIENT_ID');
checkKey('LINKEDIN_KEY');
checkKey('LINKEDIN_SECRET');
