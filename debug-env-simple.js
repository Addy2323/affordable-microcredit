const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');
console.log('Env path:', envPath);
console.log('Env exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('Env content length:', content.length);
    const lines = content.split('\n');
    for (const line of lines) {
        if (line.startsWith('DATABASE_URL=')) {
            console.log('Found DATABASE_URL line');
            console.log('Value start:', line.substring(13, 33));
        }
    }
}
