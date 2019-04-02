const URL = require('url').URL;

// Load .env file into process.env if it exists. This is convenient for running locally.
require('dotenv').config();

// Simple logging function. Should replace this with structured logging.
function log(...args){
    console.log(`[${(new Date()).toISOString()}]`, ...args);
};

// Create config from environment. The idea of putting this here is that all environment variables
// are places into this config. That way, if necessary, it's easy for a reader to see all of the
// required config in one place.
module.exports = {
    log,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: 'central_ledger'
    },
    server: {
        listenPort: process.env.LISTEN_PORT
    },
    settlementsEndpoint: process.env.SETTLEMENTS_ENDPOINT,
    centralLedgerEndpoint: process.env.CENTRAL_LEDGER_ENDPOINT,
    auth: {
        bypass: process.env.BYPASS_AUTH === 'true',
        loginEndpoint: (new URL(process.env.AUTH_SERVICE, `${process.env.AUTH_SERVER}:${process.env.AUTH_SERVER_PORT}`)).href,
        validateEndpoint: (new URL(process.env.VALIDATE_SERVICE, `${process.env.AUTH_SERVER}:${process.env.AUTH_SERVER_PORT}`)).href,
        key: process.env.AUTH_SERVER_CLIENTKEY,
        secret: process.env.AUTH_SERVER_CLIENTSECRET
    },
    corsReflectOrigin: process.env.CORS_ACCESS_CONTROL_REFLECT_ORIGIN === 'true'
};


