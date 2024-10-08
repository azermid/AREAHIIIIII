const mysql = require('mysql2/promise');
require('dotenv').config();

const retryConnection = async (retries = 5) => {
  const attemptConnection = async (retriesLeft) => {
    try {
      if (process.env.CI_ENV === 'true')
        console.log("true")
      const pool = mysql.createPool({
        host: process.env.CI_ENV === 'true' ? "db" : process.env.DB_HOST,
        port: process.env.CI_ENV === 'true' ? 3306 : process.env.DB_PORT || 3306,
        user: process.env.CI_ENV === 'true' ? "user" : process.env.DB_USER,
        password: process.env.CI_ENV === 'true' ? "pass" : process.env.DB_PASSWORD,
        database: process.env.CI_ENV === 'true' ? "Area" : process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      console.log('Connected to MySQL database using connection pool');
      return pool;
    } catch (err) {
      console.error('Error connecting to the database.');
      if (retriesLeft > 0) {
        console.log(`Retrying in 5 seconds... (${retriesLeft} retries left)`);
        await new Promise((res) => setTimeout(res, 5000));
        return attemptConnection(retriesLeft - 1);
      } else {
        console.error('Could not connect to the database after multiple attempts.');
        throw err;
      }
    }
  };

  return attemptConnection(retries);
};

module.exports = retryConnection;
