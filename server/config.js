/**
 * @file config.js Server side configurations
 * @author Miroslav Georgiev
 * @version 0.0.1
 */
'use strict';

module.exports = {
    'port': process.env.PORT || 8080,
    'env': process.env.ENV || 'development',
    'certphrase': process.env.CERTPHRASE || '',
    'debug': process.env.APP_DEBUG === 'true'
};