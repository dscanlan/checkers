'use strict';
var express = require('express');
var app = express();

var http = require('http').Server(app);
var socketio = require('socket.io')(http);



app.use(express.static('public'));
app.use(express.static('bower_components'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

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

http.listen(3000, function(){
	console.log('Listening on port 3000');
});
