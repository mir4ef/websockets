/**
 * @file config.js Server side configurations
 * @author Miroslav Georgiev
 * @version 0.0.2
 */
'use strict';

module.exports = {
    'port': process.env.PORT || 8443,
    'env': process.env.ENV || 'development',
    'certphrase': process.env.CERTPHRASE || '',
    'maxRequests': process.env.MAX_REQUESTS || 150,
    'windowMs': process.env.WINDOW_MINUTES || 25,
    'trustProxy': process.env.TRUST_PROXY === 'true',
    'debug': process.env.APP_DEBUG === 'true'
};
