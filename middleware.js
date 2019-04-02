const config=require('./config/global');

// Return 500 for any unhandled errors
// Log all requests
module.exports = async (ctx, next) => {
    config.log(`${ctx.request.method} ${ctx.request.path}${ctx.request.search}`);
    await next();
}

// Nasty CORS response, should really be per-route
// TODO: tidy/fix
module.exports = async (ctx, next) => {
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


// Authorise all requests except login
// TODO: authorise before handling CORS?
module.exports = async (ctx, next) => {
    if (ctx.request.path === '/login' && ctx.request.method.toLowerCase() === 'post') {
        config.log('bypassing validation on login request');
        return await next();
    }
    if (config.auth.bypass) {
        config.log('request validation bypassed');
        return await next();
    }

    config.log('Cookie:', ctx.request.get('Cookie'));
    const token = ctx.request.get('Cookie').split('=').splice(1).join('');

    config.log('validating request, token:', token);
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
