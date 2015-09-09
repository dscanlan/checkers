'use strict';

(function(){
	var app = angular.module('checkers', ['ui.bootstrap']);
	app.controller('checkerctrl', ['$scope', function($scope){
		var vm = this;
		vm.lst = [];
		vm.game = {};
		vm.myturn = false;
		vm.player2Found = false;
		vm.selectedpiece = {};

		vm.icons = {player1:'icon-myPiece', player1Queen:'icon-myQueen' ,player2:'icon-opponent',player2Queen: 'icon-opponentQueen',blank:'blank'};

		vm.pieces = 
			[
				{position: 'A1', class: vm.icons.player2, player: 'player2', queen: false},
				{position: 'A2', class: vm.icons.blank, player: undefined, queen: false},
				{position: 'A3', class: vm.icons.player2, player: 'player2', queen: false},
				{position: 'A4', class: vm.icons.blank, player: undefined, queen: false},
			
				{position: 'B1', class: vm.icons.blank, player: undefined, queen: false},
				{position: 'B2', class: vm.icons.player2, player: 'player2', queen: false},
				{position: 'B3', class: vm.icons.blank, player: undefined, queen: false},
				{position: 'B4', class: vm.icons.player2, player: 'player2', queen: false},
			
				{position: 'C1', class: vm.icons.blank, player: undefined, queen: false},
				{position: 'C2', class: vm.icons.blank, player: undefined, queen: false},
				{position: 'C3', class: vm.icons.blank, player: undefined, queen: false},
				{position: 'C4', class: vm.icons.blank, player: undefined, queen: false},
		
				{position: 'D1', class: vm.icons.blank, player: undefined, queen: false},
				{position: 'D2', class: vm.icons.blank, player: undefined, queen: false},
				{position: 'D3', class: vm.icons.blank, player: undefined, queen: false},
				{position: 'D4', class: vm.icons.blank, player: undefined, queen: false},
			
				{position: 'E1', class: vm.icons.player1, player: 'player1', queen: false},
				{position: 'E2', class: vm.icons.blank, player: undefined, queen: false},
				{position: 'E3', class: vm.icons.player1, player: 'player1', queen: false},
				{position: 'E4', class: vm.icons.blank, player: undefined, queen: false},
			
				{position: 'F1', class: vm.icons.blank, player: undefined, queen: false},
				{position: 'F2', class: vm.icons.player1, player: 'player1', queen: false},
				{position: 'F3', class: vm.icons.blank, player: undefined, queen: false},
				{position: 'F4', class: vm.icons.player1, player: 'player1', queen: false}
			];

		vm.player1Home = ['F1', 'F2', 'F3', 'F4'];
		vm.player2Home = ['A1', 'A2', 'A3', 'A4'];

		vm.validateMove = function(from, to){
			var currentPosition = _.where(vm.pieces, {position: from})[0];

			if(currentPosition.position.split('')[0] === to.split('')[0]){ //sideways move which isn't allowed
				return false;
			}
			if(currentPosition.queen){
				return true;
			}
			if(vm.game.player ==='player1'){
				if(currentPosition.position.split('')[0] < to.split('')[0]){
					return false;
				}
			}
			else
			{
				if(currentPosition.position.split('')[0] > to.split('')[0]){
					return false;
				}
			}
			return true;
		};

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

				if(!vm.myturn){
					return false;
				}

				if(!vm.validateMove(vm.selectedpiece.position, position))
				{
					return false;
				}
				vm.myturn = false;
				
				
				
				
				vm._movedTo = _.where(vm.pieces, {position: position})[0];
				vm._movedTo.queen = vm.selectedpiece.queen;
				
				if(vm.game.player ==='player1'){
					vm._movedTo.class=vm.selectedpiece.class;

					if(!vm._movedTo.queen){
						var atAway = vm.player2Home.indexOf(position);
						
						if(atAway >= 0){
							vm._movedTo.queen = true;
							vm._movedTo.class=vm.icons.player1Queen;
						}
					}
				}
				else{
					vm._movedTo.class=vm.selectedpiece.class;
					if(!vm._movedTo.queen){
						var atAway = vm.player1Home.indexOf(position);
						if(atAway >= 0){
							vm._movedTo.queen = true;
							vm._movedTo.class=vm.icons.player2Queen;
						}
					}
				}
				vm._movedTo.player=vm.game.player;
				vm.selectedpiece.class= vm.icons.blank;
				vm.selectedpiece.player=undefined;
				vm.selectedpiece.queen = false;
				//console.log(vm._movedTo);
				//console.log('move taken', {piece: vm.selectedpiece, movedTo: vm._movedTo, player: vm.game.player, name: vm.game.name});
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
				//vm.myturn = true;
			}
			$scope.$apply();
			//console.log(game);
		});

		socket.on('player2 found', function(game){
			console.log('player2 found');
			vm.myturn = true;
			vm.player2Found = true;
			$scope.$apply();
		});

		socket.on('move taken', function(obj){
			//console.log('obj',obj);
			vm.myturn = true;
			var oppoPiece = _.where(vm.pieces, { position: obj.piece.position })[0]; //use lodash to find the piece in the oppo list.

			oppoPiece.class = vm.icons.blank;
			oppoPiece.player = undefined;
			oppoPiece.queen = false;

			var moved = _.where(vm.pieces, { position: obj.movedTo.position })[0];
			if(obj.movedTo.player ==='player1'){
				moved.class=vm.icons.player1;
			}
			else{
				moved.class=vm.icons.player2;
			}
			//console.log('obj.moveTo', obj.movedTo);
			//console.log('moved', moved);

			moved.player = obj.movedTo.player;
			moved.queen = obj.movedTo.queen;
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