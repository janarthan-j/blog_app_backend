// database.js
const mysql = require('mysql2');
const config = require('../config');

const db = mysql.createConnection(config.database);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

module.exports = {
    // Function to query the database
    query: (sql, values, callback) => {
        return db.query(sql, values, callback);
    },

    // Function to close the database connection
    close: () => {
        db.end((err) => {
            if (err) {
                console.error('Error closing MySQL connection:', err);
            } else {
                console.log('Closed MySQL connection');
            }
        });
    },
};
