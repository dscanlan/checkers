'use strict';

(function(){
	var app = angular.module('checkers', []);
	app.controller('checkerctrl', ['$scope', function($scope){
		var vm = this;
		vm.lst = [];

		var socket = io();

		vm.message='';

		$scope.sendMessage= function(){
			socket.emit('chat message', vm.message);
			vm.message = '';
		}

		socket.on('chat message', function(msg){
			vm.lst.push(msg);
			
		})
	}]);
})();