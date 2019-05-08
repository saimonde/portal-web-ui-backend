const router = new(require('koa-router'))();

//Include models
const {
    getAllUsers,
    getUserById,
    registerUser,
    updateUser,
    deleteUser
} = require('../models/users');

router.get('/users', async (ctx, next) => { 
    const _users = await getAllUsers();
    ctx.response.body = _users.map(u => {
        const {
            password,
            ...userWithoutPassword
        } = u;
        return userWithoutPassword;
    });
    ctx.response.status = 200;
    await next();
});

//Validation needs to be done to the posted user information.
//Perhaps with Joi

router.post('/users', async (ctx, next) => {
    //,mobileNumber,department,title,rolesAssigned,
    const {
        userName,
        firstName,
        middleName,
        lastName,
        belongToDfsp,
        email,
        createdBy
    } = ctx.request.body;
    try {
        let user = await registerUser(userName, firstName, middleName, lastName, belongToDfsp, email, createdBy);
        ctx.response.body = user;
        ctx.response.status = 201;
    } catch (err) {
        ctx.response.status = 500;
    }
    await next();
});

router.put('/users/:id', async (ctx, next) => {
    //,mobileNumber,department,title,rolesAssigned,
    const userId = ctx.params.id;
    const userById = await getUserById(userId);

    if (userById === undefined) {
        ctx.response.body = {
            message: 'User not found.'
        }
        ctx.response.status = 404;
    }

    if (userById !== undefined) {
        const {
            firstName,
            middleName,
            lastName,
            email,
            status,
            updatedBy
        } = ctx.request.body;
        try {
            let user = await updateUser(firstName, middleName, lastName, email, status, updatedBy, userId);
            console.log(user);
            ctx.response.body = user
            ctx.response.status = 202;
        } catch (err) {
            ctx.response.status = 500;
        }
    }
    await next();
});

router.delete('/users/:id', async (ctx, next) => {
    const userId = ctx.params.id;
    const userById = await getUserById(userId);

    if (userById === undefined) {
        ctx.response.body = {
            message: 'User not found.'
        }
        ctx.response.status = 404;
    }

    //Change status
    if (userById !== undefined) {
        try {
            let newList = await deleteUser(userId);
            ctx.response.body = newList;
            ctx.response.status = 202;
        } catch (err) {
            ctx.response.status = 500;
        }
    }
    await next();
});

module.exports = router.routes();
//.allowedMethods();