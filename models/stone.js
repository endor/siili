(function() {
  Stone = function(options) {
    var stone = this;

    ['x', 'y', 'user', 'game'].forEach(function(attr) {
      stone[attr] = options[attr]
    })

    stone.id = stone.x + '' + stone.y
    stone.value = stone.game.board[stone.x][stone.y]
  }

  Stone.prototype.directions = ['east', 'south', 'north', 'west']

  Stone.prototype.validate = function() {
    var errors = [], history = this.game.history

    if(this.game.board[this.x][this.y] !== 0) { errors.push("There's already a stone on this field.") }
    if(history.length === 0 && this.user.identifier !== this.game.white.identifier) { errors.push("It's not your turn.") }
    if(history.length > 0  && this.user.identifier === history[history.length - 1].identifier) { errors.push("It's not your turn.") }
    if(!this.game.black || !this.game.white) { errors.push("There needs to be another player before the game can start.") }
    
    return errors
  }

  Stone.prototype.set = function(options) {
    var value = 1, color = 'white', stone = this

    if(this.user.identifier === this.game.black.identifier) { value = 2; color = 'black' }

    this.game.board[this.x][this.y] = value
    this.game.history.push({x: this.x, y: this.y, identifier: this.user.identifier, color: color})

    // this.directions.forEach(function(direction) {
    //   var _stone = stone[direction].call(stone)
    //   if(_stone && _stone.value !== value && _stone.value !== 0) {
    //     if(!stone.free(_stone, [])) {
    //       stone.destroy(color, _stone, [])
    //     }
    //   }
    // })
  };

  (function() {
    var direction = function(callback, x, y) {
      if(callback.call(this)) {
        var value = this.game.board[x][y],
          user = null

        if(value === 1) { user = this.game.white }
        if(value === 2) { user = this.game.black }

        return new Stone({ game: this.game, user: user, x: x, y: y })
      } else {
        return null
      }  
    }

    Stone.prototype.north = function() {
      return direction.call(this, function() { return this.y - 1 >= 0 }, this.x, this.y - 1)
    }

    Stone.prototype.south = function() {
      return direction.call(this, function() { return this.y + 1 < this.game.board_size }, this.x, this.y + 1)
    }

    Stone.prototype.east = function() {
      return direction.call(this, function() { return this.x - 1 >= 0 }, this.x - 1, this.y)  
    }

    Stone.prototype.west = function() {
      return direction.call(this, function() { return this.x + 1 < this.game.board_size }, this.x + 1, this.y)
    }  
  })()

  Stone.prototype.free = function(stone, already_looked_up) {
    var free = false, that = this
    already_looked_up.push(stone.id);

    this.directions.forEach(function(direction) {
      var _stone = stone[direction].call(that)
      if(!_stone) { return }
      if(_stone.user && _stone.user.identifier === stone.user.identifier
          && already_looked_up.indexOf(_stone.id) < 0) {
        free = free || stone.free(_stone, already_looked_up)
      } else if(_stone.game.board[_stone.x][_stone.y] === 0) {
        free = free || true
      }
    })

    return free
  }

  Stone.prototype.destroy = function(color, stone, already_destroyed) {
    already_destroyed.push(stone.id)

    this.directions.forEach(function(direction) {
      var _stone = stone[direction]()

      if(!_stone) { return }

      if(_stone.user && _stone.user.identifier === stone.user.identifier
          && already_destroyed.indexOf(_stone.id) < 0) {
        _stone.destroy(color, _stone, already_destroyed)
      }
    })

    stone.game.board[stone.x][stone.y] = 0
    stone.game['prisoners_of_' + color] += 1
  }

  exports.Stone = Stone
})()