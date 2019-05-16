const Joi = require('joi');
const md5 = require('md5');
// Load .env file into process.env if it exists. This is convenient for running locally.
require('dotenv').config();
// Create config from environment. The idea of putting this here is that all environment variables
// are places into this config. That way, if necessary, it's easy for a reader to see all of the
// required config in one place.
const config = require("../config/global")

// Db connection
const db = new(require('../config/db'))(config.db);

module.exports.getAllUsers = async () => {
    let q = `SELECT u.* FROM users u WHERE u.status='${process.env.ACTIVE_USER_STATUS}'`;
    let [users] = await db.connection.query(q);
    return users;
}

module.exports.belongsToSameDfsp = async (user1, user2) => {
    let q = 'SELECT u.belongToDfsp FROM users u WHERE userId IN(?,?)';
    let [dfsps] = await db.connection.query(q, [user1, user2]);
    let result = (dfsps[0].belongToDfsp === dfsps[1].belongToDfsp) ? true : false;
    return result;
}

module.exports.registerUser = async (userName, firstName, middleName, lastName, belongToDfsp, email, createdBy) => {
    //mobileNumber,department,title,rolesAssigned,
    let params = [userName, md5(rocess.env.DEFAULT_PASSWORD), firstName, middleName, lastName, belongToDfsp, email, createdBy, 'ACTIVE'];

    let q = 'INSERT INTO users(userName,password,firstName,middleName,lastName,belongToDfsp,email,createdBy,status) VALUES(?,?,?,?,?,?,?,?,?)';
    let userId = await db.connection.execute(q, params)
        .then((result) => {
            return result[0].insertId;
        })
        .catch((err) => {
            throw err;
        });
    //Store user roles assigned.

    let user = await this.getUserById(userId);
    return user;
}

module.exports.updateUser = async (firstName, middleName, lastName, email, status, updatedBy, userId) => {
    //mobileNumber,department,title,rolesAuserssigned,
    let params = [firstName, middleName, lastName, email, status, updatedBy, userId];
    let q = 'UPDATE users SET firstName=?,middleName=?,lastName=?,email=?,status=?,updatedBy=?,updatedAt=CURDATE() WHERE userId=?';
    try {
        await db.connection.execute(q, params);
        let user = await this.getUserById(userId);
        return user;
    } catch (err) {
        throw err;
    }
}

module.exports.deleteUser = async (userId) => {
    let params = [process.env.INACTIVE_USER_STATUS, userId];
    let q = 'UPDATE users SET status=?,updatedAt=CURDATE() WHERE userId=?';
    try {
        await db.connection.execute(q, params);
        //De-activate roles associated to users
        let users = await this.getAllUsers();
        return users;
    } catch (err) {
        throw err;
    }
}

//Check if user with posted credentials exists
module.exports.checkUserCredentials = async (username, password) => {
    let userList = await this.getAllUsers();
    let user = await userList.find(a => a.userName === username && a.password === md5(password));
    return (user !== undefined) ? {
        password,
        createdAt,
        createdBy,
        updatedAt,
        updatedBy,
        status,
        ...userWithCleanedInfo
    } = user : user;
}

module.exports.getUserById = async (id) => {
    const user = await db.connection.query(
        'SELECT u.* FROM users u WHERE userId=?', parseInt(id)
    );
    if (user === null) return user;
    const {
        password,
        ...userWithoutPassword
    } = user;
    return userWithoutPassword;
}

module.exports.updateUserSchema = Joi.object().keys({
    firstName: Joi.string().min(1).required(),
    middleName: Joi.string(),
    lastName: Joi.string().min(1).required(),
    email: Joi.string().email({
        minDomainAtoms: 2
    }),
    status: Joi.string().min(6).max(8).required(),
    updatedBy: Joi.number().integer(),
    mobileNumber: Joi.string().max(10),
    department: Joi.string(),
    title: Joi.string(),
    roles: Joi.string().required()
});