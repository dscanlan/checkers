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
					if(reply.player2 === '' && reply.player1 !== socket.id){
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

exports.assignGame = function(game, socketid, dispatcher){
	//console.log('in assign', game);
	client.hgetall(game, function(err, reply){

		if(err){
			exports.createGame(socketid);
			console.log('error assigning to game');
		}
		//console.log(reply);
		
		reply.player2 = socketid;
		client.hmset(game, reply);
		//console.log('reply' ,reply)
		var message = {
			name: game,
			player: 'player2'
		}
		dispatcher('game', message, socketid);
	});
};

exports.createGame = function(sessionid, dispatcher){
	var uuid1 = uuid.v4();
	var game = config.redis_root_key+uuid1;
	client.hmset(game, {
		'player1': sessionid,
		'player2': ''
	});

	var message = {
			name: game,
			player: 'player1'
		}
		dispatcher('game',message, sessionid);
};

exports.closeGame = function(sessionid){
	//console.log('socket.id', sessionid);
	client.keys('*', function(err, games){
		games.forEach(function(game, i){
			//console.log(game);
			client.hgetall(game, function(err, reply){
				//console.log(reply);
				if(reply.player1 === sessionid){
					client.del(game);
				}
				
			});
		});
	});
}

exports.getOpponent = function(obj,  dispatcher){
	client.hgetall(obj.name, function(err, found){
		var message = {
				grid: obj.grid
			}
		if(obj.player ==='player1'){

			dispatcher('move taken', message, found.player2);
			
		}
		else{
			dispatcher('move taken', message, found.player1);
		}
	});
};

