const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '../../.env' });

async function hashPasswords() {
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_NAME:', process.env.DB_NAME);
    const connection = await mysql.createConnection({
        host: "127.0.0.1", //should get from .env but env host is db as it is in docker
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
    });

    const [rows] = await connection.execute('SELECT id, password FROM users');
    
    for (const row of rows) {
        if (!row.password.startsWith('$2b$')) { // if already hashed should start with $2b$
            const hashedPassword = await bcrypt.hash(row.password, 10);
            await connection.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, row.id]);
        }
    }

    console.log('Passwords hashed successfully.');
    await connection.end();
}

hashPasswords().catch(console.error);
