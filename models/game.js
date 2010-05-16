GameService = function() {}
GameService.prototype.data = []

GameService.prototype.build_id = function() {
  return new Date().getTime()
}

GameService.prototype.build_board = function(board_size) {
  var board = {}
  
  for(var i = 0; i < board_size; i += 1) {
    board[i] = {}
    for(var j = 0; j < board_size; j += 1) {
      board[i][j] = 0
    }
  }
  
  return board
}

GameService.prototype.save = function(game) {
  game.board = this.build_board(game.board_size)
  game.identifier = this.build_id()
  
  this.data[this.data.length] = game
  return game
}

exports.GameService = GameService