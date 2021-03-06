const router = new (require('koa-router'))();
const qs = require('querystring');
const https = require('http');
const fetch = require('node-fetch');
const base64 = require('base-64');
const request = require('../requests');
const {checkUserCredentials}=require('../models/users');
const {userRoles,getAccessMenu}=require('../models/role');


// Create config from environment. The idea of putting this here is that all environment variables
// are places into this config. That way, if necessary, it's easy for a reader to see all of the
// required config in one place.
const config = require("../config/global")

// Db connection
const db = new (require('../config/db'))(config.db);

// Create an https agent for use with self-signed certificates
// TODO: do we need this? It's used when contacting wso2. Does wso2 have a self-signed cert?
const selfSignedAgent = new https.Agent({ rejectUnauthorized: false });

router.post('/login', async (ctx, next) => {
    // if (config.auth.bypass) {
    //     config.log('authentication bypassed');
    //     ctx.response.body = {
    //         expiresIn: '3600'
    //     };
    //     ctx.response.set({
    //         'Set-Cookie': 'token=bypassed; Secure; HttpOnly; SameSite=strict'
    //     });
    //     ctx.response.status = 200;
    //     return await next();
    // }

    const { username, password } = ctx.request.body;
    //Check if user with posted credentials exists

    // let user = await checkUserCredentials(username, password);
    // if(user === undefined){
    //     config.log('*******user does not exist');
    //     ctx.response.body = {
    //         message: 'Invalid username & password.'
    //     };
    //     ctx.response.status = 401; // TODO: Or 403?
    //     return await next();
    // }
    // const userId=user.userId;
    // //User active roles
    // let roles = await userRoles(userId);

    // //User active roles
    // let menu = await getAccessMenu(userId);
    
    // //Remove this later to allow oauth authentication
    // ctx.response.body = {
    //     expiresIn: '3600',
    //     user:user,
    //     roles:roles,
    //     accessMenu:menu
    // };
    // ctx.response.set({
    //     'Set-Cookie': 'token=bypassed; Secure; HttpOnly; SameSite=strict'
    // });
    // ctx.response.status = 200;
    // return await next();
    

    //Uncomment the bellow code to allow oauth authentication
    const opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${base64.encode(`${'valid_client_id'}:${123456}`)}`
        },
        body: qs.stringify({
            client_id: config.auth.key,
            client_secret: config.auth.secret,
            grant_type: 'password',
            username: username,
            password: password
        })
    };
    
    let oauth2Token = await fetch(config.auth.loginEndpoint, opts).then(res => res.json())

    if (oauth2Token === null) {
        ctx.response.status = 401; // TODO: Or 403?
        return await next();
    }

    ctx.response.body = {
        access_token: oauth2Token['access_token'],
        expiresIn: oauth2Token['expiresIn']
    };
    ctx.response.set({
        'Set-Cookie': `token=${oauth2Token['access_token']}; Secure; HttpOnly; SameSite=strict`
    });
    ctx.session.token = oauth2Token['access_token'];
    //console.log(oauth2Token['access_token']);
    console.log(ctx.response.get('Cookie'));
    ctx.response.status = 200;

    await next();

});

module.exports=router.routes();
//.allowedMethods();