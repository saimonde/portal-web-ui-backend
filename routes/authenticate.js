const router = new (require('koa-router'))();

router.post('/login', async (ctx, next) => {
    if (config.auth.bypass) {
        log('authentication bypassed');
        ctx.response.body = {
            expiresIn: '3600'
        };
        ctx.response.set({
            'Set-Cookie': 'token=bypassed; Secure; HttpOnly; SameSite=strict'
        });
        ctx.response.status = 200;
        return await next();
    }

    const { username, password } = ctx.request.body;
    const opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({
            client_id: config.auth.key,
            client_secret: config.auth.secret,
            grant_type: 'password',
            username,
            password
        }),
        agent: selfSignedAgent
    };

    const oauth2Token = await fetch(config.auth.loginEndpoint, opts).then(res => res.json());

    if (oauth2Token === null) {
        ctx.response.status = 401; // TODO: Or 403?
        return await next();
    }

    ctx.response.body = {
        expiresIn: oauth2Token['expires_in']
    };
    ctx.response.set({
        'Set-Cookie': `token=${oauth2Token['access_token']}; Secure; HttpOnly; SameSite=strict`
    });
    ctx.response.status = 200;

    await next();

});

module.exports=router.routes();
                   // .allowedMethods();