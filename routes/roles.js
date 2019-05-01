const router = new (require('koa-router'))();

//Include models
const {getRoles}=require('../models/role');

router.get('/roles', async (ctx, next) => {
    const roles = await getRoles();
    ctx.response.body = roles
    ctx.response.status = 200;
    await next();
});


module.exports = router.routes();
                        //.allowedMethods();
