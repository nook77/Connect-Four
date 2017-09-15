var game = {

	init: function(level){
		_this = this;
		_this.rows = Config.numRows;
		_this.cols = Config.numCols;
		_this.squares = new Object();
		_this.players = "one";
		_this.state = new State(undefined,level);
		_this.ai = new AI(level);
		_this.directionsArray = ["n","ne","e","se","s","sw","w","nw"];
		
		
		//gameView.renderBoard(this.board);
		gameView.renderTopArrows();
		gameView.removeOpacity();
		game.activateArrows();
		startScreenView.hideStartScreen();
		//startScreenView.buildMainMenu();
		//startScreen.bindClicks();
		
		console.log("starting a game at level " + level);
	}	
}

game.buildBoard = function(board) {
	var newBoard = [];
	for(var col = 0;col<game.cols;col++){
		newBoard[col] = new Array();
		for(var row = 0;row<game.rows;row++){
			newBoard[col][row] = "empty";
			
			if (typeof board !== "undefined") {
				newBoard[col][row] = board[col][row];
			}
		}
	}	
	return newBoard;
}

game.togglePlayerTurn = function(player) {
	if (player === "pOne") {
		return "pTwo";
	} else {
		return "pOne";
	}
}

game.isValidMove = function(col,row,board) {
	if (board[col][row] !== "empty") {
		return false;
	}
	
	var newRow = squares.findEmptyRow(col,board);
	if (newRow !== row) {
		return false;
	}
	return true;
}

game.updateState = function(state) {
	game.state = state;
}

game.getScore = function(state) {
	var score = 0;
	var numOfConnections = 0;
	var numOfOpenConnections = 0;
    if (state.status !== "running") {
        if (state.result === "pOne wins") {
            score = 1000 - state.numOfMoves;
        }
        else if (state.result === "pTwo wins") {
            score = -1000 + state.numOfMoves;
        }
        else {
            score = 0;
        }
/*    } else {
    	if (state.playerTurn === "pOne") {
    		numOfConnections = squares.getNumOfConnections("pOne",state.board); 
    		numOfOpenConnections = squares.getNumOfOpenConnections("pOne",state.board);
    		
    		score = (numOfConnections * 1) + numOfOpenConnections;
    	} else {
    		numOfConnections = squares.getNumOfConnections("pTwo",state.board);
    		numOfOpenConnections = squares.getNumOfOpenConnections("pTwo",state.board);
    		score = (numOfConnections * 1) + numOfOpenConnections;
    		if (score) {
    			score = score * -1;
    		}
    	}*/
    }
    return score;
}

game.disableColumn = function(col) {
	var arrowId = "#arrow_" + col;
	
	$(arrowId).off("click");
	$("div[id^='s"+col+"']").off("click");
	gameView.hideArrow(arrowId);
	game.state.disabledCols.push(col);
}

game.disableAllColumns = function() {
	$("div[id^='arrow']").off("click");
	$(".square").off("click");
	gameView.hideAllArrows();
}

game.getWinningSquares = function(state) {
	var player = state.winner;
	var square = state.startSquare;
	var dir = state.winningDir;
	var nextSquare;
	var winningSquares = new Array;
	
	winningSquares.push(square);
	
	for (var i=0; i < Config.numForWin-1; i++) {
		nextSquare = squares.getNextSquareInDirection(square, dir);
		winningSquares.push(nextSquare);
		square = nextSquare;
	}
	
	return winningSquares;
}

game.showWinningSquares = function(winningSquares, index) {
	
	if (!index) {
		index = 0;
	}
	if (index<winningSquares.length) {
		setTimeout(function(){
			gameView.showWinningSquare(winningSquares[index]);
			index++;
			game.showWinningSquares(winningSquares, index);
		}, 250);
	} else {
		setTimeout(function() {
			$(document).trigger("winningSquaresShown");
		}, 250);
	}
}

game.checkForWin = function(board) {
	var square;
	var col;
	var row;
	var nextSquare;
	var occupant;
	var numOfConnections = 0;
	
	for (var col = 0;col<game.cols;col++) {
		for (var row = 0;row<game.rows;row++) {
			square = {col:col,row:row};
			occupant = board[square.col][square.row];
			if (occupant === "empty") {
				continue;
			}
			
			//check each direction for number of connections
			numOfConnections = squares.findConnectionsInDirection(square,board,occupant,'n');
			if (numOfConnections >= Config.numForWin) {
				return {"player": occupant, "startingSquare": square, "dir": "n"};
			} else {
				numOfConnections = 0;
			}
			
			numOfConnections = squares.findConnectionsInDirection(square,board,occupant,'ne');
			if (numOfConnections >= Config.numForWin) {
				return {"player": occupant, "startingSquare": square, "dir": "ne"};
			} else {
				numOfConnections = 0;
			}
			
			numOfConnections = squares.findConnectionsInDirection(square,board,occupant,'e');
			if (numOfConnections >= Config.numForWin) {
				return {"player": occupant, "startingSquare": square, "dir": "e"};
			} else {
				numOfConnections = 0;
			}
			
			numOfConnections = squares.findConnectionsInDirection(square,board,occupant,'se');
			if (numOfConnections >= Config.numForWin) {
				return {"player": occupant, "startingSquare": square, "dir": "se"};
			} else {
				numOfConnections = 0;
			}
			
			numOfConnections = squares.findConnectionsInDirection(square,board,occupant,'s');
			if (numOfConnections >= Config.numForWin) {
				return {"player": occupant, "startingSquare": square, "dir": "s"};
			} else {
				numOfConnections = 0;
			}
			
			numOfConnections = squares.findConnectionsInDirection(square,board,occupant,'sw');
			if (numOfConnections >= Config.numForWin) {
				return {"player": occupant, "startingSquare": square, "dir": "sw"};
			} else {
				numOfConnections = 0;
			}
			
			numOfConnections = squares.findConnectionsInDirection(square,board,occupant,'w');
			if (numOfConnections >= Config.numForWin) {
				return {"player": occupant, "startingSquare": square, "dir": "w"};
			} else {
				numOfConnections = 0;
			}
			
			numOfConnections = squares.findConnectionsInDirection(square,board,occupant,'nw');
			if (numOfConnections >= Config.numForWin) {
				return {"player": occupant, "startingSquare": square, "dir": "nw"};
			} else {
				numOfConnections = 0;
			}
		}
	}
	return false;
}

game.checkForDraw = function(board) {
	for(var col = 0;col<game.cols;col++){
		for(var row = 0;row<game.rows;row++){
			if (board[col][row] === "empty") {
				return false;
			}
		}
	}
	return true;
}

game.getMinimaxVal = function(state) {
	if (state.isTerminal() || state.miniMaxDepth > game.ai.level) {
		return game.getScore(state);
	}
	
	//console.log("board:");
	//console.log(state.board);
	//console.log("depth: " + state.miniMaxDepth);
	//console.log("score: " + game.getScore(state));
	
	var stateScore;
	
	if (state.playerTurn === "pOne") {
		stateScore = -1000;
	} else {
		stateScore = 1000;
	}
	
	var availableMoves = state.availableMoves();
	
	var availableNextStates = availableMoves.map(function(coords) {
		//var action = new AI.makeMove(pos);
		//var nextState = action.applyMoveTo(state);
		//nextState.miniMaxDepth++;
		//return nextState;
		
		
		var move = {};
        move.coords = coords;
        
        //create a new state in which we will add the new piece into
        var nextState = new State(state);
		
		//adding the new piece to the new state
		nextState.board = squares.addPiece(coords,nextState.playerTurn,nextState.board);
		
		nextState.numOfMoves++;
		nextState.changeTurn();
		nextState.miniMaxDepth++;
		
		return nextState;
		
		//if (game.ai.level > 1) {
        //	move.minimaxVal = game.getMinimaxVal(nextState, this.level);
        //}
		//move.nextState = nextState;
        //return move;
	});
	
	availableNextStates.forEach(function(nextState) {
		
		var nextScore = game.getMinimaxVal(nextState); //recursive call

		if (state.playerTurn === "pOne") {
			if (nextScore > stateScore) {
				stateScore = nextScore;
			}
		} else {
			if (nextScore < stateScore) {
				stateScore = nextScore;
			}
		}
	});
	return stateScore;
}

game.resetGame = function(level) {
	gameView.removeBoard();
	gameView.renderBoard();
	gameView.addOpacity();
	gameView.hideWinnerBox();
	startScreenView.buildStartScreen(level);
	startScreenView.showStartScreen();
	startScreen.unBindClicks();
	startScreen.bindClicks(level);
}

game.activateContBtns = function() {
	$('#nextLevel').on("click", function(event) {
		console.log("continue");
		game.ai.level++;
		game.resetGame(game.ai.level);
	});
	$('#rematch').on("click", function(event) {
		console.log("rematch");
		game.resetGame(game.ai.level);
	});
}

game.deactivateContBtns = function() {
	$('#nextLevel').off("click");
	$('#rematch').off("click");
}

game.activateArrows = function() {
	$('.arrow').click(function() {
		var col = $(this).attr('id').match(/^arrow_(.*?)$/);
		col = col[1];
		$(document).trigger("playerMakesMove", col);
	});
	$('.square').click(function() {
		var col = $(this).attr('id').match(/^s(.*?)_/);
		col = col[1];
		$(document).trigger("playerMakesMove", col);
	});
}

game.deActivateArrows = function() {
	$('.arrow').off("click");
	$('.square').off("click");
}

game.updateWinnerBox = function(result) {
	var text;
	var nextBtn;
	
	if (result === "pOne wins") {
		text = "You Win!";
		nextBtn = 'Continue';
	} else if (result === "pTwo wins") {
		text = "You Lose!";
		nextBtn = 'Rematch';
	} else {
		text = "Draw Game!";
		nextBtn = "Rematch";
	}
	gameView.addWinnerText(text,nextBtn);
	//$('#mainWindow').prepend('<div class="winnerBox"><div class="pName">' + playerText + '</div>'+nextBtn+'</div>');
}