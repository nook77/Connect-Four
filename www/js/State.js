var State = function(state) {

	this.playerTurn = "pOne";
	this.numOfMoves = 0;
	this.status = "running";
	this.board = game.buildBoard();
	this.result = "";
	this.disabledCols = new Array;
	if (!state) {
		this.miniMaxDepth = 1;
	} else {
		this.miniMaxDepth = state.miniMaxDepth;
	}
	
	if (typeof state !== "undefined") {
		this.board = game.buildBoard(state.board);
		this.playerTurn = state.playerTurn;
		this.numOfMoves = state.numOfMoves;
		this.status = state.status;
		this.result = state.result;
		this.disabledCols = state.disabledCols;
	}
	
	this.changeTurn = function() {
		this.playerTurn = game.togglePlayerTurn(this.playerTurn);
	}
	
	this.availableMoves = function() {
		var moves = new Array();
		for (i = 0;i<game.cols;i++) {
			for (j = 0;j<game.rows;j++) {
				if (this.board[i][j] === "empty") {
					if (game.isValidMove(i,j,this.board)) {
						moves.push({col: i,row: j});
					}
				}
			}
		}
		return moves;
	}
	
	this.isTerminal = function() {
		var winnerObj = game.checkForWin(this.board);
		if (winnerObj) {
			this.result = winnerObj.player + " wins";
			this.status = "ended";
			this.winner = winnerObj.player;
			this.startSquare = winnerObj.startingSquare;
			this.winningDir = winnerObj.dir;
			return true;
		} else if (game.checkForDraw(this.board)) {
			this.result = "draw";
			this.status = "ended";
			return true;
		} else {
			return false;
		}
	}
}