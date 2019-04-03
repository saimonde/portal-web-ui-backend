const { HTTPResponseError } = require('./requests.js');
const app = new (require('koa'))();
const koaBody = require('koa-body')();
const https = require('https');
const cors = require('@koa/cors');

//Include middleware
const middleware = require('./middleware');

//Include routes
const health=require('./routes/health');
const authenticate=require('./routes/authenticate');
const dfspsRoutes=require('./routes/dfsps');
const usersRoutes=require('./routes/users');

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
const config =require('./config/global');

// Log development/production status
config.log('Running in ', process.env.NODE_ENV);

// Warnings for certain environment var settings
if (config.corsReflectOrigin) {
    config.log('WARNING: NODE_ENV = \'production\' and CORS origin being reflected in Access-Control-Allow-Origin header. ' +
        'Changing CORS_ACCESS_CONTROL_REFLECT_ORIGIN to false is important for preventing CSRF.');
}
if (config.auth.bypass) {
    config.log('WARNING: auth bypass enabled- all login requests will be approved');
}

// Create an https agent for use with self-signed certificates
// TODO: do we need this? It's used when contacting wso2. Does wso2 have a self-signed cert?
const selfSignedAgent = new https.Agent({ rejectUnauthorized: false });


///////////////////////////////////////////////////////////////////////////////
// Pre-route-handler middleware
///////////////////////////////////////////////////////////////////////////////

app.use(middleware);

// Parse request bodies of certain content types (see koa-body docs for more)
app.use(koaBody);


///////////////////////////////////////////////////////////////////////////////
// Route handling
///////////////////////////////////////////////////////////////////////////////
app.use(cors());
app.use(health);
app.use(dfspsRoutes);
app.use(usersRoutes);
app.use(authenticate);

///////////////////////////////////////////////////////////////////////////////
// Post-route-handler processing
///////////////////////////////////////////////////////////////////////////////

// Allow any origin by echoing the origin back to the client
// TODO: we should remove this in production and use k8s to route the responses such that the root
// serves the UI and all non-root requests serve the API.
if (process.env.ALLOW_ALL_ORIGINS === 'true') {
    app.use(async (ctx, next) => {
       // console.log(ctx.request.headers['origin']);
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

config.log('Config:', config);
config.log(`Listening on port ${config.server.listenPort}`);
app.listen(config.server.listenPort);
