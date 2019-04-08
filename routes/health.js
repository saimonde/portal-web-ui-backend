const router = new (require('koa-router'))();
const config = require("../config/global")
// Db connection
const db = new (require('../config/db'))(config.db);

// Health-check
router.get('/', async (ctx, next) => {
    try {
        // let dummyQuery=await db.dummyQuery();
        // console.log(dummyQuery);
        db.dummyQuery();
        ctx.response.status = 204;
    } catch (err) {
        ctx.response.status = 500;
    }
    await next();
});

router.post('/dummypost', async (ctx, next) => {
    try {
        //call some async function here...
        //e.g. let result = awaut func();
        //
        ctx.response.body = {
            dummy: 'hello'
        };
        ctx.response.status = 200;
    } catch (err) {
        ctx.response.status = 400;
        ctx.response.body = err.getData();
        // if (err instanceof HTTPResponseError && err.getData().resp.message === 'Error occured') {
        //     ctx.response.status = 400;
        //     ctx.response.body = err.getData();
        // }
        // else {
        //     throw err;
        // }
    }
    await next();
});

module.exports = router.routes();
