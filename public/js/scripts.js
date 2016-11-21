/**
 * Created by miroslav.georgiev on 11/19/16.
 */

(function () {
    'use strict';

    const txtInput = document.querySelector('#txtInput');
    const btnRegUser = document.querySelector('#btnRegUser');
    const btnGetMsg = document.querySelector('#btnGetMsg');
    const socket = io();

    btnRegUser.addEventListener('click', registerUser.bind(null, txtInput), false);
    btnGetMsg.addEventListener('click', getMsg.bind(null, txtInput), false);
    socket.on('newUser', newUser);
    socket.on('sendMsg', gotMsg);

    function registerUser(user) {
        socket.emit('saveUser', user.value);
    }

    function getMsg(msg) {
        socket.emit('getMsg', msg.value);
    }

    function newUser(user) {
        console.log('newUser:', user);
    }

    function gotMsg(msg) {
        console.log('msgInfo:', msg);
    }
})();