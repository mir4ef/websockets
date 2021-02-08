/**
 * @file server.js
 * @author Miroslav Georgiev
 * @version 0.0.2
 */
'use strict';

// load the packages
require('dotenv-safe').config();
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
const config = require('./config');
const helpers = require('./helpers');
const apiRoutesV1 = require('./routes/v1/api')(app, express);
const options = {
    key: fs.readFileSync('server/certs/miro.key'),
    cert: fs.readFileSync('server/certs/miro.pem'),
    passphrase: config.certphrase,
    minVersion: crypto.DEFAULT_MIN_VERSION,
    maxVersion: crypto.DEFAULT_MAX_VERSION,
};
const server = spdy.createServer(options, app);
const io = require('socket.io')(server);
require('./routes/v1/stream')(io);

const RateLimit = require('express-rate-limit');
const limiter = new RateLimit({
    windowMs: config.windowMs * 60 * 1000, // minutes windows to track requests (default 25)
    max: config.maxRequests, // limit each IP to maximum requests per windowMs (default 150)
    delayMs: 0 // disable delaying - full speed until the max limit is reached
});

// print if debugging logs are enabled
if (config.debug) {
    console.info(`##############################`);
    console.info(`###     DEBUG ENABLED     ####`);
    console.info(`##############################`);

    // log all requests to the console
    app.use(morgan('dev'));
}

// enable when you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
if (config.trustProxy) {
    app.enable('trust proxy');

    if (config.debug) {
        console.info(`${new Date()}: 'trust proxy' enabled!`);
    }
}

// compress static files (JavaScript, CSS, images)
// MUST BE PLACED BEFORE DEFINING THE STATIC FILES FOLDER/PATH!!!
app.use(compress());

// protect the app from some well-known web vulnerabilities by setting HTTP headers appropriately
app.use(helmet());

// use body parser to get info from POST requests
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
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
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});

// start the server
server.listen(config.port, () => {
    console.info(`${new Date()}: The server has been started on port: ${config.port}`);
    console.info(`${new Date()}: The environment is: ${config.env}`);
});
