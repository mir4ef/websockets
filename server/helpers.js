/**
 * @file helpers.js Helper functions
 * @author Miroslav Georgiev
 * @version 0.0.1
 */
'use strict';

/**
 * @description Handler to set the headers to handle CORS requests
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param next
 */
exports.handleCORS = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authentication');
    next();
};

/**
 * @description Handler for server errors and returns an error message to the client
 * @param {Object} err The error object
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param next
 */
exports.handleError = (err, req, res, next) => res.status(err.code || 500).json({ success: false, message: err.message });

/**
 * @description Handler for HTTP request to redirect them to HTTPS
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Object|Function} next The call back function to allow the application to continue
 */
exports.redirectToHTTPS = (req, res, next) => {
    if (!req.secure) {
        // request was via http, so redirect to https
        return res.redirect('https://' + req.headers.host + req.url);
    }

    // request was via https, so do no special handling
    next();
};

/**
 * @description Safely escape characters during replace or other RegEx methods
 * @param {String} str
 * @returns {String}
 */
exports.escapeRegExp = str => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$&");