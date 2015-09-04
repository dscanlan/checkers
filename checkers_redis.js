var redis = require('redis');
var config = require('./checkers_config');
var client = redis.createClient(); //By default, redis.createClient() will use 127.0.0.1 and 6379 as the hostname and port 
var uuid = require('node-uuid');
//var async = require('async');
client.on('connect', function(){
	console.log('connected to redis');
})

var exports = module.exports;

exports.checkAwaitingGames = function(socket, callback){
	client.keys('*', function(err, games){
		/*async.forEachSeries(games, function(game, reply){
			client.get(game, function(err, reply){
				if(err){
					console.log('Error finding game to play');
				}

			});
		});*/
		if(games.length > 0){
			games.forEach(function(game, i){
				//console.log(game);
				client.hgetall(game, function(err, reply){
					//console.log(reply);
					if(reply.player2 === '' && reply.player2 !== socket.id){
						//console.log('game', reply);
						callback({game: game, found: true, socket: socket});
					}
					else{
						
						callback({game: '', found: false, socket: socket});
					}
				});
			});
		}
		else
		{
			callback({game: '', found: false, socket: socket});
		}
	});
};

exports.assignGame = function(game, socketid){
	//console.log('in assign', game);
	client.hgetall(game, function(err, reply){

		if(err){
			exports.createGame(socketid);
			console.log('error assigning to game');
		}
		//console.log(reply);
		reply.player2 = socketid;
		console.log('reply' ,reply)
	});
};

exports.createGame = function(sessionid){
	var uuid1 = uuid.v4();
	var game = config.redis_root_key+uuid1;
	client.hmset(game, {
		'player1': sessionid,
		'player2': ''
	});


};

