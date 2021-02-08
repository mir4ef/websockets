/**
 * @file stream.js contains Streaming/Websocket API routes used by the application
 * @author Miroslav Georgiev
 * @version 0.0.2
 */

'use strict';

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
        // send to sender client
        this.emit('newUser', user);
    }

    function sendMsg(msg) {
        // send to all connected clients except the sender
        this.broadcast.emit('sendMsg', msg);
    }

    /**
     * *************************************************
     * END ROUTES HANDLERS/METHODS
     * *************************************************
     */
};
