let router = new (require('koa-router'))();

router.get('/users', async (ctx, next) => {
    const _users = await users.getUsers();
    ctx.response.body = _users;
    ctx.response.status = 200;
    await next();
});

module.exports= router;
