'use strict';

(function(){
	var app = angular.module('checkers', ['ui.bootstrap']);
	app.controller('checkerctrl', ['$scope', function($scope){
		var vm = this;
		vm.lst = [];
		vm.game = {};
		vm.myturn = false;
		vm.selectedpiece = {};

		vm.pieces = {
			mypieces:[{id:1, position: "A2"}, {id:2, position: "B1"},{id:3, position: "C2"}, {id: 4, position: "D1"}],
			opponent:[{id:1, position: "A6"},{id:2, position:"B5"}, {id: 3, position: "C6"},{id:4, position:"D5"}]
		};

		var socket = io();

		vm.message='';

		$scope.sendMessage= function(){
			socket.emit('chat message', vm.message);
			vm.message = '';
		};

		

		$scope.pieceselected=function(position){
			
			vm.selectedpiece = _.where(vm.pieces.mypieces, { position: position })[0];
			
		};

		$scope.movehere=function(position){
			console.log("movehere", position);
			vm.myturn = false;
			vm.selectedpiece.position = position;
			socket.emit('move taken', {piece: vm.selectedpiece, player: vm.game.player, name: vm.game.name});
		};

		socket.on('chat message', function(msg){
			vm.lst.push(msg);
			$scope.$apply();
		});

		socket.on('game', function(game){
			vm.game = game;
			if(vm.game.player==='player1'){
				vm.myturn = true;
			}
			//console.log(game);
		});

		socket.on('move taken', function(obj){
			vm.myturn = true;
			var oppoPiece = _.where(vm.pieces.opponent, { id: obj.piece.id })[0]; //use lodash to find the piece in the oppo list.
			oppoPiece.position = obj.piece.position;
			console.log(obj);
		});
	}]);
	app.directive('checkersMyPiece', function(){
		return{
			restrict: 'E',

		};
	});
})();