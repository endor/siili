(function() {
  var is_user_white = function(user, game) {
    return user._id === game.white._id
  }
  
  exports.Game = {
    find: function(id, success, error) {
      this.db.getDoc(id, function(err, result) {
        if(err) { console.log(err); return }

        if(result) {
          success(result)
        } else {
          error()
        }
      })
    },
    
    find_by_user: function(user, success, error) {
      this.db.view('game', 'by_user_id', { startkey: user._id, endkey: user._id + "\u9999" }, function(err, result) {
        if(err) { console.log(err); return }

        if(result.rows.length > 0) {
          success(result.rows.map(function(row) { return row.value }))
        } else {
          error()
        }        
      })
    },

    prepare: function(game, user) {
      var active = false
      
      if(game.history.length === 0) {
        active = is_user_white(user, game) && game.black
      } else {
        active = game.history[game.history.length - 1]._id !== user._id
      }
      
      return {
        board: game.board,
        _id: game._id,
        white: game.white.name,
        prisoners_of_white: game.prisoners_of_white,
        black: game.black ? game.black.name : null,
        prisoners_of_black: game.prisoners_of_black,
        active: active,
        resigned_by: game.resigned_by
      }
    },
    
    participate: function(game, user, success, error) {
      if(is_user_white(user, game)) {
        error()
      } else {
        game.black = user
        this.db.saveDoc(game._id, game, function(_err, ok) {
          if(_err) {
            error()
          } else {
            game._id = ok.id
            game._rev = ok.rev
            success(game)
          }
        })
      }
    },
    
    resign: function(game, user, success) {
      game.resigned_by = {
        user: user._id,
        color: is_user_white(user, game) ? 'White' : 'Black'
      }
      this.db.saveDoc(game._id, game, function(_err, ok) {
        if(_err) {
          error()
        } else {
          game._id = ok.id
          game._rev = ok.rev
          success(game)
        }        
      })
    },

    new_to_couchdb: (function() {
      var build_board = function(board_size) {
        var board = {}

        for(var i = 0; i < board_size; i += 1) {
          board[i] = {}
          for(var j = 0; j < board_size; j += 1) {
            board[i][j] = 0
          }
        }

        return board
      }
      
      return function(game, success, error) {
        game.board = build_board(game.board_size)
        game.type = 'game'
        game.history = []
        game.prisoners_of_white = 0
        game.prisoners_of_black = 0
        this.db.saveDoc(game, function(_err, ok) {
          if(_err) {
            error(_err)
          } else {
            game._id = ok.id
            game._rev = ok.rev
            success(game)
          }
        })
      }
    })()
  }
})()