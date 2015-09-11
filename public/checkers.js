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

		vm.validMoves = [];
		var rows = ['A', 'B', 'C', 'D', 'E', 'F'];
		var col = [1,2,3,4];

		vm.checkDiagonal = function(findPos){
			//console.log('findPos', findPos.toString());
			var pos = _.where(vm.pieces, {position: findPos.toString()})[0];
			//console.log('here', pos.player, pos);
			if(pos){
				
				if(pos.player === undefined){

					vm.validMoves.push({validPos: findPos, jumping: undefined });
					//console.log(vm.validMoves);
				}
				else if(pos.player !== vm.selectedpiece.player){
					//can we jump this piece?
					
					var col = vm.selectedpiece.position.split('')[1];
					var poscol = pos.position.split('')[1];
					//console.log('Check that we can jump', pos.position, vm.selectedpiece.position.split('')[1], pos.position.split('')[1]);
					if(col > poscol){ //we're going left
						console.log('were going left');
						if(vm.selectedpiece.player==='player2' || vm.selectedpiece.queen ===true){ //we're going down
							var targetRow = rows.indexOf(pos.position.split('')[0]);
							var targetCol = pos.position.split('')[1];
							if(targetRow < rows.indexOf('F')){
								if(targetCol > 1){
									var __pos = rows[targetRow + 1] + (parseInt(targetCol) - 1);
									var TargetPos = _.where(vm.pieces, {position: __pos })[0];
									if(TargetPos){
										if(TargetPos.player === undefined){
											vm.validMoves.push({validPos: TargetPos.position, jumping: pos.position });
										}
									}
								}
							}
						}
						if(vm.selectedpiece.player==='player1' || vm.selectedpiece.queen ===true){ //we're going up

							var targetRow = rows.indexOf(pos.position.split('')[0]);
							var targetCol = pos.position.split('')[1];
							//console.log('were going up', targetRow, targetCol);
							if(targetRow > rows.indexOf('A')){
								if(targetCol > 1){
									var __pos = rows[targetRow - 1] + (parseInt(targetCol) - 1);
									var TargetPos = _.where(vm.pieces, {position: __pos })[0];
									console.log('TargetPos', TargetPos);
									if(TargetPos){
										if(TargetPos.player === undefined){
											vm.validMoves.push({validPos: TargetPos.position, jumping: pos.position });
										}
									}
								}
							}
						}

					}
					else{ //we're going right.
						if(vm.selectedpiece.player==='player2' || vm.selectedpiece.queen ===true){ //we're going up
							var targetRow = rows.indexOf(pos.position.split('')[0]);
							var targetCol = pos.position.split('')[1];
							if(targetRow < rows.indexOf('F')){
								if(targetCol < 4){
									var __pos = rows[targetRow + 1] + (parseInt(targetCol) + 1);
									var TargetPos = _.where(vm.pieces, {position: __pos })[0];
									if(TargetPos){
										if(TargetPos.player === undefined){
											vm.validMoves.push({validPos: TargetPos.position, jumping: pos.position });
										}
									}
								}
							}
						}
						if(vm.selectedpiece.player==='player1' || vm.selectedpiece.queen ===true){ //we're going down
							var targetRow = rows.indexOf(pos.position.split('')[0]);
							var targetCol = pos.position.split('')[1];

							
							if(targetRow > rows.indexOf('A')){
								if(targetCol < 4){

									var __pos = rows[targetRow -1] + (parseInt(targetCol) + 1);
									var TargetPos = _.where(vm.pieces, {position: __pos })[0];
									
									if(TargetPos){
										if(TargetPos.player === undefined){
											vm.validMoves.push({validPos: TargetPos.position, jumping: pos.position });
										}
									}
								}
							}
						}
					}
				}
			}
		};


		vm.GetValidMoves = function(){
			//console.log('GetValidMoves', vm.selectedpiece);
			var index = rows.indexOf(vm.selectedpiece.position.split('')[0]);
			var colindex = parseInt(vm.selectedpiece.position.split('')[1]);

			if(vm.selectedpiece.player==='player2' || vm.selectedpiece.queen ===true){
				if(index < rows.indexOf('F')){
					var Row = rows[index + 1];
					switch(colindex){
						case 1:
							vm.checkDiagonal(Row + (colindex + 1));
							//vm.validMoves.push(Row + col.indexOf(colindex + 1));
							break;
						case 2: 
							vm.checkDiagonal(Row + (colindex + 1));
							vm.checkDiagonal(Row + (colindex - 1));
							//vm.validMoves.push(Row + col.indexOf(colindex + 1));
							//vm.validMoves.push(Row + col.indexOf(colindex - 1));
							break;
						case 3: 
							vm.checkDiagonal(Row + (colindex + 1));
							vm.checkDiagonal(Row + (colindex - 1));
							//vm.validMoves.push(Row + col.indexOf(colindex + 1));
							//vm.validMoves.push(Row + col.indexOf(colindex - 1));
							break;
						case 4:
							vm.checkDiagonal(Row + (colindex - 1));
							//vm.validMoves.push(Row + col.indexOf(colindex - 1));
							break;
					}
				}
			}
			if(vm.selectedpiece.player==='player1' || vm.selectedpiece.queen ===true){
				if(index > rows.indexOf('A')){
					var Row = rows[index - 1];
					switch(colindex){
					case 1:
						vm.checkDiagonal(Row + (colindex + 1));
						//vm.validMoves.push(Row + col.indexOf(colindex + 1));
						break;
					case 2: 
						vm.checkDiagonal(Row + (colindex + 1));
						vm.checkDiagonal(Row + (colindex - 1));
						//vm.validMoves.push(Row + col.indexOf(colindex + 1));
						//vm.validMoves.push(Row + col.indexOf(colindex - 1));
						break;
					case 3: 
						vm.checkDiagonal(Row + (colindex + 1));
						vm.checkDiagonal(Row + (colindex - 1));
						//vm.validMoves.push(Row + col.indexOf(colindex + 1));
						//vm.validMoves.push(Row + col.indexOf(colindex - 1));
						break;
					case 4:
						vm.checkDiagonal(Row + (colindex - 1));
						//vm.validMoves.push(Row + col.indexOf(colindex - 1));
						break;
					}
				}
			}
			
			
		};

		vm.validateMove = function(from, to){
			//console.log(from);
			//console.log(to);
			var currentPosition = _.where(vm.pieces, {position: from})[0];
			//console.log(vm.validMoves);
			var validMove = _.where(vm.validMoves, {validPos: to})[0];
			if(validMove){

				if(validMove.jumping !== undefined){
					var takePiece = _.where(vm.pieces, {position: validMove.jumping})[0];
					takePiece.class= vm.icons.blank;
					takePiece.player=undefined;
					takePiece.queen = false;
					vm.TakenPiece(validMove.jumping);
				}
				return true;
			}

			return false;

/*
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
			return true;*/
		};

		vm.TakenPiece = function(pos){
			socket.emit('taken piece', {name: vm.game.name, position: pos, player: vm.game.player});
		};

		var socket = io();

		vm.message='';

		$scope.sendMessage= function(){
			socket.emit('chat message', vm.message);
			vm.message = '';
		};

		

		$scope.pieceselected=function(position){	
			vm.validMoves = [];
			vm.selectedpiece = _.where(vm.pieces, { position: position })[0];
			vm.GetValidMoves();
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

				//console.log('before vm.validateMove', vm.validateMove(vm.selectedpiece.position, position));

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

		socket.on('player offline', function(msg){
			console.log('player offline');
			if(vm.game.player ==='player1'){
				vm.player2Found = false;
			}

			vm.myturn = false;
			$scope.$apply();
		});

		socket.on('taken piece', function(obj){
			console.log('taken piece', obj);
			var takePiece = _.where(vm.pieces, {position: obj.position})[0];
			takePiece.class= vm.icons.blank;
			takePiece.player=undefined;
			takePiece.queen = false;
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