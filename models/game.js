(function() {
  var is_user_white = function(user, game) {
    return user._id === game.white._id
  }
  
  var save_to_couch = function(game, success, error) {
    this.db.saveDoc(game._id, game, function(_err, ok) {
      if(_err) {
        error(_err)
      } else {
        game._id = ok.id
        game._rev = ok.rev
        success(game)
      }        
    })
  }
  
  var handle_couch_results = function(success, error) {
    return function(err, result) {
      if(err) { console.log(err); return }

      if(result.rows.length > 0) {
        success(result.rows.map(function(row) { return row.value }))
      } else {
        error()
      }
    }
  }
  
  var pass = function(game, user) {
    game.passed_by = { user: user._id }
    return game
  }
  
  var end = function(game, user) {
    game.ended = true
    game.passed_by = null
    if(!game.resigned_by) { game = count(game, user) }
    return game
  }
  
  var identify_territory = function(already_looked_up, result, stone) {
    already_looked_up.push(stone.id)
    result.count += 1
    
    stone.directions.forEach(function(direction) {
      var _stone = stone[direction]()
      if(!_stone || already_looked_up.indexOf(_stone.id) >= 0) { return }
      if(_stone.value === 0) { identify_territory(already_looked_up, result, _stone) }
      if(_stone.value !== 0) {
        if(!result.owns) { result.owns = _stone.value }
        if(result.owns !== _stone.value) { result.is_territory = false }
      }
    })
    
    result.already_looked_up = already_looked_up
    return result
  }

  var count = function(game, user) {
    var already_looked_up = []
    game.result = { 1: 0, 2: 0 }

    for(var i = 0; i < game.board_size; i++) {
      for(var j = 0; j < game.board_size; j++) {
        var stone = new Stone({ game: game, user: user, x: i, y: j })
        if(stone.value === 0 && already_looked_up.indexOf(stone.id) < 0) {
          var territory = identify_territory(already_looked_up, { is_territory: true, count: 0 }, stone)
          already_looked_up = territory.already_looked_up
          if(territory.is_territory) { game.result[territory.owns] += territory.count }
        }
      }
    }

    game.result.white = game.result[1] + game.prisoners_of_white
    game.result.black = game.result[2] + game.prisoners_of_black
    game.result.difference = Math.abs(game.result.white - game.result.black)
    
    return game
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
    
    find_open: function(user, success, error) {
      this.db.view('game', 'open', {}, handle_couch_results(success, error))
    },
    
    find_by_user: function(user, success, error) {
      this.db.view('game', 'by_user_id', { startkey: user._id, endkey: user._id + "\u9999" }, handle_couch_results(success, error))
    },

    prepare: (function() {
      var message = function(game, user) {
        var message = null,
          opponent = is_user_white(user, game) ? game.black : game.white
        
        if(game.passed_by) {
          if(game.passed_by.user === user._id) { message = 'You passed.' }
          if(game.passed_by.user !== user._id) { message = opponent.name + ' passed.' }          
        }
        if(game.resigned_by) {
          if(game.resigned_by.user === user._id) { message = 'You resigned.' }
          if(game.resigned_by.user !== user._id) { message = opponent.name + ' resigned.' }          
        }
        if(game.result) {
          if((is_user_white(user, game) && game.result.white > game.result.black) ||
              (!is_user_white(user, game) && game.result.black > game.result.white)) {
            message = 'You have won by ' + game.result.difference.toFixed(1) + '.'
          }
          if((is_user_white(user, game) && game.result.white < game.result.black) ||
              (!is_user_white(user, game) && game.result.black < game.result.white)) {
            message = opponent.name + ' has won by ' + game.result.difference.toFixed(1) + '.'
          }
          if(game.result.difference === 0) {
            message = "The game was even."
          }
        }
        
        return message
      }
      
      var is_active = function(game, user) {
        if(game.history.length === 0) {
          return !!(is_user_white(user, game) && game.black)
        } else {
          return game.history[game.history.length - 1]._id !== user._id
        }
      }
      
      var color = function(game, user) {
        return is_user_white(user, game) ? 'white' : 'black'
      }
      
      var opponent = function(game, user) {
        return is_user_white(user, game) ? (game.black || {name: 'no opponent yet'}).name : game.white.name
      }
      
      return function(game, user) {
        return {
          board: game.board,
          _id: game._id,
          size: game.board_size,
          white: game.white.name,
          prisoners_of_white: game.prisoners_of_white,
          black: game.black ? game.black.name : null,
          prisoners_of_black: game.prisoners_of_black,
          active: is_active(game, user),
          resigned_by: game.resigned_by,
          passed_by: game.passed_by,
          ended: game.ended,
          message: message(game, user),
          color: color(game, user),
          opponent: opponent(game, user),
          result: game.result
        }
      }
    })(),
    
    participate: function(game, user, success, error) {
      if(is_user_white(user, game)) {
        error()
      } else {
        game.black = user
        save_to_couch.call(this, game, success, error)
      }
    },
    
    resign: function(game, user, success, error) {
      game.resigned_by = { user: user._id }
      game = end(game, user)
      save_to_couch.call(this, game, success, error)
    },

    pass: function(game, user, success, error) {
      var color = is_user_white(user, game) ? 'white' : 'black'
      if(game.passed_by && game.passed_by.user !== user._id) {
        game = end(game, user)
      } else {
        game = pass(game, user)
      }
      game.history.push({x: null, y: null, passed: true, _id: user._id, color: color})
      save_to_couch.call(this, game, success, error)
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