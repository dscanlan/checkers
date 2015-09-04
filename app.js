'use strict';
var express = require('express');
var app = express();
var config = require('./checkers_config');

var http = require('http').Server(app);
var socketio = require('socket.io')(http);
//var socketio = require('./checkers_socket'); // this isn't working. Perhaps its becuase it uses a new http and listen is being set here.
var redis = require('./checkers_redis');



app.use(express.static('public'));
app.use(express.static('bower_components'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

var associateGame = function(obj){
	if(obj.found){
		console.log('associateGame assignGame');
		redis.assignGame(obj.game, obj.socket.id);
	}else{
		console.log('associateGame createGame');
		redis.createGame(obj.socket.id);
	}
}

socketio.on('connection', function(socket){
	console.log('user connected', socket.id);
	redis.checkAwaitingGames(socket, associateGame);
	
	socket.on('disconnect', function(){
		redis.closeGame(socket.id);
		console.log('user disconnected');
	});
	socket.on('chat message', function(message){
		//socket.broadcast.emit(message);
		socket.emit('chat message',message);
		console.log('message: ' + message);
	});
});




http.listen(config.server_port, function(){
	console.log('Listening on port ' + config.server_port);
});
