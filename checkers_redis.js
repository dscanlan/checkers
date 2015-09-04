var redis = require('redis');
var config = require('./checkers_config');
var client = redis.createClient(); //By default, redis.createClient() will use 127.0.0.1 and 6379 as the hostname and port 
var uuid = require('node-uuid');
client.on('connect', function(){
	console.log('connected to redis');
})

var exports = module.exports;

checkAwaitingGames = function(){
	
}

exports.createGame = function(sessionid){
	var uuid1 = uuid.v4();
	var game = config.redis_root_key+uuid1;
	client.hmset(game, {
		'player1': sessionid,
		'player2': ''
	});
};

