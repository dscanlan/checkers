var express = require('express');
var app = express();
var config = require('./checkers_config');

var http = require('http').Server(app);
var socketio = require('socket.io')(http);


socketio.on('connection', function(socket){
	console.log('user connected');
	socket.on('disconnected', function(){
		console.log('user disconnected');
	});
	socket.on('chat message', function(message){
		//socket.broadcast.emit(message);
		socket.emit('chat message',message);
		console.log('message: ' + message);
	});
});

module.exports = socketio;