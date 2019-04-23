const router = new (require('koa-router'))();
const qs = require('querystring');
const fetch = require('node-fetch');
const util = require('util');

//Include models
const {getTransactionsByDfsp}=require('../models/transactions');

router.get('/transactions/:dfsp', async (ctx, next) => {
    const dfspId=ctx.params.dfsp;
    try{
        const tranactions = await getTransactionsByDfsp(dfspId);
        ctx.response.body = tranactions;
        ctx.response.status = 200;
    }catch(err){
        ctx.response.status = 500;
    }
    await next();
});

module.exports = router.routes();
                        //.allowedMethods();
