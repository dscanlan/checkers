'use strict';
var express = require('express');
var app = express();

var http = require('http').Server(app);

var socketio = require('./checkers_socket');
var redis = require('./checkers_redis');



app.use(express.static('public'));
app.use(express.static('bower_components'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});





http.listen(3000, function(){
	console.log('Listening on port 3000');
});
