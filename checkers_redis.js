var redis = require('redis');
var config = require('./checkers_config');
var client = redis.createClient(); //By default, redis.createClient() will use 127.0.0.1 and 6379 as the hostname and port 

client.on('connect', function(){
	console.log('connected to redis');
})



module.exports = client;