var gameView = function() {
}

gameView.renderBoard = function() {
	var squares = "";
    for (var row = 0; row < Config.numRows;row++)
    {
      for(var col = 0; col < Config.numCols;col++){
       squares += '<div id="s' + col + '_' + row + '" class="square"><div class="circle"></div></div>';
      }
       
    }
    $('#board').append(squares);
}

gameView.renderTopArrows = function() {
	var arrows = "";
	for (var i = 0; i < Config.numCols; i++) {
		var squareId = "#s" + i + "_0";
		arrows += '<div id="arrow_' + i +'" class="arrow"><img src="images/down_arrow.jpeg"/></div>';
	}
	$('#arrows').prepend(arrows);
}

gameView.renderPiece = function(coords, player, state) {
	var col = coords.col;
	var row = coords.row;
	
	var squareId = 's' + col + '_' + row;
	var pieceId = "p" + col + '_' + row;
	
	var sqHeight = parseInt($('.square').css('height'));
	var topPlacement = (row + 1) * -sqHeight;
	//topPlacement = topPlacement * -1;
	//$('#' + squareId).append('<div id ="' + pieceId + '" class="piece ' + player +'"></div>');
	$('#' + squareId).append('<div id ="' + pieceId + '" class="piece ' + player +'"></div>');
	$('#' + pieceId).css("top", topPlacement);
	//$('#' + arrowId).append('<div id ="' + pieceId + '" class="piece ' + player +'"></div>');
	
	gameView.dropPiece(pieceId,col,state);
}

gameView.dropPiece = function(pieceId,col,state) {
	$('#' + pieceId).animate({
		top: 0
	}, 400, function() {
    gameView.rebound(pieceId,col,state);
  });
}

gameView.rebound = function(pieceId,col,state) {
	$('#' + pieceId).animate({
		top: -20
	}, 80, function() {
		gameView.land(pieceId,col,state);
	});
}

gameView.land = function(pieceId,col,state) {
	$('#' + pieceId).animate({
		top: 0
	}, 80, function() {
    $(document).trigger("pieceDropped",[col,state]); 
  });
}

gameView.showWinningSquare = function(square) {
	var id = '#s'+square.col+'_'+square.row;
	$(id).addClass("winner");
}

gameView.hideArrow = function(arrowId) {
	$(arrowId + " img").css("display", "none");
}

gameView.hideAllArrows = function() {
	$(".arrow").css("display", "none");
}

/*
gameView.updateWinnerBox = function(result) {
	$('.winnerBox').remove();
	var playerText = "You Win!";
	var contText = "Continue?";
	var nextBtn = '<input type="button" value="Continue?" id="contBtn"/>';
	if (result === "pTwo wins") {
		playerText = "You Lose!";
		contText = "Rematch?";
		var nextBtn = '<input type="button" value="Rematch?" id="rematchBtn"/>';
	}
	$('#mainWindow').prepend('<div class="winnerBox"><div class="pName">' + playerText + '</div>'+nextBtn+'</div>');
}
*/

gameView.addWinnerText = function(text,button) {
	$('#winnerBox .pName').text(text);
	if (button === "Continue") {
		$('#winnerBox button').attr('id', "nextLevel");
		$('#winnerBox button').text("Continue?");
	} else {
		$('#winnerBox button').attr('id', "rematch");
		$('#winnerBox button').text("Rematch?");
	}
}

gameView.showWinnerBox = function(result) {
	$('#winnerBox').css("display", "block");
}

gameView.hideWinnerBox = function() {
	$('#winnerBox').css("display", "none");
} 

gameView.addOpacity = function() {
	$('#board').addClass('opaque');
}

gameView.removeOpacity = function() {
	$('#board').removeClass('opaque');
}

gameView.removeBoard = function() {
	$('.square').remove();
	$('.arrow').remove();
}