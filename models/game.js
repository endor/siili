(function() {
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
      return {
        board: game.board,
        _id: game._id,
        white: game.white.name,
        prisoners_of_white: game.prisoners_of_white,
        black: game.black ? game.black.name : null,
        prisoners_of_black: game.prisoners_of_black
      }
    },
    
    participate: function(game, user, success, error) {
      if(game.white._id == user._id) {
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