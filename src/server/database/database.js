const { Client } = require('pg');

/**
 * The adapter for the POSTGRES database connection
 */
class Database {
    /**
     * @constructor
     * 
     * Initializes a new POSTGRES database connection, by the environment variable
     * DATABASE_URL or in the app.config.json file. 
     */
    constructor() {
        this.databaseURL = process.env.DATABASE_URL;
        this.client = new Client({
            connectionString: this.databaseURL
        });
    }

    /**
     * Start the database client
     * @returns {Promise} If it is finished connection or not.
     */
    run() {
        return this.client.connect();
    }
}

module.exports = new Database();