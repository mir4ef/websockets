/**
 * @file server.js
 * @author Miroslav Georgiev
 * @version 0.0.1
 */
'use strict';

// load the packages
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compress = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const spdy = require('spdy');
const config = require('./server/config');
const helpers = require('./server/helpers');
const apiRoutesV1 = require('./server/routes/v1/api')(app, express);
const options = {
    key: fs.readFileSync('server/certs/miro.key'),
    cert: fs.readFileSync('server/certs/miro.pem'),
    passphrase: config.certphrase,
    secureOptions: crypto.constants.SSL_OP_NO_TLSv1
};
const server = spdy.createServer(options, app);
const io = require('socket.io')(server);
require('./server/routes/v1/stream')(io);

// print if debugging logs are enabled
if (config.debug) {
    console.info(`##############################`);
    console.info(`###     DEBUG ENABLED     ####`);
    console.info(`##############################`);

    // log all requests to the console
    app.use(morgan('dev'));
}

// compress static files (JavaScript, CSS, images)
// MUST BE PLACED BEFORE DEFINING THE STATIC FILES FOLDER/PATH!!!
app.use(compress());

// protect the app from some well-known web vulnerabilities by setting HTTP headers appropriately
app.use(helmet());

// use body parser to get info from POST requests
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// for parsing application/json
app.use(bodyParser.json());

// handle CORS requests
app.use(helpers.handleCORS);

// set the public folder to serve public assets the frontend will request
app.use(express.static('public'));

// all the routes will be prefixed with /api
app.use('/api/v1', apiRoutesV1);

// middleware to handle server side errors
app.use(helpers.handleError);

// catch all routes and send the user to the frontend
// has to be registered after API ROUTES
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// start the server
server.listen(config.port, () => {
    console.info(`${new Date()}: The server has been started on port: ${config.port}`);
    console.info(`${new Date()}: The environment is: ${config.env}`);
});