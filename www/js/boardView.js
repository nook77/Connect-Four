var boardView = function() {
}

boardView.renderBoard = function(board) {
	var squares = "";
	$('#board').css('width', 100 * game.cols + 'px');
    for (var row = 0; row < game.rows;row++)
    {
      for(var col = 0; col < game.cols;col++){
       squares += '<div id="s' + col + '_' + row + '" class="square"><div class="circle"></div></div>';
      }
       
    }
    $('#board').append(squares);
}