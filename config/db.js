const mysql = require('mysql2');
const MYSQL_MIN_DATETIME = '1000-01-01';
const MYSQL_MAX_DATETIME = '9999-12-31';

module.exports = class Database {
    constructor(config) {
        this.connection = mysql.createPool({
            ...config,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        }).promise();

        this.MYSQL_MAX_DATETIME = MYSQL_MAX_DATETIME;
        this.MYSQL_MIN_DATETIME = MYSQL_MIN_DATETIME;
    }
    
    async dummyQuery() {
        return await this.connection.query('SELECT 1 + 1 AS result');
    }
};

