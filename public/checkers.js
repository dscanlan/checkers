'use strict';

(function(){
	var app = angular.module('checkers', ['ui.bootstrap']);
	app.controller('checkerctrl', ['$scope', function($scope){
		var vm = this;
		vm.lst = [];
		vm.game = {};
		vm.myturn = false;
		vm.selectedpiece = {};

		vm.icons = {player1:'icon-myPiece', player2:'icon-opponent',blank:''};

		vm.pieces = 
			[
				
					{position: 'A1', class: vm.icons.player2, player: 'player2'},
					{position: 'A2', class: undefined, player: undefined},
					{position: 'A3', class: vm.icons.player2, player: 'player2'},
					{position: 'A4', class: undefined, player: undefined},
				
					{position: 'B1', class: undefined, player: undefined},
					{position: 'B2', class: vm.icons.player2, player: 'player2'},
					{position: 'B3', class: undefined, player: undefined},
					{position: 'B4', class: vm.icons.player2, player: 'player2'},
				
					{position: 'C1', class: undefined, player: undefined},
					{position: 'C2', class: undefined, player: undefined},
					{position: 'C3', class: undefined, player: undefined},
					{position: 'C4', class: undefined, player: undefined},
			
					{position: 'D1', class: undefined, player: undefined},
					{position: 'D2', class: undefined, player: undefined},
					{position: 'D3', class: undefined, player: undefined},
					{position: 'D4', class: undefined, player: undefined},
				
					{position: 'E1', class: vm.icons.player1, player: 'player1'},
					{position: 'E2', class: undefined, player: undefined},
					{position: 'E3', class: vm.icons.player1, player: 'player1'},
					{position: 'E4', class: undefined, player: undefined},
				
					{position: 'F1', class: undefined, player: undefined},
					{position: 'F2', class: vm.icons.player1, player: 'player1'},
					{position: 'F3', class: undefined, player: undefined},
					{position: 'F4', class: vm.icons.player1, player: 'player1'}
			]
			
		;

			/*mypieces:[{id:1, position: "A2"}, {id:2, position: "B1"},{id:3, position: "C2"}, {id: 4, position: "D1"}],
			opponent:[{id:1, position: "A6"},{id:2, position:"B5"}, {id: 3, position: "C6"},{id:4, position:"D5"}]
		};*/

		var socket = io();

		vm.message='';

		$scope.sendMessage= function(){
			socket.emit('chat message', vm.message);
			vm.message = '';
		};

		

		$scope.pieceselected=function(position){
			
			vm.selectedpiece = _.where(vm.pieces, { position: position })[0];
			
		};

		$scope.checkPosition = function(position){
			
			if(_.where(vm.pieces, { position: position })[0].player === undefined){
				//console.log('checkPosition', false);
				return false;
			}
			//console.log('checkPosition', true);
			return true;
		};

		$scope.getPositionClass = function(position){

			//console.log('getPositionClass', _.where(vm.pieces, {position: position})[0], position);
			return _.where(vm.pieces, {position: position})[0].class;
		};

		$scope.returngrid= function(position){
			return _.where(vm.pieces, {position: position})[0];
		};

		$scope.movehere=function(position){
			if(vm.selectedpiece.player === vm.game.player){
				vm.myturn = false;
				
				vm.selectedpiece.class= undefined;
				vm.selectedpiece.player=undefined;
				vm._movedTo = _.where(vm.pieces, {position: position})[0];
				if(vm.game.player ==='player1'){
					vm._movedTo.class=vm.icons.player1;
				}
				else
				{
					vm._movedTo.class=vm.icons.player2;
				}
				vm._movedTo.player=vm.game.player;
				console.log(vm.selectedpiece);
				console.log('move taken', {piece: vm.selectedpiece, movedTo: vm._movedTo, player: vm.game.player, name: vm.game.name});
				socket.emit('move taken', {piece: vm.selectedpiece, movedTo: vm._movedTo, player: vm.game.player, name: vm.game.name});
			}
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
			$scope.apply();
			//console.log(game);
		});

		socket.on('move taken', function(obj){
			console.log(obj);
			vm.myturn = true;
			var oppoPiece = _.where(vm.pieces, { position: obj.piece.position })[0]; //use lodash to find the piece in the oppo list.

			oppoPiece.class = undefined;
			oppoPiece.player = undefined;


			var moved = _.where(vm.pieces, { position: obj.movedTo.position })[0];
			if(obj.movedTo.player ==='player1'){
				moved.class=vm.icons.player1;
			}
			else{
				moved.class=vm.icons.player2;
			}
			moved.player = obj.movedTo.player;
			$scope.$apply();
			//console.log(moved);
			//console.log(vm.pieces);
		});
	}]);
	app.directive('checkersMyPiece', function(){
		return{
			restrict: 'E',
			transclude: true,
			scope: {
		      	position: '@'
		    },
			template: '',
			link: function (scope, element, attrs) {
		      	scope.elementClass = position.class;

		    }
		};
	});
})();