const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env');
console.log('Env path:', envPath);
console.log('Env exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('Env content length:', content.length);
    console.log('Env content start:', content.substring(0, 20));

    const result = dotenv.config();
    if (result.error) {
        console.error('Dotenv error:', result.error);
    } else {
        console.log('DATABASE_URL defined:', !!process.env.DATABASE_URL);
        if (process.env.DATABASE_URL) {
            console.log('DATABASE_URL start:', process.env.DATABASE_URL.substring(0, 20));
        }
    }
}
