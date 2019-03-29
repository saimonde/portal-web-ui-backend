
const { HTTPResponseError } = require('./requests.js');
const app = new (require('koa'))();
const koaBody = require('koa-body')();
const qs = require('querystring');
const fetch = require('node-fetch');
const URL = require('url').URL;
const https = require('https');
const util = require('util');

// TODO:
// - reject content types that are not application/json (this comes back to validation)


///////////////////////////////////////////////////////////////////////////////
// Utilities
///////////////////////////////////////////////////////////////////////////////

// Our data should come out of the query sorted, but in case something funny happens in
// between, we sort it here. The basic reason for doing so is that this is easier than auditing
// all the code in the query. Not sure what the node Array sort implementation looks like, but
// assuming it doesn't have a pathological complexity for sorted data, this sort shouldn't have
// a large cost.
const dateSortDesc = (a, b) => a.createdDate < b.createdDate ? 1 : -1;


///////////////////////////////////////////////////////////////////////////////
// Config
///////////////////////////////////////////////////////////////////////////////

// Load .env file into process.env if it exists. This is convenient for running locally.
require('dotenv').config();

// Create config from environment. The idea of putting this here is that all environment variables
// are places into this config. That way, if necessary, it's easy for a reader to see all of the
// required config in one place.
const config = {
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: 'central_ledger'
    },
    server: {
        listenPort: process.env.LISTEN_PORT
    },
    settlementsEndpoint: process.env.SETTLEMENTS_ENDPOINT,
    centralLedgerEndpoint: process.env.CENTRAL_LEDGER_ENDPOINT,
    auth: {
        bypass: process.env.BYPASS_AUTH === 'true',
        loginEndpoint: (new URL(process.env.AUTH_SERVICE, `${process.env.AUTH_SERVER}:${process.env.AUTH_SERVER_PORT}`)).href,
        validateEndpoint: (new URL(process.env.VALIDATE_SERVICE, `${process.env.AUTH_SERVER}:${process.env.AUTH_SERVER_PORT}`)).href,
        key: process.env.AUTH_SERVER_CLIENTKEY,
        secret: process.env.AUTH_SERVER_CLIENTSECRET
    },
    corsReflectOrigin: process.env.CORS_ACCESS_CONTROL_REFLECT_ORIGIN === 'true'
};

// Set up the db
const db = new (require('./db'))(config.db);

// Simple logging function. Should replace this with structured logging.
const log = (...args) => {
    console.log(`[${(new Date()).toISOString()}]`, ...args);
};

// Log development/production status
log('Running in ', process.env.NODE_ENV);

// Warnings for certain environment var settings
if (config.corsReflectOrigin) {
    log('WARNING: NODE_ENV = \'production\' and CORS origin being reflected in Access-Control-Allow-Origin header. ' +
        'Changing CORS_ACCESS_CONTROL_REFLECT_ORIGIN to false is important for preventing CSRF.');
}
if (config.auth.bypass) {
    log('WARNING: auth bypass enabled- all login requests will be approved');
}

// Create an https agent for use with self-signed certificates
// TODO: do we need this? It's used when contacting wso2. Does wso2 have a self-signed cert?
const selfSignedAgent = new https.Agent({ rejectUnauthorized: false });


///////////////////////////////////////////////////////////////////////////////
// Pre-route-handler middleware
///////////////////////////////////////////////////////////////////////////////

// Return 500 for any unhandled errors
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        log('Error', util.inspect(err, { depth: 10 }));
        ctx.response.status = 500;
        ctx.response.body = { msg: 'Unhandled Internal Error' };
    }
    log(`${ctx.request.method} ${ctx.request.path} | ${ctx.response.status}`);
});

// Log all requests
app.use(async (ctx, next) => {
    log(`${ctx.request.method} ${ctx.request.path}${ctx.request.search}`);
    await next();
});

// Nasty CORS response, should really be per-route
// TODO: tidy/fix
app.use(async (ctx, next) => {
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
});

// Authorise all requests except login
// TODO: authorise before handling CORS?
app.use(async (ctx, next) => {
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
});

// Parse request bodies of certain content types (see koa-body docs for more)
app.use(koaBody);


///////////////////////////////////////////////////////////////////////////////
// Route handling
///////////////////////////////////////////////////////////////////////////////

let router = new (require('koa-router'))();

// Health-check
router.get('/', async (ctx, next) => {
    try {
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
        if (err instanceof HTTPResponseError && err.getData().resp.message === 'Error occured') {
            ctx.response.status = 400;
            ctx.response.body = err.getData();
        }
        else {
            throw err;
        }
    }
    await next();
});

router.get('/dfsps', async (ctx, next) => {
    const dfsps = await db.getDfsps();
    ctx.response.body = dfsps;
    ctx.response.status = 200;
    await next();
});

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

// Route requests according to the routes above
app.use(router.routes());
app.use(router.allowedMethods());


///////////////////////////////////////////////////////////////////////////////
// Post-route-handler processing
///////////////////////////////////////////////////////////////////////////////

// Allow any origin by echoing the origin back to the client
// TODO: we should remove this in production and use k8s to route the responses such that the root
// serves the UI and all non-root requests serve the API.
if (process.env.ALLOW_ALL_ORIGINS === 'true') {
    app.use(async (ctx, next) => {
        if (undefined !== ctx.request.headers['origin']) {
            ctx.response.set({
                'Access-Control-Allow-Origin': ctx.request.headers['origin']
            });
        }
        await next();
    });
}


///////////////////////////////////////////////////////////////////////////////
// Start app
///////////////////////////////////////////////////////////////////////////////

log('Config:', config);
log(`Listening on port ${config.server.listenPort}`);
app.listen(config.server.listenPort);
