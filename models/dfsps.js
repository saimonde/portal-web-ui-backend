// Create config from environment. The idea of putting this here is that all environment variables
// are places into this config. That way, if necessary, it's easy for a reader to see all of the
// required config in one place.
const config = require("../config/global")

// Db connection
const db = new (require('../config/db'))(config.db);

async function getDfsps() {
    const [dfsps,] = await db.connection.query(
        'SELECT p.participantId AS id, p.name FROM participant p'
    );
    return dfsps;
}

module.exports={
    getDfsps
}

