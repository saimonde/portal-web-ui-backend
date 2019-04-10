const router = new (require('koa-router'))();
const qs = require('querystring');
const fetch = require('node-fetch');
const util = require('util');

//Include models
const {getDfsps}=require('../models/dfsps');

router.get('/dfsps', async (ctx, next) => {
    try{
        const _dfsps = await getDfsps();
        ctx.response.body = _dfsps;
        ctx.response.status = 200;
    }catch(err){
        console.log("***********caught errors")
        ctx.response.status = 500;
    }
    await next();
});

module.exports = router.routes();
                        //.allowedMethods();

