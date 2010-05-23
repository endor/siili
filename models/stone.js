var sys = require('sys')

StoneService = function() {}

StoneService.prototype.validate = function(options) {
  var errors = [], game = options.game, user = options.user, x = options.x,
      y = options.y, history = game.history
      
  if(history.length == 0 && user.identifier != game.white.identifier) { errors.push("It's not your turn.") }
  if(history.length > 0  && user.identifier == history[history.length - 1].identifier) { errors.push("It's not your turn.") }
  
  return errors
}

StoneService.prototype.set = function(options) {
  var game = options.game, user = options.user, value = 1, color = 'white',
      x = options.x, y = options.y
      
  if(user.identifier == game.black.identifier) { value = 2; color = 'black' }
  
  game.board[x][y] = value
  game.history.push({x: x, y: y, identifier: user.identifier, color: color})
}

exports.StoneService = StoneService