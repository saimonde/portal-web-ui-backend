// Create config from environment. The idea of putting this here is that all environment variables
// are places into this config. That way, if necessary, it's easy for a reader to see all of the
// required config in one place.
const config = require("../config/global")

// Db connection
const db = new (require('../config/db'))(config.db);

module.exports.getAllUsers=async ()=>{
    let [userList]=await db.connection.query(
        'SELECT u.* FROM users u'
    );
    return userList;
}

//Check if user with posted credentials exists
module.exports.checkUserCredentials=async (username,password)=>{
    let userList = await this.getAllUsers();
    let user = await userList.find(a => a.userName === username && a.password === password);
    (user !== undefined) ? { password,createdAt,createdBy,updatedAt,updatedBy,status, ...userWithCleanedInfo } = user:user;
    return userWithCleanedInfo;
}

module.exports.getUserById = async (id)=>{
    const user = this.getAllUsers().find(u => u.userId === parseInt(id));
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
