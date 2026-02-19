const { Client } = require('pg');
const client = new Client({
    connectionString: "postgresql://postgres:myamba2323@127.0.0.1:5432/affordable_db?schema=public",
});

client.connect()
    .then(() => {
        console.log('Connected successfully');
        return client.end();
    })
    .catch(err => {
        console.error('Connection error', err.stack);
        process.exit(1);
    });
