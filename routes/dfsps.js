const router = new (require('koa-router'))();
const qs = require('querystring');
const fetch = require('node-fetch');
const util = require('util');

//Include models
const dfsps=require('../models/dfsps');

router.get('/dfsps', async (ctx, next) => {
    const _dfsps = await dfsps.getDfsps();
    ctx.response.body = _dfsps;
    ctx.response.status = 200;
    await next();
});

module.exports = router.routes();
                        //.allowedMethods();

