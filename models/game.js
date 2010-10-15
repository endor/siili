(function() {
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

  GameService.prototype.find_all_by_user = function(user) {
    var result = []
    for(var i = 0; i < this.data.length; i++) {
      var game = this.data[i];
      if((game.white && game.white.identifier == user.identifier) ||
         (game.black && game.black.identifier == user.identifier)) {
        result.push(GameService.prototype.prepare.call(game, user))
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

  GameService.prototype.prepare = function(user) {
    return {
      board: this.board,
      identifier: this.identifier,
      white: this.white.name,
      prisoners_of_white: this.prisoners_of_white,
      black: this.black ? this.black.name : null,
      prisoners_of_black: this.prisoners_of_black
    }
  }

  GameService.prototype.save = function(game) {
    game.board = this.build_board(game.board_size)
    game.identifier = this.build_id()
    game.participate = this.participate
    game.prepare = this.prepare
    game.history = []
    game.prisoners_of_white = 0
    game.prisoners_of_black = 0

    this.data[this.data.length] = game
    return game
  }

  exports.GameService = GameService  
})()