var sys = require('sys')

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

GameService.prototype.find_by_identifier = function(identifier) {
  var result = null
  for(var i = 0; i < this.data.length; i++) {
    if(this.data[i]['identifier'] == identifier) {
      result = this.data[i]
      break
    }
  }
  return result
}

GameService.prototype.participate = function(user) {
  if(this.white.identifier == user.identifier) {
    return false 
  } else {
    this.black = user
    return true    
  }
}

GameService.prototype.save = function(game) {
  game.board = this.build_board(game.board_size)
  game.identifier = this.build_id()
  game.participate = this.participate
  
  this.data[this.data.length] = game
  return game
}

exports.GameService = GameService