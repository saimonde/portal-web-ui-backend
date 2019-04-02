// Log all requests
var logs=async (ctx, next) => {
    log(`${ctx.request.method} ${ctx.request.path}${ctx.request.search}`);
    await next();
}

// Nasty CORS response, should really be per-route
// TODO: tidy/fix
var resp=async (ctx, next) => {
    if (ctx.request.method === 'OPTIONS') {
        ctx.response.set({
            'Access-Control-Allow-Methods': 'GET,PUT,POST',
            'Access-Control-Allow-Headers': 'content-type,accept'
        });
        if (config.corsReflectOrigin) {
            ctx.response.set('Access-Control-Allow-Origin', ctx.request.headers['origin']);
        }
        ctx.response.status = 200;
    }
    else {
        await next();
    }
}

var auth=async (ctx, next) => {
    if (ctx.request.path === '/login' && ctx.request.method.toLowerCase() === 'post') {
        log('bypassing validation on login request');
        return await next();
    }
    if (config.auth.bypass) {
        log('request validation bypassed');
        return await next();
    }

    log('Cookie:', ctx.request.get('Cookie'));
    const token = ctx.request.get('Cookie').split('=').splice(1).join('');

    log('validating request, token:', token);
    const opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `token=${token}`,
        agent: selfSignedAgent
    };

    const validToken = await fetch(config.auth.validateEndpoint, opts).then(res => res.json());
    let isValid = validToken['active'] === 'true';

    if (!isValid) {
        ctx.response.status = 401; // TODO: 403?
        return;
    }

    ctx.response.body = { isValid };
    ctx.response.status = isActive ? 200 : 404;
    await next();
}

 module.exports={
    logs,
    resp,
    auth
 }