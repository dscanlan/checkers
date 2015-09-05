'use strict';

(function(){
	var app = angular.module('checkers', ['ui.bootstrap']);
	app.controller('checkerctrl', ['$scope', function($scope){
		var vm = this;
		vm.lst = [];
		vm.game = {};

		var socket = io();

		vm.message='';

		$scope.sendMessage= function(){
			socket.emit('chat message', vm.message);
			vm.message = '';
		}

		socket.on('chat message', function(msg){
			vm.lst.push(msg);
			$scope.$apply();
		});

		socket.on('game', function(game){
			vm.game = game;
			console.log(game);
		})

		socket.on('move taken', function(obj){
			console.log(obj);
		})
	}]);
})();