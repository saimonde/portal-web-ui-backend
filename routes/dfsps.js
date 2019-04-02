let router = new (require('koa-router'))();

router.get('/dfsps', async (ctx, next) => {
    const _dfsps = await dfsps.getDfsps();
    ctx.response.body = _dfsps;
    ctx.response.status = 200;
    await next();
});

module.exports= router;

