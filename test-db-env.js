const { Client } = require('pg');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
    const [key, ...val] = line.split('=');
    if (key && val.length) acc[key.trim()] = val.join('=').trim();
    return acc;
}, {});

const client = new Client({
    connectionString: env.DATABASE_URL,
});

console.log('Connecting to:', env.DATABASE_URL.replace(/:[^:@]+@/, ':***@'));

client.connect()
    .then(() => {
        console.log('Connected successfully');
        return client.end();
    })
    .catch(err => {
        console.error('Connection error', err.message);
        process.exit(1);
    });
