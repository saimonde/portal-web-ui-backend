const router = new (require('koa-router'))();

//Include models
const {getAllUsers}=require('../models/users');

router.get('/users', async (ctx, next) => {
    const _users = await getAllUsers();
    ctx.response.body = _users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
    ctx.response.status = 200;
    await next();
});

module.exports = router.routes();
                        //.allowedMethods();
