# admin-portal-web-ui-backend
The backend service to support admin portal web ui. Essentially a thin wrapper around SQL queries and API calls.

## TODO
* Make sure app.env is 'production' in production.  See: https://koajs.com/ 'Settings' section.
* In development mode check for divergence between .env.template and .env and warn the user
* Bring api.json up to date
* * Double-check all sensible escaping, including HTML and SQL escaping occurs wherever anything goes
    into the db, or is stored and later returned to the client
* Check all mandatory environment and secrets are present before beginning operation. Print a
    useful error message informing that operation cannot continue if they are not.

## Running locally
You'll need access to a mysql instance containing some TIPS data.

Copy the `.template.env` file to a `.env` file and change details as appropriate. Note the
`SETTLEMENTS_ENDPOINT` and `CENTRAL_LEDGER_ENDPOINT` values. Then port forward the central ledger
and central settlements services as follows, replacing the ports 4000 and 4001 to correspond to the
values in the `.env` file, and replacing `$whatever` as appropriate for your deployment (you can
get these values either with tab-completion, or `kubectl get pods`):
```bash
kubectl port-forward mowbkd-centralledger-service-$whatever 4001:3001
kubectl port-forward mowbkd-centralsettlement-$whatever 4000:3007
npm install
node index.js
```

## TODO

