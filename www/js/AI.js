var AI = function(level) {
	
	this.level = level;	
}

AI.chooseMove = function(turn,state) {
	var openSquares = game.state.availableMoves();
	
    var availableMoves = openSquares.map(function(coords) {
        var move = {};
        move.coords = coords;
        
        //create a new state in which we will add the new piece into
        var nextState = new State(state);
		
		//adding the new piece to the new state
		nextState.board = squares.addPiece(coords,nextState.playerTurn,nextState.board);
		
		nextState.numOfMoves++;
		nextState.changeTurn();
		
		if (game.ai.level > 1) {
        	move.minimaxVal = game.getMinimaxVal(nextState, this.level);
        }
		move.nextState = nextState;
        return move;
    });
    
    var count = 0;
    availableMoves.forEach(function(move) {
    	console.log(count + ": " + move.minimaxVal);
    	count++;
    });

    //sort the enumerated actions list by score
    if (game.ai.level > 1) {
		if (turn === "pOne") {
			availableMoves.sort(AI.sortDescending);
		} else {
			availableMoves.sort(AI.sortAscending);
		}
		
		//check to see if there are moves with duplicate scores. If so, choose a random move from those
		var sameScores = new Array;
		sameScores.push(availableMoves[0]);
		for (var i=1; i<availableMoves.length; i++) {
			if (availableMoves[i].minimaxVal === availableMoves[0].minimaxVal) {
				sameScores.push(availableMoves[i]);
			}
		}
		
		var col = Math.floor(Math.random()*sameScores.length);
		var chosenAction = availableMoves[col];
	} else {
		var numOfMoves = availableMoves.length;
		var index = Math.floor(Math.random()*numOfMoves);

		var chosenAction = availableMoves[index];
	}
    //var nextState = chosenAction.applyMoveTo(game.state);
    var nextState = chosenAction.nextState;
	gameView.renderPiece(chosenAction.coords, turn, nextState)
	
	//If the move is the last row in a column, disable the column
	if (chosenAction.coords.row === 0) {
		game.disableColumn(chosenAction.coords.col);
	}
    // take the game to the next state
    game.updateState(nextState);
    game.activateArrows();
}

AI.sortAscending = function(a, b) {
    if (a.minimaxVal < b.minimaxVal) {
        return -1;
    } else if (a.minimaxVal > b.minimaxVal) {
        return 1;
    } else {
        return 0;
    }
}

AI.sortDescending = function(a, b) {
    if (a.minimaxVal > b.minimaxVal) {
        return -1;
    } else if (a.minimaxVal < b.minimaxVal) {
        return 1;
    } else {
        return 0;
    }
}