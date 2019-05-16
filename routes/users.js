const router = new(require('koa-router'))();
const Joi = require('joi');
//Include models
const {
    getAllUsers,
    getUserById,
    registerUser,
    updateUser,
    deleteUser,
    updateUserSchema,
    belongsToSameDfsp
} = require('../models/users');
const {userRoles,getAccessMenu}=require('../models/role');

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


router.get('/users/:id', async (ctx, next) => { 
    const userId = ctx.params.id;
    const user = await getUserById(userId);
    const userInfo = user[0];
    //User active roles
    let roles = await userRoles(userId);
    //User active roles
    let menu = await getAccessMenu(userId);
    userInfo[0].roles=roles;
    userInfo[0].accessMenu=menu;
    ctx.response.body = userInfo;
    // ctx.response.body = userInfo.map(u => {
    //     const {
    //         password,
    //         ...userWithoutPassword
    //     } = u;        
    //     return userWithoutPassword;
    // });
   // console.log(ctx.response.body);
    
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
    const userId = ctx.params.id;
    const userById = await getUserById(userId);
   
    if (userById === undefined) {
        ctx.response.body = {
            message: process.env.USER_NOT_FOUND_MESSAGE
        }
        ctx.response.status = 404;
    }

    if (userById !== undefined) {
        const {
            error,
            value
        } = Joi.validate(ctx.request.body, updateUserSchema);
        const {
            firstName,
            middleName,
            lastName,
            email,
            status,
            updatedBy,
            mobileNumber,
            department,
            title,
            roles
        } = value;
        
        if (error !== null) {console.log(error.details[0].message);
            ctx.response.body = {
                message: error.details[0].message
            }
            ctx.response.status = 400;
        }

        if (error === null) {   
                 
            const sameDfsp = await belongsToSameDfsp(updatedBy, userId);
            console.log(sameDfsp);
            if (!sameDfsp) {
                ctx.response.body = {
                    message: process.env.USER_NOT_FOUND_MESSAGE
                }
                ctx.response.status = 404;
            } else {
                try {
                    let user = await updateUser(firstName, middleName, lastName, email, status, updatedBy, userId, mobileNumber, department, title, roles);
                    const {
                        password,
                        ...userWithoutPassword
                    } = user;
                    ctx.response.body = userWithoutPassword;
                    ctx.response.status = 202;
                } catch (err) {
                    ctx.response.body = {
                        code: err.errno,
                        message: err.message
                    };
                    ctx.response.status = 500;
                }
            }
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