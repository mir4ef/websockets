/**
 * @file stream.js contains Streaming/Websocket API routes used by the application
 * @author Miroslav Georgiev
 * @version 0.0.1
 */

'use strict';

const config = require('../../config');

module.exports = io => {

    /**
     * *************************************************
     * START ROUTES DEFINITIONS
     * *************************************************
     */

    io.on('connection', socket => {
        console.log('a user connected');
        socket.on('saveUser', saveUser);
        socket.on('getMsg', sendMsg);

        socket.on('disconnect', () => {
            console.log('miro user disconnected');
        });
    });

    /**
     * *************************************************
     * END ROUTES DEFINITIONS
     * *************************************************
     */

    /**
     * *************************************************
     * START ROUTES HANDLERS/METHODS
     * *************************************************
     */

    function saveUser(user) {
        this.emit('newUser', user);
    }

    function sendMsg(msg) {
        this.emit('sendMsg', msg);
    }

    /**
     * *************************************************
     * END ROUTES HANDLERS/METHODS
     * *************************************************
     */
};