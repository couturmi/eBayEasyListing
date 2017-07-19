/**
 * Created by mitchcout on 6/6/2017.
 */

const express = require('express');
var proxy = require('express-http-proxy');
const opn = require('opn');
const app = express();
const port = 8080;

/* Starting page */
app.use('/', express.static('./src' + '/'));
app.use('/ebayApiSandbox', proxy('https://api.sandbox.ebay.com'));
app.use('/ebayApiProd', proxy('https://api.ebay.com'));

app.listen(port, (err) => {
    if (err) {
        return console.log('ERROR: Could not start server', err);
    }

    console.log(`Success: server listening on port - ${port}`);

    /* ------ Open browser window ------ */
    console.log('Opening browser');
    opn('http://localhost:8080');
    console.log('Application opened successfully');
});